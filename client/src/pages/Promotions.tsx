import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { usePromotions } from '@/hooks/usePromotions';
import { usePromotionsPage } from '@/hooks/usePromotionsPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { PromotionCard, PageLoader, PageError } from '@/components/common';

export default function Promotions() {
  const promotionsResult = usePromotions();
  const pageResult = usePromotionsPage();
  const { data: promotions } = promotionsResult;
  const { data: page } = pageResult;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Promo code copied to clipboard!', {
      description: `Use code ${code} during checkout to redeem.`,
    });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const { isLoading, error } = combineAsyncStates(promotionsResult, pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !promotions || !page) return <PageError />;

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

      {/* Promotions List */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <h2 className="sr-only">Current promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch">
            {promotions.map((promotion) => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                variant="full"
                copiedCode={copiedCode}
                onCopyCode={handleCopyCode}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
