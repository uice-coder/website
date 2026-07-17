import { motion } from 'framer-motion';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** Shared layoutId so the pill slides between segments. */
  layoutId?: string;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  layoutId = 'segmented-pill',
}: Props<T>) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className="segmented__btn"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {selected && (
              <motion.span
                className="segmented__pill"
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="segmented__text">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
