import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { MapPin, Phone, Mail, Clock, Send, Shield } from 'lucide-react';
import { MapView } from '@/components/Map';
import { toast } from 'sonner';
import { useContactPage } from '@/hooks/useContactPage';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { ContactInfoList, PageLoader, PageError } from '@/components/common';

export default function Contact() {
  const pageResult = useContactPage();
  const settingsResult = useWebsiteSettings();
  const { data: page } = pageResult;
  const { data: settings } = settingsResult;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      toast.success('Message Dispatched Successfully!', {
        description: 'Our customer care desk will reply within 4 business hours.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1200);
  };

  const { isLoading, error } = combineAsyncStates(pageResult, settingsResult);
  if (isLoading) return <PageLoader />;
  if (error || !page || !settings) return <PageError />;

  const contactItems = [
    { icon: MapPin, label: 'Dive Center Location', value: settings.contact.address },
    { icon: Phone, label: 'Telephone', value: settings.contact.phone.join(' / ') },
    { icon: Mail, label: 'Email', value: settings.contact.email },
    { icon: Clock, label: 'Operations Hours', value: settings.contact.operatingHours ?? '' },
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="relative py-24 border-b border-border">
        <div className="container text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.hero.eyebrow}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mt-2 mb-4">{page.hero.title}</h1>
          <p className="text-muted-foreground">
            {page.hero.description}
          </p>
        </div>
      </section>

      {/* Main Grid: Form & Info */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Column: Direct Contact Info */}
            <div className="space-y-6 text-left">
              <div className="glass-panel p-6 space-y-6">
                <h2 className="text-xl font-serif font-bold text-foreground mb-4">{page.channelsHeading}</h2>
                <ContactInfoList items={contactItems} />
              </div>

              {/* Safety Shield */}
              <div className="glass-panel p-6 space-y-3 border-primary/20 bg-primary/5">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4.5 h-4.5 text-primary" /> {page.safetyNote.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {page.safetyNote.description}
                </p>
              </div>
            </div>

            {/* Middle/Right Column: Interactive Message Form */}
            <div className="lg:col-span-2 text-left">
              <div className="glass-panel p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">{page.formHeading}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs text-muted-foreground font-semibold">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted-foreground font-semibold">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="E.g., Private Charter Inquiry, Course Booking, Custom Package..."
                      className="bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-muted-foreground font-semibold">Your Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-premium-primary w-full py-3.5 text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Secure Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="h-[400px] relative bg-secondary border-t border-border">
        <MapView
          onMapReady={(map: google.maps.Map) => {
            map.setCenter(page.mapConfig.center);
            map.setZoom(page.mapConfig.zoom);

            new google.maps.Marker({
              position: page.mapConfig.center,
              map: map,
              title: page.mapConfig.markerTitle,
              animation: google.maps.Animation.DROP,
            });
          }}
        />
      </section>
    </Layout>
  );
}
