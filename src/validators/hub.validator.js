import { z } from "zod";

// const hubIdParamsSchema = z.object({
//   hubId: z.string().min(1),
// });

// const hubSlugParamsSchema = z.object({
//   slug: z.string().trim().min(1),
// });

const createHubSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Hub title is required."),

  description: z
    .string()
    .trim()
    .min(1, "Hub description is required."),

  visibility: z
    .enum(["public", "private"])
    .optional(),

  status: z
    .enum(["draft", "active", "archived"])
    .optional(),

  maxMembers: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
});

const updateHubSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1)
      .optional(),

    description: z
      .string()
      .trim()
      .min(1)
      .optional(),

    visibility: z
      .enum(["public", "private"])
      .optional(),

    status: z
      .enum(["draft", "active", "archived"])
      .optional(),

    maxMembers: z
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),
  })
  .strict();

export { 
  // hubIdParamsSchema,
  // hubSlugParamsSchema,
  createHubSchema,
  updateHubSchema,
};
