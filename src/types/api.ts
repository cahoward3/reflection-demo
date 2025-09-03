export interface PersonaBlueprint {
  id: string;
  part1_technical_outline: {
    id: string;
    core_type: string;
    overall_goal: string;
    [key: string]: any;
  };
  part2_narrative_soul: string;
  optional_modules: string[];
}

export interface PersonaInstance {
  instance_id: string;
  blueprint_id: string;
  current_state_vector: {
    mood: string;
    focus: string;
    [key: string]: any;
  };
  session_context: {
    [key: string]: any;
  };
}

export interface ChatRequest {
  instance_id: string;
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface BurnReport {
  status: string;
  backend_used?: string;
  mrj_report_path?: string;
  markdown_report_path?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}