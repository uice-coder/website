import type { BarDatum, StackDatum } from '../../data/findings';

/* -------------------------------------------------------------------------- */
/* Horizontal bar chart — Natural Questions Exact Match                        */
/* -------------------------------------------------------------------------- */

interface BarProps {
  heading: string;
  data: BarDatum[];
  legend: { kind: BarDatum['kind']; text: string }[];
  source: string;
  /** 0..1 reveal progress driven by the scene machine. */
  progress: number;
  /** Axis maximum. Bars are scaled against this, not against each other. */
  max?: number;
}

export function BarChart({
  heading,
  data,
  legend,
  source,
  progress,
  max = 50,
}: BarProps) {
  return (
    <figure className="chart">
      <figcaption>
        <h3 className="chart__heading">{heading}</h3>
        <p className="chart__sub">Higher is better. Axis maximum {max}.</p>
      </figcaption>

      <div className="chart__rows">
        {data.map((datum, i) => {
          // Stagger: each bar owns a slice of the progress window.
          const slice = 1 / data.length;
          const local = Math.max(
            0,
            Math.min(1, (progress - i * slice * 0.55) / (slice * 1.6)),
          );
          const value = datum.value * local;
          return (
            <div
              className={`chart__row chart__row--${datum.kind}`}
              key={datum.label}
            >
              <span className="chart__label">{datum.label}</span>
              <div
                className="chart__track"
                role="img"
                aria-label={`${datum.label}: ${datum.value} exact match. ${datum.note}.`}
              >
                <div
                  className={`chart__fill chart__fill--${datum.kind}`}
                  style={{ width: '100%', transform: `scaleX(${value / max})` }}
                />
              </div>
              <span className="chart__value" aria-hidden="true">
                {value.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="chart__legend">
        {legend.map((item) => (
          <span className="chart__legenditem" key={item.kind}>
            <span
              className={`chart__swatch chart__swatch--${item.kind}`}
              aria-hidden="true"
            />
            {item.text}
          </span>
        ))}
        <span className="chart__source">{source}</span>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* 100% stacked bar — human factuality assessment                              */
/* -------------------------------------------------------------------------- */

interface StackProps {
  heading: string;
  sub: string;
  data: StackDatum[];
  interpretation: string;
  source: string;
  progress: number;
}

export function StackedBar({
  heading,
  sub,
  data,
  interpretation,
  source,
  progress,
}: StackProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <figure className="chart">
      <figcaption>
        <h3 className="chart__heading">{heading}</h3>
        <p className="chart__sub">{sub}</p>
      </figcaption>

      <div
        className="stack"
        role="img"
        aria-label={`${heading}. ${data
          .map((d) => `${d.label}: ${d.value}%`)
          .join('. ')}.`}
      >
        {data.map((datum, i) => {
          const slice = 1 / data.length;
          const local = Math.max(
            0,
            Math.min(1, (progress - i * slice * 0.7) / (slice * 1.4)),
          );
          return (
            <div
              key={datum.label}
              className={`stack__seg stack__seg--${datum.tone}`}
              style={{ width: `${(datum.value / total) * 100 * local}%` }}
              aria-hidden="true"
            >
              {local > 0.8 && datum.value >= 10 ? `${datum.value}%` : ''}
            </div>
          );
        })}
      </div>

      <div className="stack__legend" aria-hidden="true">
        {data.map((datum) => (
          <span className="stack__legenditem" key={datum.label}>
            <span
              className={`stack__swatch stack__swatch--${datum.tone}`}
              aria-hidden="true"
            />
            {datum.label} <b>{datum.value}%</b>
          </span>
        ))}
      </div>

      <p className="callout">{interpretation}</p>
      <span className="chart__source">{source}</span>
    </figure>
  );
}
