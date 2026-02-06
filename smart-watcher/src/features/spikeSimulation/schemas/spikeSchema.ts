import { z } from 'zod';

export const spikeSimulationSchema = z
  .object({
    cpuUsagePercent: z
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Must be at least 0')
      .max(100, 'Must be at most 100')
      .optional()
      .or(z.literal('')),
    memoryUsagePercent: z
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Must be at least 0')
      .max(100, 'Must be at most 100')
      .optional()
      .or(z.literal('')),
    networkInKb: z
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Must be at least 0')
      .optional()
      .or(z.literal('')),
    networkOutKb: z
      .number({ invalid_type_error: 'Must be a number' })
      .min(0, 'Must be at least 0')
      .optional()
      .or(z.literal('')),
    durationSeconds: z
      .number({ invalid_type_error: 'Must be a number' })
      .min(1, 'Duration must be at least 1 second'),
  })
  .refine(
    (data) => {
      const hasValue =
        (typeof data.cpuUsagePercent === 'number') ||
        (typeof data.memoryUsagePercent === 'number') ||
        (typeof data.networkInKb === 'number') ||
        (typeof data.networkOutKb === 'number');
      return hasValue;
    },
    {
      message: 'At least one metric value is required',
      path: ['cpuUsagePercent'],
    }
  );

export type SpikeSimulationSchemaType = z.infer<typeof spikeSimulationSchema>;
