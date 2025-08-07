export interface GenerateResponse {
    message: string;
}

export interface GenerateRequest {
    tweet: string;
    tone: string;
}

export type ResultProps = {
    response: string;
    speed?: number;
};

export type promptInput = {
    tweet: string;
    tone: string;
    systemPrompt: string;
};
