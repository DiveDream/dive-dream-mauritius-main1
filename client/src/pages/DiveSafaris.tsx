import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import type { DiveSafari } from '@/types';
import { MapPin, Waves, Thermometer, Compass, Calendar, Sun, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';
import { useDiveSafaris } from '@/hooks/useDiveSafaris';
import { useDiveSafarisPage } from '@/hooks/useDiveSafarisPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { PageLoader, PageError } from '@/components/common';

export default function DiveSafaris() {
  const sitesResult = useDiveSafaris();
  const pageResult = useDiveSafarisPage();
  const { data: sites } = sitesResult;
  const { data: page } = pageResult;

  const [selectedCert, setSelectedCert] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeSite, setActiveSite] = useState<DiveSafari | null>(null);

  useEffect(() => {
    if (sites && sites.length > 0 && !activeSite) {
      setActiveSite(sites[0]);
    }
  }, [sites, activeSite]);

  const { isLoading, error } = combineAsyncStates(sitesResult, pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !sites || !page) return <PageError />;

  if (sites.length === 0) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container text-center max-w-2xl">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">No Dive Safaris Available Yet</h1>
            <p className="text-muted-foreground">Check back soon — our dive safari catalogue is being updated.</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!activeSite) return <PageLoader />;

  const certLevels = page.certLevels;
  const diveTypes = page.diveTypes;

  // Filter sites
  const filteredSites = sites.filter(site => {
    const matchesCert = selectedCert === 'All' || site.certificationLevel === selectedCert;
    const matchesType = selectedType === 'All' || site.type.includes(selectedType as any);
    return matchesCert && matchesType;
  });

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative py-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={activeSite.image}
            alt="Dive Safaris Header"
            className="w-full h-full object-cover opacity-60 scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background z-10" />
        </div>
        <div className="container relative z-20 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.hero.eyebrow}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mt-2 mb-4">{page.hero.title}</h1>
          <p className="text-muted-foreground">
            {page.hero.description}
          </p>
        </div>
      </section>

      {/* Full Dive Safaris Map */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.mapSection.eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2 mb-3">{page.mapSection.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {page.mapSection.description}
            </p>
          </div>
          <div className="glass-panel p-2 md:p-4 overflow-hidden group cursor-pointer">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={page.mapImage}
                loading="lazy"
                decoding="async"
                alt="Dive Dream Divers — Map of all 47 dive sites across Mauritius"
                className="w-full h-auto object-contain rounded-lg transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-border pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Dive Safari Highlights */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{page.highlightsSection.eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2 mb-3">{page.highlightsSection.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {page.highlightsSection.description}
            </p>
          </div>

          {/* Interactive Filters */}
          <div className="glass-panel p-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Cert Filter */}
            <div className="flex flex-col space-y-2 text-left w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Certification Level</span>
              <div className="flex flex-wrap gap-2">
                {certLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedCert(level)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCert === level
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-border'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col space-y-2 text-left w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dive Environment</span>
              <div className="flex flex-wrap gap-2">
                {diveTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Site Spotlight & List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left/Middle Column: Interactive Spotlight on Active Site */}
            <div className="lg:col-span-2 space-y-8 text-left">
              <div className="glass-panel overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={activeSite.image}
                    loading="lazy"
                    decoding="async"
                    alt={activeSite.name}
                    className="w-full h-full object-cover"
                  />
                  {activeSite.certificationLevel && (
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-primary text-primary-foreground px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        {activeSite.certificationLevel} Required
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <span className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {activeSite.location}
                      </span>
                      {activeSite.tagline ? (
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">{activeSite.tagline}</h2>
                      ) : (
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">{activeSite.name}</h2>
                      )}
                    </div>
                    <Link href={`/reservations?diveSafari=${activeSite.id}`} className="btn-premium-primary py-2.5 px-6 text-sm">
                      Book This Dive
                    </Link>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                    {activeSite.description}
                  </p>

                  {/* Dive Sites Included */}
                  {activeSite.diveSites && activeSite.diveSites.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
                        Dive Sites on This Safari
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeSite.diveSites.map((diveSite) => (
                          <span key={diveSite} className="bg-secondary border border-border text-foreground px-3 py-1.5 rounded-full text-xs font-medium">
                            {diveSite}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Site Highlights */}
                  {activeSite.highlights && activeSite.highlights.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">
                        Why Dive {activeSite.name}?
                      </h3>
                      <ul className="space-y-2.5">
                        {activeSite.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Telemetry Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-secondary/60 border border-border p-6 rounded-xl mb-8">
                    <div>
                      <span className="text-xs text-muted-foreground block">Max Depth</span>
                      <span className="text-lg font-serif font-bold text-foreground mt-1 flex items-center gap-1.5">
                        <Waves className="w-4 h-4 text-primary" /> {activeSite.maxDepth}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Water Temp</span>
                      <span className="text-lg font-serif font-bold text-foreground mt-1 flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-primary" /> {activeSite.waterTemp.split(' ')[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Avg Visibility</span>
                      <span className="text-lg font-serif font-bold text-foreground mt-1 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-primary" /> {activeSite.visibility}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Best Season</span>
                      <span className="text-lg font-serif font-bold text-foreground mt-1 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" /> {activeSite.bestSeason.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Secondary Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div>
                      <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                        <Sun className="w-4.5 h-4.5 text-primary" /> Environmental Conditions
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li><strong className="text-foreground">Weather:</strong> {activeSite.weatherConditions}</li>
                        <li><strong className="text-foreground">Currents:</strong> Subject to tidal movements.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                        <Compass className="w-4.5 h-4.5 text-primary" /> Marine Biodiversity
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSite.marineLife.map((life, idx) => (
                          <span key={idx} className="bg-secondary border border-border text-foreground px-2.5 py-1 rounded text-xs">
                            {life}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground">
                    Planning more than one dive? Compare our{' '}
                    <Link href="/packages" className="text-primary font-semibold hover:underline">dive packages</Link>
                    , or get certified first with the{' '}
                    <Link href="/courses/open-water" className="text-primary font-semibold hover:underline">SDI Open Water course</Link>.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Site Selection List */}
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-serif font-bold text-foreground px-1">Available Dive Safaris ({filteredSites.length})</h3>

              {filteredSites.length === 0 ? (
                <div className="glass-panel p-8 text-center text-muted-foreground text-sm">
                  No dive sites match your selected filters. Try broadening your criteria.
                </div>
              ) : (
                <div className="space-y-3 max-h-[850px] overflow-y-auto pr-1">
                  {filteredSites.map((site) => {
                    const isActive = activeSite.id === site.id;
                    return (
                      <button
                        key={site.id}
                        onClick={() => setActiveSite(site)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex gap-4 cursor-pointer ${
                          isActive
                            ? 'bg-primary/10 border-primary/50 shadow-md shadow-primary/5'
                            : 'bg-card border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <img src={site.image} loading="lazy" decoding="async" alt={site.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{site.certificationLevel}</span>
                            <h4 className="text-base font-serif font-bold text-foreground mt-0.5">{site.name}</h4>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {site.location.split(',')[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
