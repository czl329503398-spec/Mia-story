/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Scene {
  id: number;
  timeStart: number; // in seconds
  timeEnd: number; // in seconds
  title: string;
  narratorZh: string; // Mom's storytelling narration
  motherSpokenZh?: string; // What mother says in Chinese
  characterSpokenEn: string; // Core English sentence
  characterSpokenZh: string; // Chinese equivalent of English sentence
  repeats: string[]; // English sentence repeated twice
  coreWords: string[]; // Spotlight words in this scene
  animationTrigger: string; // identifies animation cues
}

export interface Vocabulary {
  word: string;
  translation: string;
  pinyin: string;
  phonetic: string;
  contextSentence: string;
  contextTranslation: string;
  interactionTarget: string; // target for interactive click
}

export type PlayMode = 'video' | 'interactive' | 'game' | 'dictionary';
