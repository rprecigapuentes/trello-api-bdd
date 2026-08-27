import { z } from 'zod';

const backgroundScaledSchema = z.object({
  id: z.string(),
  _id: z.string(),
  scaled: z.boolean(),
  url: z.string(),
  bytes: z.number(),
  height: z.number(),
  width: z.number(),
});

const backgroundDefaultSchema = z.object({
  id: z.string(),
  type: z.literal('default'),
  tile: z.boolean(),
  brightness: z.string(),
  color: z.string(),
});

const backgroundGradientSchema = z.object({
  id: z.string(),
  type: z.literal('gradient'),
  tile: z.boolean(),
  brightness: z.string(),
  color: z.string(),
  version: z.number().optional(),
  fullSizeUrl: z.string(),
  darkFullSizeUrl: z.string().optional(),
  darkColor: z.string().optional(),
  bottomColor: z.string(),
  topColor: z.string(),
  emoji: z.string(),
});

const backgroundPremiumSchema = z.object({
  id: z.string(),
  type: z.literal('premium'),
  tile: z.boolean(),
  brightness: z.string(),
  bottomColor: z.string(),
  topColor: z.string(),
  fullSizeUrl: z.string(),
  pack: z.object({ name: z.string() }).optional(),
  scaled: z.array(backgroundScaledSchema).optional(),
  attribution: z.string().optional(),
});

const backgroundCustomSchema = z.object({
  id: z.string(),
  type: z.literal('custom'),
  tile: z.boolean(),
  brightness: z.string(),
  bottomColor: z.string().nullish(),
  topColor: z.string().nullish(),
  fullSizeUrl: z.string().optional(),
  scaled: z.array(backgroundScaledSchema).optional(),
});

export const trelloBoardBackgroundSchema = z.discriminatedUnion('type', [
  backgroundDefaultSchema,
  backgroundGradientSchema,
  backgroundPremiumSchema,
  backgroundCustomSchema,
]);

export const backgroundListSchema = z.array(z.object({ id: z.string() }));

export type TrelloBoardBackground = z.infer<typeof trelloBoardBackgroundSchema>;
