import { z } from "zod";

export class TASKVALIDATION {
    static readonly CREATE=z.object({
        title:z.string().min(3, { message:"Title at least 3 char" }),
        description:z.string().optional(),
        dueDate:z.date().optional(),
        status:z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        createdById:z.string()
    })

    static readonly UPDATE=z.object({
        title:z.string().min(3, { message:"Title at least 3 char" }).optional(),
        description:z.string().optional(),
        dueDate:z.date().optional(),
        status:z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    }).refine(
      (data) => {
          return Object.values(data).some(value => value !== undefined);
      },
      {
          message: "At least one field must be provided",
      }
  );

    static readonly ID=z
    .string({
      required_error: 'userId is required',
      invalid_type_error: 'userId must be a string',
    })
    .cuid('userId must be a valid CUID')
    .trim()
    .refine((val) => /^[a-zA-Z0-9-]+$/.test(val), {
      message: 'userId hanya boleh mengandung huruf, angka, dan tanda strip',
    })

}