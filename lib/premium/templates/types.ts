export interface PersonaTemplate {
  coreIdentity: string;
  hiddenStrengths: string[];
  blindSpots: string[];
  idealEnvironment: string;
  famousArchetypes: string[];
  weeklyPlan: Array<{
    week: number;
    theme: string;
    actions: string[];
    reflection: string;
  }>;
  longTermVision: string;
  tagline: string;
  elevatorPitch: string;
  keywords: string[];
  strengthStatement: string;
  scenarios: Array<{
    scenario: string;
    strengthUsed: string;
    approach: string;
    expectedOutcome: string;
  }>;
}
