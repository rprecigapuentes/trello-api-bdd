import { z } from 'zod';

export const trelloOrganizationSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  name: z.string(),
  desc: z.string(),
  website: z.string().nullable(),
  logoHash: z.string().nullable().optional(),
});

export type OrganizationSchema = z.infer<typeof trelloOrganizationSchema>;

export type OrganizationPayload = {
  displayName?: string;
  name?: string;
  desc?: string;
  website?: string;
};
