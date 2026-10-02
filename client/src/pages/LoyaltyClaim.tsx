import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Heart, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

// Separate from the standard booking form (Reservations.tsx) by design —
// the loyalty offer (see content/promotions.ts, id: 'repeat-customer') is
// only valid on a diver's 2nd visit, so this form exists to let returning
// divers self-report their previous visit for staff to verify before the
// discount is honored, rather than mixing that verification step into the
// general reservation flow.
export default function LoyaltyClaim() {
  const { data: settings } = useWebsiteSettings();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [previousVisitDate, setPreviousVisitDate] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const client = supabase;
    if (!client) {
      toast.error('Loyalty verification system is not configured yet. Please email us directly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await client.from('loyalty_claims').insert({
        full_name: fullName,
        email,
        previous_visit_date: previousVisitDate || null,
        booking_reference: bookingReference || null,
        promo_code: 'LOYAL8',
      }).select();
      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Loyalty Claim Submitted!', {
        description: 'Our team will verify your previous visit and follow up by email with your discount code.',
      });
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="relative py-20 border-b border-border">
        <div className="container text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Loyalty Offer — 2nd Visit</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mt-2 mb-4">Welcome Back, Diver</h1>
          <p className="text-muted-foreground">
            This offer is reserved for divers returning to Dive Dream for their second visit. Confirm a few details below and our team will verify your previous trip before applying your discount.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-xl">
          {isSubmitted ? (
            <div className="glass-panel p-8 md:p-10 space-y-6 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto animate-glow">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Claim Submitted!</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Thank you — we've received your details. Once our team verifies your previous visit, we'll email you your loyalty discount code to use on the standard booking form.
              </p>
              <a
                href={`mailto:${settings?.contact.email ?? ''}`}
                className="btn-premium-primary py-3 px-6 text-sm inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email Operations Desk
              </a>
            </div>
          ) : (
            <div className="glass-panel p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Confirm Your Previous Visit</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">Approximate Date of Previous Visit</label>
                  <input
                    type="date"
                    value={previousVisitDate}
                    onChange={(e) => setPreviousVisitDate(e.target.value)}
                    className="bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="text-[11px] text-muted-foreground">Not sure of the exact date? An approximate month/year is fine.</span>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold">Booking Reference (if you have one)</label>
                  <input
                    type="text"
                    value={bookingReference}
                    onChange={(e) => setBookingReference(e.target.value)}
                    placeholder="e.g. DD-XXXXXXXXX"
                    className="bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-premium-primary w-full py-3.5 text-sm font-semibold uppercase tracking-widest">
                  {isSubmitting ? 'Submitting...' : 'Submit Loyalty Claim'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
