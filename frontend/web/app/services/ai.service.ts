import { httpClient } from '@/app/lib/services/http.client';

export interface PolishRequest {
  text: string;
  section_type: 'skills' | 'work_experience' | 'project' | 'education' | 'general';
}

export interface PolishResponse {
  original: string;
  polished: string;
  improvements: string[];
}

export const aiService = {
  /**
   * AI 润色文本
   */
  async polishText(request: PolishRequest): Promise<PolishResponse> {
    const response = await httpClient.post<{
      success: boolean;
      data: PolishResponse;
    }>('/api/ai/polish', request);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to polish text');
    }

    return response.data.data;
  },
};
