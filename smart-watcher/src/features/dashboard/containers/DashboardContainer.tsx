import { useEffect, useState, useCallback } from 'react';
import { CpuChart } from '../components/CpuChart';
import { MemoryChart } from '../components/MemoryChart';
import { NetworkChart } from '../components/NetworkChart';
import { MetricCard } from '../components/MetricCard';
import { MetricPieChart } from '../components/MetricPieChart';
import { metricService } from '@/services/metricService';
import { formatTime } from '../utils/dashboardUtils';
import { MAX_DATA_POINTS, METRIC_LABELS } from '../constants/dashboardConstants';
import type { MetricData, ChartData, NetworkChartData } from '../types/dashboardTypes';

export const DashboardContainer = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [latestMetric, setLatestMetric] = useState<MetricData | null>(null);

  const getFormattedTime = (timestamp: MetricData['timestamp']) => {
    return formatTime(typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp);
  };

  const handleNewMetric = useCallback((data: MetricData) => {
    setLatestMetric(data);
    setMetrics((prev) => {
      const updated = [...prev, data];
      // Keep only last MAX_DATA_POINTS records
      if (updated.length > MAX_DATA_POINTS) {
        return updated.slice(-MAX_DATA_POINTS);
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    const cleanup = metricService.streamMetrics({
      onData: handleNewMetric,
      onError: (error) => {
        console.error('Metric stream error:', error);
      },
    });
    
    return cleanup;
  }, [handleNewMetric]);

  // Transform data for charts
  const cpuChartData: ChartData[] = metrics.map((m) => ({
    time: getFormattedTime(m.timestamp),
    value: m.cpuUsagePercent,
  }));

  const memoryChartData: ChartData[] = metrics.map((m) => ({
    time: getFormattedTime(m.timestamp),
    value: m.memoryUsagePercent,
  }));

  const networkChartData: NetworkChartData[] = metrics.map((m) => ({
    time: getFormattedTime(m.timestamp),
    networkIn: m.networkInKb,
    networkOut: m.networkOutKb,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Real-time system resource monitoring</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={METRIC_LABELS.CPU}
          value={latestMetric?.cpuUsagePercent ?? 0}
          unit="%"
          type="cpu"
        />
        <MetricCard
          label={METRIC_LABELS.MEMORY}
          value={latestMetric?.memoryUsagePercent ?? 0}
          unit="%"
          type="memory"
        />
        <MetricCard
          label={METRIC_LABELS.NETWORK_IN}
          value={latestMetric?.networkInKb ?? 0}
          unit="KB"
          type="networkIn"
        />
        <MetricCard
          label={METRIC_LABELS.NETWORK_OUT}
          value={latestMetric?.networkOutKb ?? 0}
          unit="KB"
          type="networkOut"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CpuChart data={cpuChartData} />
        <MemoryChart data={memoryChartData} />
        <NetworkChart data={networkChartData} />
        <MetricPieChart
          cpuPercent={latestMetric?.cpuUsagePercent ?? 0}
          memoryPercent={latestMetric?.memoryUsagePercent ?? 0}
        />
      </div>
    </div>
  );
};
