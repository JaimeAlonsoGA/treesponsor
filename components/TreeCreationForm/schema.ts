import * as z from 'zod'

const monthlyProductionSchema = z.object({
	kg: z.number().min(0),
	units: z.number().min(0).int()
})

const monthsSchema = z.record(monthlyProductionSchema)

export const formSchema = z.object({
	fruit_id: z.string({
		required_error: "Please select a tree type.",
	}),
	age: z.number().min(0, {
		message: "Age must be a positive number.",
	}),
	estimated_production: monthsSchema,
	description: z.string().optional(),
	farm_id: z.string(),
	location: z.object({
		lat: z.number(),
		lng: z.number()
	}),
	image: z.any().optional()
})

export type FormSchema = z.infer<typeof formSchema>

