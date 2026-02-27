export type { PersonaTemplate } from './types';

import innovationExecution from './innovation-execution';
import innovationInfluence from './innovation-influence';
import innovationCollaboration from './innovation-collaboration';
import innovationResilience from './innovation-resilience';
import executionInfluence from './execution-influence';
import executionCollaboration from './execution-collaboration';
import executionResilience from './execution-resilience';
import influenceCollaboration from './influence-collaboration';
import influenceResilience from './influence-resilience';
import collaborationResilience from './collaboration-resilience';
import { PersonaTemplate } from './types';

export const PERSONA_TEMPLATES: Record<string, PersonaTemplate> = {
  'innovation-execution': innovationExecution,
  'innovation-influence': innovationInfluence,
  'innovation-collaboration': innovationCollaboration,
  'innovation-resilience': innovationResilience,
  'execution-influence': executionInfluence,
  'execution-collaboration': executionCollaboration,
  'execution-resilience': executionResilience,
  'influence-collaboration': influenceCollaboration,
  'influence-resilience': influenceResilience,
  'collaboration-resilience': collaborationResilience,
};
