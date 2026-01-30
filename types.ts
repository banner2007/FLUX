
export interface ReplicateInput {
  prompt: string;
  aspect_ratio: "1:1";
  output_format: "webp";
  output_quality: number;
  safety_tolerance: number;
  prompt_upsampling: boolean;
}

export interface GenerationResponse {
  imageUrl?: string;
  error?: string;
  status?: string;
}

export interface BackendResponse {
  // Typical Replicate output is an array of strings (URLs) or a single string
  output: string | string[];
  error?: string;
}
