import { z } from 'zod';

export const trelloLabelSchema = z.object({
  id: z.string(),
  idBoard: z.string(),
  name: z.string(),
  color: z.string().nullable(),
});

export type LabelSchema = z.infer<typeof trelloLabelSchema>;

export type LabelPayload = {
  name?: string;
  color?: string;
  idBoard?: string;
};
