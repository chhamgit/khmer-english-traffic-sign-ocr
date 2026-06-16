/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SignCategory {
  REGULATORY = "REGULATORY",
  WARNING = "WARNING",
  INFORMATION = "INFORMATION",
  SPEED_LIMIT = "SPEED_LIMIT",
  CONSTRUCTION = "CONSTRUCTION"
}

export interface TrafficSign {
  id: string;
  nameEn: string;
  nameKh: string;
  category: SignCategory;
  descriptionEn: string;
  descriptionKh: string;
  phoneticKh: string;
  svgType: string; // Used to render the specific exact vector graphic in our app
  shape: "octagon" | "circle" | "triangle" | "rectangle" | "diamond";
  primaryColor: string;
  rulesEn: string;
  rulesKh: string;
}

export interface AnalysisResult {
  detected: boolean;
  signFound: string; // Name in English
  category: SignCategory;
  confidence: number;
  khmerTranslation: string;
  englishExplanation: string;
  khmerExplanation: string;
  phoneticGuide: string;
  embeddedText?: string;
  safetyActionsEn: string;
  safetyActionsKh: string;
}

export interface QuizQuestion {
  id: string;
  signId: string; // The correct sign
  questionText: string;
  options: {
    signId: string;
    textEn: string;
    textKh: string;
  }[];
  correctSignId: string;
  explanationEn: string;
  explanationKh: string;
}

export interface SimulationStep {
  id: string;
  sceneTitle: string;
  sceneDescription: string;
  bgGradient: string; // Tailwind background gradient for visual simulation
  roadEvent: string;
  signId: string; // The sign that appears in the environment
  detectedTime: number; // in seconds
}
