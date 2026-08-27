import { z } from 'zod';

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

export const trelloMemberSchema = z.object({
  id: z.string(),
  bio: z.string(),
  fullName: z.string(),
  username: z.string(),
  memberType: z.string(),
  avatarSource: z.string(),
  email: z.string(),
});

export const boardStarSchema = z.object({
  id: z.string(),
  idBoard: z.string(),
  pos: z.union([z.string(), z.number()]),
});

export type TrelloBoardSchema = z.infer<typeof trelloBoardSchema>;
export type TrelloListSchema = z.infer<typeof trelloListSchema>;
export type TrelloCardSchema = z.infer<typeof trelloCardSchema>;
export type TrelloMemberSchema = z.infer<typeof trelloMemberSchema>;
export type TrelloBoardStarSchema = z.infer<typeof boardStarSchema>;
