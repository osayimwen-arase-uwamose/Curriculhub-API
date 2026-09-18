import { z } from "zod";

const memberIdParamsSchema = z.object({
  hubId: z.string().min(1),
  userId: z.string().min(1),
});

const addMemberSchema = z.object({
  userId: z.string().min(1),

  role: z
    .enum(["member", "admin"])
    .optional(),
});

const changeMemberRoleSchema = z.object({ 
  hubId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["member", "admin"]),
});

const transferOwnershipSchema = z.object({ 
  hubId: z.string().min(1),
  newOwnerId: z.string().min(1),
});

const listMembersSchema = z.object({ 
  hubId: z.string().min(1),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  status: z
    .enum([
      "pending",
      "active",
      "suspended",
      "removed",
    ])
    .default("active"),
});

export { 
  memberIdParamsSchema,
  addMemberSchema,
  changeMemberRoleSchema,
  transferOwnershipSchema,
  listMembersSchema,
};
