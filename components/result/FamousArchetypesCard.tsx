"use client";

import { IS_TOSS } from '@/lib/design-tokens';

interface FamousArchetypesCardProps {
  archetypes: string[];
}

const styles = IS_TOSS
  ? {
      sectionLabel: 'text-xs font-semibold tracking-widest text-tds-blue-500 uppercase',
      sectionTitle: 'text-t3 font-bold text-tds-grey-900',
      card: 'rounded-2xl border border-tds-grey-200 bg-tds-grey-50 p-5',
      name: 'text-st8 font-semibold text-tds-grey-900',
      desc: 'text-st8 text-tds-grey-500 leading-relaxed',
      divider: 'border-t border-tds-grey-200',
    }
  : {
      sectionLabel: 'text-xs font-semibold tracking-widest text-primary/70 uppercase',
      sectionTitle: 'text-2xl font-bold text-foreground',
      card: 'rounded-2xl border border-border bg-card p-5',
      name: 'text-sm font-semibold text-foreground',
      desc: 'text-sm text-muted-foreground leading-relaxed',
      divider: 'border-t border-border',
    };

export function FamousArchetypesCard({ archetypes }: FamousArchetypesCardProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className={styles.sectionLabel}>Famous Archetypes</p>
        <h2 className={styles.sectionTitle}>당신과 비슷한 유형</h2>
      </div>
      <div className={styles.card}>
        <div className="space-y-0">
          {archetypes.map((archetype, index) => {
            const separatorIndex = archetype.indexOf(' — ');
            const name =
              separatorIndex !== -1 ? archetype.slice(0, separatorIndex) : archetype;
            const desc =
              separatorIndex !== -1 ? archetype.slice(separatorIndex + 3) : '';

            return (
              <div key={index}>
                {index > 0 && <div className={`${styles.divider} my-4`} />}
                <div className="space-y-1">
                  <p className={styles.name}>{name}</p>
                  {desc && <p className={styles.desc}>{desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
