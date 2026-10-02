import React from 'react';
import Layout from '@/components/Layout';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useCrewPage } from '@/hooks/useCrewPage';
import { combineAsyncStates } from '@/hooks/useAsyncData';
import { TeamMemberCard, PageLoader, PageError } from '@/components/common';

export default function Crew() {
  const membersResult = useTeamMembers();
  const pageResult = useCrewPage();
  const { data: members } = membersResult;
  const { data: page } = pageResult;

  const { isLoading, error } = combineAsyncStates(membersResult, pageResult);
  if (isLoading) return <PageLoader />;
  if (error || !members || !page) return <PageError />;

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

      {/* Crew Profiles */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <h2 className="sr-only">Meet the crew</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
