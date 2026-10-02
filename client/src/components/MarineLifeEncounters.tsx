/**
 * Marine Life Encounters section — extracted from Home.tsx for safekeeping.
 * Not currently rendered anywhere. To re-add, import and place inside a page's Layout.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { home } from '@/content/media';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function MarineLifeEncounters() {
  const marineAutoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [marineRef, marineApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [marineAutoplay.current],
  );
  const [marineActiveSlide, setMarineActiveSlide] = useState(0);

  const scrollToMarine = useCallback((index: number) => marineApi?.scrollTo(index), [marineApi]);

  useEffect(() => {
    if (!marineApi) return;
    const onSelect = () => setMarineActiveSlide(marineApi.selectedScrollSnap());
    marineApi.on('select', onSelect);
    onSelect();
    return () => { marineApi.off('select', onSelect); };
  }, [marineApi]);

  const marineLife = [
    { name: 'Whale Shark', desc: 'The gentle giants of the deep, visiting outer reefs seasonally. These magnificent creatures can grow up to 12 metres and are a highlight of any dive.', img: home.marineLife.whaleShark },
    { name: 'Green Sea Turtle', desc: 'Frequently seen grazing in shallow coral gardens. These graceful reptiles are a beloved encounter for divers of all experience levels.', img: home.marineLife.greenSeaTurtle },
    { name: 'Manta Ray', desc: 'Gracefully gliding along deep currents and cleaning stations. With wingspans up to 7 metres, mantas are among the ocean\'s most elegant inhabitants.', img: home.marineLife.mantaRay },
    { name: 'Giant Moray Eel', desc: 'Peeking out from rocky crevices and historic wrecks. Despite their fearsome appearance, these fascinating creatures are generally docile.', img: home.marineLife.giantMorayEel },
  ];

  return (
    <section className="py-24 relative">
      <div className="container text-center max-w-5xl">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Biodiversity</span>
        <h2 className="text-3xl md:text-5xl font-serif mt-2 mb-4 text-white">Marine Life Encounters</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
          Our dive sites are teeming with majestic pelagics and fascinating macro species. Here are some of the regular residents you will meet.
        </p>

        <div className="relative">
          <div
            ref={marineRef}
            className="overflow-hidden"
            onMouseEnter={() => marineAutoplay.current.stop()}
            onMouseLeave={() => marineAutoplay.current.play()}
          >
            <div className="flex -ml-6">
              {marineLife.map((creature, idx) => (
                <div
                  key={idx}
                  className="min-w-0 shrink-0 grow-0 pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="glass-panel overflow-hidden group flex flex-col h-full text-left">
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={creature.img}
                        loading="lazy"
                        decoding="async"
                        alt={creature.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white mb-2">{creature.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{creature.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => marineApi?.scrollPrev()}
            className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-background/90 hover:border-primary/40 transition-all duration-200 z-10 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => marineApi?.scrollNext()}
            className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-background/90 hover:border-primary/40 transition-all duration-200 z-10 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {marineLife.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToMarine(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === marineActiveSlide ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
