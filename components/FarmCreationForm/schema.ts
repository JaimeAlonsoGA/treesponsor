import { z } from "zod";

export const formSchema = z.object({
	name: z.string().min(1, "Farm name is required"),
	bounds: z.array(z.object({ lat: z.number(), lng: z.number() })).nullable(),
	details: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

