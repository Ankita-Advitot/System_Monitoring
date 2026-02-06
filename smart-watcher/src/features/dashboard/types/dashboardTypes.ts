export interface MetricData {
  timestamp: string | number; // ISO string from backend, converted to number in service
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  networkInKb: number;
  networkOutKb: number;
}

export interface MetricCardData {
  label: string;
  value: number;
  unit: string;
  color: string;
  icon: string;
}

export interface ChartData {
  time: string;
  value: number;
}

export interface NetworkChartData {
  time: string;
  networkIn: number;
  networkOut: number;
}
