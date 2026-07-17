interface Props {
  label: string;
  active: boolean;
}

export function StageLabel({ label, active }: Props) {
  return (
    <span className={`stagelabel${active ? ' stagelabel--active' : ''}`}>
      <span className="stagelabel__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

interface RowProps {
  /** Which stage is lit, or null for none. */
  active: string | null;
  stages?: string[];
}

export function StageLabelRow({
  active,
  stages = ['Search', 'Read', 'Generate'],
}: RowProps) {
  return (
    <div
      style={{ display: 'flex', gap: 'var(--space-3)' }}
      aria-label="Pipeline stage"
    >
      {stages.map((stage) => (
        <StageLabel key={stage} label={stage} active={active === stage} />
      ))}
    </div>
  );
}
