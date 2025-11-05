import { z } from "zod";

export const registrationSchema = z.object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        required_error: "Please select a gender",
    }),
    phoneNo: z
        .string()
        .regex(/^\+?[\d\s\-()]+$/, "Please enter a valid phone number"),
    tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"], {
        required_error: "Please select a T-shirt size",
    }),
    isVeg: z.boolean(),
    institution: z.string().optional(),
    githubProfile: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
    linkedinProfile: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
});
