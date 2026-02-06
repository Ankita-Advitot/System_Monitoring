import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import { generateMockMetric } from '@/features/dashboard/utils/dashboardUtils';
import type { MetricData } from '@/features/dashboard/types/dashboardTypes';

// For mock mode, we'll use a generator function
let mockIntervalId: NodeJS.Timeout | null = null;

export interface MetricStreamCallbacks {
  onData: (data: MetricData) => void;
  onError: (error: Error) => void;
}
const mapMetricResponseToMetricData = (raw: any): MetricData => ({
  timestamp: new Date(raw.timestamp).getTime(), // string → number
  cpuUsagePercent: raw.cpu_usage_percent,
  memoryUsagePercent: raw.memory_usage_percent,
  networkInKb: raw.network_in_kb,
  networkOutKb: raw.network_out_kb,
});

// Mock SSE implementation using setInterval
const mockStreamMetrics = (callbacks: MetricStreamCallbacks): (() => void) => {
  mockIntervalId = setInterval(() => {
    try {
      const metric = generateMockMetric();
      callbacks.onData(metric);
    } catch (error) {
      callbacks.onError(error as Error);
    }
  }, 2500);

  // Return cleanup function
  return () => {
    if (mockIntervalId) {
      clearInterval(mockIntervalId);
      mockIntervalId = null;
    }
  };
};

// Real SSE implementation
const realStreamMetrics = (callbacks: MetricStreamCallbacks): (() => void) => {
  const eventSource = new EventSource(
    `${apiClient.defaults.baseURL}${API_ENDPOINTS.METRICS.STREAM}`
  );

  console.log("in realStreamMetrics");

  eventSource.addEventListener("metric_update", (event) => {
    try {
      const raw = JSON.parse((event as MessageEvent).data);
      console.log("data received from SSE:", raw);

      const metric = mapMetricResponseToMetricData(raw);
      callbacks.onData(metric);
    } catch (error) {
      console.error("Error processing metric data:", error);
      callbacks.onError(new Error("Failed to parse metric data"));
    }
  });

  eventSource.onerror = (err) => {
    console.error("SSE connection error", err);
    callbacks.onError(new Error("SSE connection error"));
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
};

export const metricService = {
  streamMetrics: USE_MOCK_API ? mockStreamMetrics : realStreamMetrics,
};
