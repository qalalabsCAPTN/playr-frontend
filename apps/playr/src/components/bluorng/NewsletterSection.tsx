'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="newsletter">
      <h2>Join the movement of champions</h2>
      <p>Subscribe for early access to drops, official team merchandise, and performance tips.</p>
      {subscribed ? (
        <p className="newsletter__success">You&apos;re on the list — welcome to playR.</p>
      ) : (
        <form className="newsletter__form" onSubmit={submit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </section>
  );
}
