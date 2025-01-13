import * as z from 'zod'

const monthlyProductionSchema = z.object({
	kg: z.number().min(0),
	units: z.number().min(0).int()
})

const monthsSchema = z.record(monthlyProductionSchema)

export const formSchema = z.object({
	treeName: z.string().min(2, {
		message: "Tree name must be at least 2 characters.",
	}),
	treeType: z.string({
		required_error: "Please select a tree type.",
	}),
	age: z.number().min(0, {
		message: "Age must be a positive number.",
	}),
	estimatedProduction: monthsSchema,
	description: z.string().optional(),
	latitude: z.number(),
	longitude: z.number(),
})

export type FormSchema = z.infer<typeof formSchema>

