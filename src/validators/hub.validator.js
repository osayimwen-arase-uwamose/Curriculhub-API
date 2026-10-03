import { z } from "zod";

// const hubIdParamsSchema = z.object({
//   hubId: z.string().min(1),
// });

// const hubSlugParamsSchema = z.object({
//   slug: z.string().trim().min(1),
// });

const createHubSchema = z.object({
  body: z.object({
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
  }),

  params: z.object({}),

  query: z.object({}),
});

//TODO: Verify how this affects cases where not all fields in this object below are sent. How does this z schema validation work?

const updateHubSchema = z
  .object({
    body: z.object({
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
    }).strict(),

    params: z.object({}),

    query: z.object({}),
  });
  
export { 
  // hubIdParamsSchema,
  // hubSlugParamsSchema,
  createHubSchema,
  updateHubSchema,
};
