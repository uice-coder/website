import type { ReactNode } from 'react';
import type { SceneMeta } from '../../data/types';

interface Props {
  meta: SceneMeta;
  children: ReactNode;
  /** Provenance / caveat line. Always visible — it carries the accuracy notes. */
  footnote?: ReactNode;
}

export function SceneFrame({ meta, children, footnote }: Props) {
  return (
    <section
      className={`scene scene--${meta.id}`}
      aria-labelledby={`scene-${meta.id}-title`}
      aria-roledescription="slide"
    >
      <header className="scene__head">
        <p className="scene__eyebrow">
          Chapter {meta.number} · {meta.shortTitle}
        </p>
        <h2 className="scene__title" id={`scene-${meta.id}-title`}>
          {meta.title}
        </h2>
        <p className="scene__subtitle">{meta.subtitle}</p>
      </header>

      <div className="scene__body">{children}</div>

      {footnote ? <p className="scene__foot">{footnote}</p> : <span />}
    </section>
  );
}
