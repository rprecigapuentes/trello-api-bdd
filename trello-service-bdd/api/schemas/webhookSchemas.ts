import { z } from 'zod';

export const webhookSchema = z.object({
  id: z.string(),
  description: z.string(),
  idModel: z.string(),
  callbackURL: z.string(),
  active: z.boolean(),
  consecutiveFailures: z.number().optional(),
  firstConsecutiveFailDate: z.string().nullish(),
});

export const webhookListSchema = z.array(webhookSchema);

export const webhookSiteRequestSchema = z.object({
  uuid: z.string(),
  method: z.string(),
  content: z.string(),
});

export const trelloWebhookPayloadSchema = z.object({
  action: z.object({
    type: z.string(),
  }),
  model: z.object({
    id: z.string(),
  }),
});

export type Webhook = z.infer<typeof webhookSchema>;
export type WebhookSiteRequest = z.infer<typeof webhookSiteRequestSchema>;
export type TrelloWebhookPayload = z.infer<typeof trelloWebhookPayloadSchema>;
