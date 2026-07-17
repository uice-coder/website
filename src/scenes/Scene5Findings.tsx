import { motion } from 'framer-motion';
import { SceneFrame } from '../components/shared/SceneFrame';
import { BarChart, StackedBar } from '../components/shared/Charts';
import { usePresentation } from '../context/PresentationContext';
import { useRegisterScene } from '../hooks/useRegisterScene';
import {
  revealCount,
  useSceneMachine,
  type TimelineStep,
} from '../hooks/useSceneMachine';
import { SCENES } from '../data/scenes';
import {
  FACTUALITY,
  FACTUALITY_HEADING,
  FACTUALITY_INTERPRETATION,
  FACTUALITY_SOURCE,
  FACTUALITY_SUB,
  NQ_CHART_HEADING,
  NQ_CHART_SOURCE,
  NQ_EXACT_MATCH,
  NQ_LEGEND,
  TASK_CARDS,
  TASKS_CLOSING,
} from '../data/findings';

const STEPS: TimelineStep[] = [
  { id: 'chart1', duration: 1400 },
  { id: 'chart2', duration: 900 },
  { id: 'tasks', duration: 600 },
];

const META = SCENES[4]!;

export function Scene5Findings() {
  const { reducedMotion } = usePresentation();
  // No trigger button in this scene, so the charts draw on entry in both modes.
  // R replays; Space pauses.
  const machine = useSceneMachine(STEPS, { reducedMotion, autoPlay: true });
  useRegisterScene(machine);

  const tasksVisible = revealCount(
    Math.min(1, machine.progressOf('tasks') * 1.5),
    TASK_CARDS.length,
  );

  return (
    <SceneFrame
      meta={META}
      footnote={
        <>
          The factuality result is a <strong>pairwise human judgement</strong> on
          one task (Jeopardy question generation), not a measured reduction in
          hallucination. Table 3’s values sum to 100%; §4.3’s prose quotes 17%
          for “Both good”, which appears to be an erratum.
        </>
      }
    >
      <div className="s5">
        <div className="s5__charts">
          <BarChart
            heading={NQ_CHART_HEADING}
            data={NQ_EXACT_MATCH}
            legend={NQ_LEGEND}
            source={NQ_CHART_SOURCE}
            progress={machine.progressOf('chart1')}
          />

          <StackedBar
            heading={FACTUALITY_HEADING}
            sub={FACTUALITY_SUB}
            data={FACTUALITY}
            interpretation={FACTUALITY_INTERPRETATION}
            source={FACTUALITY_SOURCE}
            progress={machine.progressOf('chart2')}
          />
        </div>

        <div className="s5__tasks">
          {TASK_CARDS.map((task, i) => (
            <motion.div
              key={task.id}
              className="s5__task"
              initial={false}
              animate={{
                opacity: i < tasksVisible ? 1 : 0,
                y: i < tasksVisible ? 0 : 10,
              }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              aria-hidden={i >= tasksVisible}
            >
              <p className="s5__tasktitle">{task.title}</p>
              <p className="s5__taskbody">{task.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="s5__closing">{TASKS_CLOSING}</p>
      </div>
    </SceneFrame>
  );
}
