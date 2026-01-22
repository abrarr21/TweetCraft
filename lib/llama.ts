import { InferenceClient } from "@huggingface/inference";

export const llama = new InferenceClient(process.env.HF_TOKEN);
