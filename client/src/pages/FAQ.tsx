import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, ShieldAlert, Phone } from 'lucide-react';
import { useFAQs } from '@/hooks/useFAQs';
import { useFAQPage } from '@/hooks/useFAQPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { FAQAccordionItem, PageLoader, PageError } from '@/components/common';

export default function FAQ() {
  const faqsResult = useFAQs();
  const pageResult = useFAQPage();
  const { data: faqs } = faqsResult;
  const { data: page } = pageResult;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { isLoading, error } = combineAsyncStates(faqsResult, pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !faqs || !page) return <PageError />;

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

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

      {/* FAQ Search and List */}
      <section className="py-24">
        <div className="container max-w-4xl">
          {/* Search Bar & Categories */}
          <div className="space-y-6 mb-16">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-full py-3.5 pl-12 pr-6 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {page.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ List */}
          <h2 className="sr-only">Questions and answers</h2>
          <div className="space-y-4 text-left">
            {filteredFaqs.length === 0 ? (
              <div className="glass-panel p-12 text-center text-muted-foreground text-sm">
                No matching questions found. Try typing a different keyword or browse other categories.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <FAQAccordionItem
                  key={faq.question}
                  faq={faq}
                  isExpanded={expandedIndex === idx}
                  onToggle={() => toggleExpand(idx)}
                />
              ))
            )}
          </div>

          {/* Emergency Notice */}
          <div className="mt-16 bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-left flex gap-4 items-start max-w-3xl mx-auto">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground">{page.emergencyNotice.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {page.emergencyNotice.description}
              </p>
              <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold">
                <Phone className="w-4 h-4" /> {page.emergencyNotice.hotlineLabel}
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
