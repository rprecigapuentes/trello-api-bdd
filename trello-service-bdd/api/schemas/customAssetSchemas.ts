import { z } from 'zod';

export const customEmojiSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
});

export const customEmojiListSchema = z.array(customEmojiSchema);

const customStickerScaledSchema = z.object({
  id: z.string(),
  _id: z.string(),
  scaled: z.boolean(),
  url: z.string(),
  bytes: z.number(),
  height: z.number(),
  width: z.number(),
});

export const customStickerSchema = z.object({
  id: z.string(),
  url: z.string(),
  scaled: z.array(customStickerScaledSchema),
});

export const customStickerListSchema = z.array(z.object({ id: z.string() }));

export type CustomEmoji = z.infer<typeof customEmojiSchema>;
export type CustomSticker = z.infer<typeof customStickerSchema>;
