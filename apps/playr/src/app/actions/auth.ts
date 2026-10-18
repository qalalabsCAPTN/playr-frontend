'use server';

import { AuthService } from '@/lib/auth/service';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Server Action: Sign Out
 */
export async function logoutAction(): Promise<ActionResponse> {
  try {
    await AuthService.signOut();
    revalidatePath('/');
    return { success: true };
  } catch (e: any) {
    console.error('Logout error:', e);
    return { success: false, error: e.message || 'Logout failed' };
  } finally {
    redirect('/');
  }
}

/**
 * Server Action: Get Current Profile
 */
export async function getProfileAction() {
  try {
    return await AuthService.getCurrentProfile();
  } catch (e) {
    console.error('Get profile error:', e);
    return null;
  }
}

/**
 * Server Action: Start Phone OTP
 */
export async function signInWithPhoneAction(phone: string): Promise<ActionResponse> {
  try {
    const result = await AuthService.signInWithPhone(phone);
    if (result.error) return { success: false, error: result.error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Failed to send code. Please try again.' };
  }
}

/**
 * Server Action: Verify OTP
 */
export async function verifyOTPAction(phone: string, token: string): Promise<ActionResponse> {
  try {
    const result = await AuthService.verifyOTP(phone, token);
    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath('/');
    return { success: true, data: result.data };
  } catch (e: any) {
    return { success: false, error: 'Verification failed. Please try again.' };
  }
}

/**
 * Server Action: Email Sign In
 */
export async function signInWithEmailAction(email: string, password: string): Promise<ActionResponse> {
  try {
    const result = await AuthService.signInWithEmail(email, password);
    if (result.error) return { success: false, error: result.error.message };
    revalidatePath('/');
    return { success: true, data: result.data };
  } catch (e: any) {
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

/**
 * Server Action: Email Sign Up
 */
export async function signUpWithEmailAction(
  email: string,
  password: string,
  fullName?: string
): Promise<ActionResponse> {
  try {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return { success: false, error: 'Enter a valid email address.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://playr.in';
    const { data, error } = await supabase.auth.signUp({
      email: normalized,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
        data: {
          full_name: fullName?.trim() || '',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.user?.id) {
      const admin = createAdminClient();
      await admin.from('profiles').upsert({
        id: data.user.id,
        email: normalized,
        full_name: fullName?.trim() || '',
        role: 'member',
      });
    }

    revalidatePath('/');
    return { success: true, data };
  } catch (e: any) {
    console.error('Sign up error:', e);
    return { success: false, error: 'Sign up failed. Please try again.' };
  }
}

/**
 * Server Action: Update Profile Details
 */
export async function updateProfileAction(partial: { full_name?: string; avatar_url?: string; phone?: string }): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from('profiles')
      .update(partial)
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/account');
    revalidatePath('/profile');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Update failed' };
  }
}
