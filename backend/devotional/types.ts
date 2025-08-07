export interface BiblicalPassage {
  reference: string;
  text: string;
}

export interface MeditationGuide {
  preparation: string;
  lectio: string;
  reflection: string[];
}

export interface PrayerGuide {
  personal: string;
  intercession: string;
}

export interface StudyGuide {
  insight: string;
  crossReferences: string[];
  applicationQuestions: string[];
}

export interface WorshipGuide {
  call: string;
  celebration: string;
}

export interface DevotionalPlan {
  title: string;
  passage: BiblicalPassage;
  meditation: MeditationGuide;
  prayer: PrayerGuide;
  study: StudyGuide;
  worship: WorshipGuide;
}

export interface GenerateMeditationRequest {
  passageRef: string;
  passageText: string;
}

export interface GeneratePrayerRequest {
  passageRef: string;
  passageText: string;
  meditationInsights: string;
}

export interface GenerateStudyRequest {
  passageRef: string;
  passageText: string;
}

export interface GenerateWorshipRequest {
  passageRef: string;
  passageText: string;
  studyInsights: string;
}

export interface CompileDevotionalRequest {
  passageRef: string;
  passageText: string;
  meditation: MeditationGuide;
  prayer: PrayerGuide;
  study: StudyGuide;
  worship: WorshipGuide;
}
