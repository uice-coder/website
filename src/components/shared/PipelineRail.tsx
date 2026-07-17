interface Node {
  id: string;
  label: string;
  sub?: string;
}

interface Props {
  nodes: Node[];
  /** Index of the node currently lit; -1 for none, nodes.length for all done. */
  activeIndex: number;
}

/**
 * The five-node horizontal rail. The brief caps horizontal nodes at five, so
 * the Query Encoder and Wikipedia index are carried as node subtitles rather
 * than as separate boxes.
 */
export function PipelineRail({ nodes, activeIndex }: Props) {
  return (
    <ol className="rail" aria-label="RAG pipeline">
      {nodes.map((node, i) => {
        const state =
          i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'idle';
        return (
          <li
            key={node.id}
            className="rail__item"
            style={{ display: 'contents' }}
          >
            <div
              className={`pnode${state === 'active' ? ' pnode--active' : ''}${
                state === 'done' ? ' pnode--done' : ''
              }`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <span className="pnode__label">{node.label}</span>
              {node.sub && <span className="pnode__sub">{node.sub}</span>}
            </div>
            {i < nodes.length - 1 && (
              <svg
                className={`rail__arrow${i < activeIndex ? ' rail__arrow--lit' : ''}`}
                width="20"
                height="12"
                viewBox="0 0 20 12"
                aria-hidden="true"
              >
                <path
                  d="M0 6h16M12 2l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </li>
        );
      })}
    </ol>
  );
}
