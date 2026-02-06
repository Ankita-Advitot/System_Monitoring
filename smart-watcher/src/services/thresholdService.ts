import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import type { ThresholdData, ThresholdResponse } from '@/features/thresholds/types/thresholdTypes';
import { DEFAULT_THRESHOLDS } from '@/features/thresholds/constants/thresholdConstants';

// Mock storage
let mockThresholds: ThresholdData = { ...DEFAULT_THRESHOLDS };

// Mock implementations
const mockGetThresholds = async (): Promise<ThresholdData> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return { ...mockThresholds };
};

const mockUpdateThresholds = async (data: ThresholdData): Promise<ThresholdResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  mockThresholds = { ...data };
  return { message: 'Thresholds updated successfully' };
};

// Real API implementations
const realGetThresholds = async (): Promise<ThresholdData> => {
  console.log('Fetching thresholds from real API');
  const response = await apiClient.get<ThresholdData>(API_ENDPOINTS.THRESHOLDS.GET);
  console.log('Received thresholds:', response.data);
  return response.data;
};

const realUpdateThresholds = async (data: ThresholdData): Promise<ThresholdResponse> => {
  console.log('Updating thresholds via real API');
  const response = await apiClient.patch<ThresholdResponse>(API_ENDPOINTS.THRESHOLDS.UPDATE, data);
  console.log('Threshold update response:', response.data);
  return response.data;
};

export const thresholdService = {
  getThresholds: USE_MOCK_API ? mockGetThresholds : realGetThresholds,
  updateThresholds: USE_MOCK_API ? mockUpdateThresholds : realUpdateThresholds,
};
