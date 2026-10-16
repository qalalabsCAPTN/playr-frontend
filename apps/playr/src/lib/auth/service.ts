import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { User, UserRole, deriveTier } from '@/store/authStore';

const debug = process.env.NODE_ENV === 'development'
  ? (msg: string, ...args: unknown[]) => console.log('[AuthService]', msg, ...args)
  : () => {};

/**
 * Auth Service — domain logic for authentication and profile management in playR.
 * Backed by Supabase Auth and public.profiles.
 */
export const AuthService = {
  /**
   * Fetches the current user profile from Supabase.
   * Auto-bootstraps profile on first sign-in if missing.
   */
  async getCurrentProfile(): Promise<User | null> {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    debug('getSession result:', { hasSession: !!session, userId: session?.user?.id });

    if (!session?.user) {
      debug('no session found');
      return null;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, created_at, sprr_balance, tier')
        .eq('id', session.user.id)
        .single();

      if (error && /sprr_balance/i.test(error.message)) {
        debug('sprr_balance column missing — retrying without it');
        const retry = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, role, created_at')
          .eq('id', session.user.id)
          .single();
        if (retry.error) debug('profile fetch error:', retry.error.message);
        return retry.data;
      }

      if (error) debug('profile fetch error:', error.message);
      return data;
    };

    let profile = await fetchProfile();

    if (!profile) {
      debug('profile missing — attempting bootstrap insert for user:', session.user.id);

      const admin = createAdminClient();
      const userEmail = session.user.email?.toLowerCase() || null;
      const userName = session.user.user_metadata?.full_name ||
                       session.user.user_metadata?.name ||
                       (userEmail ? userEmail.split('@')[0] : 'playR Member');

      const { error: insertError } = await admin
        .from('profiles')
        .insert({
          id: session.user.id,
          full_name: userName,
          avatar_url: session.user.user_metadata?.avatar_url || null,
          email: userEmail,
          role: 'member',
        });

      if (insertError) {
        debug('profile bootstrap insert error:', insertError.message);
      } else {
        debug('profile created with role: member');
      }

      profile = await fetchProfile();
    } else if (!profile.email && session.user.email) {
      debug('profile email missing — executing self-healing update');
      const admin = createAdminClient();
      const userEmail = session.user.email.toLowerCase();
      const { error: updateError } = await admin
        .from('profiles')
        .update({ email: userEmail })
        .eq('id', session.user.id);

      if (updateError) {
        debug('profile email update error:', updateError.message);
      } else {
        debug('profile email updated successfully');
        profile.email = userEmail;
      }
    }

    if (!profile) {
      debug('profile still null after bootstrap, falling back to session metadata');
      const userEmail = session.user.email || null;
      const userName = session.user.user_metadata?.full_name ||
                       session.user.user_metadata?.name ||
                       (userEmail ? userEmail.split('@')[0] : 'playR Member');
      return {
        id: session.user.id,
        username: '',
        name: userName,
        phone: session.user.phone || '',
        email: userEmail,
        avatar: session.user.user_metadata?.avatar_url || null,
        referralCode: '',
        walletId: '',
        joinedFrom: '',
        authProvider: (session.user.app_metadata?.provider as any) || 'google',
        isOnboarded: true,
        memberSince: session.user.created_at || new Date().toISOString(),
        sprrBalance: 0,
        role: 'member',
        tier: 'STREET',
      };
    }

    const balance = (profile as any).sprr_balance || 0;
    const activeTier = (profile as any).tier || deriveTier(balance);

    return {
      id: profile.id,
      username: '',
      name: profile.full_name || (session.user.email ? session.user.email.split('@')[0] : 'playR Member'),
      phone: session.user.phone || '',
      email: profile.email || session.user.email || null,
      avatar: profile.avatar_url,
      referralCode: '',
      walletId: '',
      joinedFrom: '',
      authProvider: (session.user.app_metadata?.provider as any) || 'google',
      isOnboarded: true,
      memberSince: profile.created_at || session.user.created_at || new Date().toISOString(),
      sprrBalance: balance,
      role: (profile.role as UserRole) || 'member',
      tier: activeTier,
    };
  },

  /**
   * Email + password sign in.
   */
  async signInWithEmail(email: string, password: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  /**
   * Update password.
   */
  async updatePassword(newPassword: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  },

  /**
   * Starts the OTP flow.
   */
  async signInWithPhone(phone: string) {
    const supabase = await createClient();
    const prefix = process.env.NEXT_PUBLIC_PHONE_PREFIX || '+91';
    const { error } = await supabase.auth.signInWithOtp({
      phone: `${prefix}${phone}`,
    });
    return { error };
  },

  /**
   * Verifies the OTP.
   */
  async verifyOTP(phone: string, token: string) {
    const supabase = await createClient();
    const prefix = process.env.NEXT_PUBLIC_PHONE_PREFIX || '+91';
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `${prefix}${phone}`,
      token,
      type: 'sms',
    });
    return { data, error };
  },

  /**
   * Signs out the current user.
   */
  async signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
};
