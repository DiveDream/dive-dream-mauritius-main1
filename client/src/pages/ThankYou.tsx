import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { CheckCircle, Calendar, Users, Mail, Phone } from 'lucide-react';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

export interface BookingConfirmationState {
  bookingRef: string;
  fullName: string;
  email: string;
  preferredDate: string;
  peopleCount: number;
  selectionLabel: string | null;
}

// Wouter's navigate(to, { state }) pushes `state` via history.pushState, so
// it's read directly off window.history.state here rather than through
// wouter's useHistoryState hook — that hook lives in the separate
// 'wouter/use-browser-location' submodule, which Vite pre-bundles into its
// own dependency chunk and ends up resolving a different React instance,
// crashing with "Invalid hook call" / "Cannot read properties of null
// (reading 'useSyncExternalStore')" the moment this page rendered.
function readBookingConfirmation(): BookingConfirmationState | null {
  const state = window.history.state;
  return state && typeof state === 'object' && 'bookingRef' in state ? (state as BookingConfirmationState) : null;
}

export default function ThankYou() {
  const booking = readBookingConfirmation();
  const { data: settings } = useWebsiteSettings();

  return (
    <Layout>
      <section className="py-24">
        <div className="container max-w-2xl">
          <div className="glass-panel p-8 md:p-10 space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4 animate-glow">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Reservation Initiated!</h1>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Your reservation request has been registered in our secure system. A confirmation and invoice details have been dispatched to your email.
              </p>
            </div>

            {booking && (
              <div className="bg-secondary/60 border border-border rounded-xl p-6 space-y-4 text-sm">
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Booking Reference:</span>
                  <span className="text-foreground font-mono font-bold tracking-wider">{booking.bookingRef}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block text-xs">Primary Diver</span>
                    <span className="text-foreground font-semibold mt-0.5 block">{booking.fullName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Email Address</span>
                    <span className="text-foreground font-semibold mt-0.5 block">{booking.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Preferred Date</span>
                    <span className="text-foreground font-semibold mt-0.5 block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> {booking.preferredDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Number of People</span>
                    <span className="text-foreground font-semibold mt-0.5 block flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" /> {booking.peopleCount}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <span className="text-muted-foreground block text-xs mb-1">Itinerary Selection</span>
                  {booking.selectionLabel ? (
                    <span className="text-primary font-semibold">{booking.selectionLabel}</span>
                  ) : (
                    <span className="text-foreground font-semibold">Custom Guided Dive Expedition</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-center">
              <Link href="/reservations" className="btn-premium-secondary py-3 px-6 text-sm text-center">
                Make Another Booking
              </Link>
              <a
                href={`mailto:${settings?.contact.email ?? ''}`}
                className="btn-premium-primary py-3 px-6 text-sm flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email Operations Desk
              </a>
              {(settings?.contact.phone ?? []).map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="btn-premium-secondary py-3 px-6 text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call {phone}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
