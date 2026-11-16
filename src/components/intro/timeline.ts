import { INTRO_QUESTION, INTRO_STEPS } from "@/data/intro";
import { agentCallLength } from "@/components/trace/Trace";

/*
 * The intro's timeline in ms from the start (about 5.6s to the handoff):
 * typing, the three searches, the check once every card has landed, the
 * answer forming from particles, then a beat before the handoff.
 */

export const STEPS = INTRO_STEPS;
export const PROMPT_LENGTH = agentCallLength(INTRO_QUESTION);
/** Index of each tool step. Source card i belongs to TOOL_STEPS[i]. */
export const TOOL_STEPS = STEPS.flatMap((step, i) => (step.label === "tool" ? [i] : []));

const TYPE_AT = 250;
const CHAR_MS = 28;
const STEPS_AT = TYPE_AT + PROMPT_LENGTH * CHAR_MS + 250;
const STEP_GAP = 360;
export const RESULT_DELAY = 200;
/** How long a search's light takes to reach its Source card. */
export const LAND_MS = 900;

/** When each step appears. The check waits for the last card to land. */
const STEP_AT = STEPS.map((step, i) =>
  step.label === "check" ? STEPS_AT + (i - 1) * STEP_GAP + LAND_MS - 160 : STEPS_AT + i * STEP_GAP,
);
const CHECKED_AT = STEP_AT[STEP_AT.length - 1] + RESULT_DELAY;
export const FORM_AT = CHECKED_AT + 60;
export const ANSWER_AT = FORM_AT + 1050;
export const HANDOFF_AT = ANSWER_AT + 1000;
/** The overlay unmounts once every handoff animation has landed. */
export const END_AT = HANDOFF_AT + 1900;

export interface Progress {
  typed: number;
  steps: number;
  results: number;
  /** Source cards that have landed. */
  cards: number;
  /** The answer has started forming. */
  form: boolean;
  answer: boolean;
}

export function progressAt(t: number): Progress {
  const passed = (offset: number) => STEP_AT.filter((at) => t >= at + offset).length;
  return {
    typed: Math.max(0, Math.min(PROMPT_LENGTH, Math.floor((t - TYPE_AT) / CHAR_MS))),
    steps: passed(0),
    results: passed(RESULT_DELAY),
    cards: TOOL_STEPS.filter((i) => t >= STEP_AT[i] + LAND_MS).length,
    form: t >= FORM_AT,
    answer: t >= ANSWER_AT,
  };
}

export const progressKey = (p: Progress) =>
  `${p.typed}|${p.steps}|${p.results}|${p.cards}|${p.form}|${p.answer}`;

/** The check has passed and every Source card is in. */
export const isVerified = (p: Progress) =>
  p.results >= STEPS.length && p.cards >= TOOL_STEPS.length;
