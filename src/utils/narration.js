import { say, ask, cheer, emphasize, think, celebrate, instruct } from './audio';
import { WONDER, STORY_PANELS } from '../data/storyContent';
import { STATIONS } from '../data/stationContent';

export const wonderNarration = () => [
  think(WONDER[0]),
  ask(WONDER[1]),
  cheer(WONDER[2]),
];

export const getStoryNarration = (panelIndex) => {
  const panel = STORY_PANELS[panelIndex];
  if (!panel) return [];
  if (panelIndex === 1 || panelIndex === 4) {
    return [emphasize(panel.narrative)];
  }
  if (panelIndex === 5) {
    return [cheer(panel.narrative)];
  }
  return [say(panel.narrative)];
};

export const simulateStationIntro = (stationIndex) => {
  const st = STATIONS[stationIndex];
  if (!st) return [];
  return [instruct(st.instruction)];
};

export const questionNarration = (question) => {
  if (!question || !question.questionText) return [];
  return [ask(question.questionText)];
};

export const correctNarration = () => [
  celebrate('Perfect! You restored that angle like a true architect!'),
];

export const incorrectNarration = (customHint) => {
  if (customHint) return [think(customHint)];
  return [cheer("Not quite! Let's check the diagram again.")];
};

export const reflectNarration = () => [
  think('What an adventure! Can you explain one angle rule to me in your own words?'),
  celebrate('Lesson complete! You are a Global Angle Architect Champion!'),
];
