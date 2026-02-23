export interface AgentContext {
  sessionId: string;
  data: Record<string, any>;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export abstract class BaseAgent<TInput = any, TOutput = any> {
  protected name: string;
  protected systemPrompt: string;

  constructor(name: string, systemPrompt: string) {
    this.name = name;
    this.systemPrompt = systemPrompt;
  }

  abstract process(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>>;

  protected success<T>(data: T, metadata?: Record<string, any>): AgentResult<T> {
    return { success: true, data, metadata };
  }

  protected failure(error: string, metadata?: Record<string, any>): AgentResult {
    return { success: false, error, metadata };
  }

  getName(): string {
    return this.name;
  }
}
