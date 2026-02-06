import { z } from 'zod';

export const thresholdSchema = z.object({
  cpuThreshold: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(0, 'Must be at least 0')
    .max(100, 'Must be at most 100'),
  memoryThreshold: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(0, 'Must be at least 0')
    .max(100, 'Must be at most 100'),
  networkInThreshold: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(0, 'Must be at least 0'),
  networkOutThreshold: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(0, 'Must be at least 0'),
});

export type ThresholdSchemaType = z.infer<typeof thresholdSchema>;
