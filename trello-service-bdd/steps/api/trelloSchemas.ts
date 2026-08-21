import { z } from "zod";

export const trelloBoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  closed: z.boolean(),
  url: z.string(),
});

export const trelloListSchema = z.object({
  id: z.string(),
  name: z.string(),
  idBoard: z.string(),
  closed: z.boolean(),
});

export const trelloCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  idList: z.string(),
  idBoard: z.string(),
  closed: z.boolean(),
  url: z.string(),
});

export type TrelloBoard = z.infer<typeof trelloBoardSchema>;
export type TrelloList = z.infer<typeof trelloListSchema>;
export type TrelloCard = z.infer<typeof trelloCardSchema>;