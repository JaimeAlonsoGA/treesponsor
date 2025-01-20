'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: any) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) {
		console.log('no user');
		return { error: 'Not authenticated' }
	}

	console.log(formData);

	const { data, error } = await supabase.rpc('update_profile_and_address', {
		p_user_id: user.id,
		p_name: formData.name,
		p_country: formData.address.country,
		p_city: formData.address.city,
		p_street: formData.address.street,
		p_postal_code: formData.address.postal_code,
		p_street_number: parseInt(formData.address.street_number),
		p_house_number: parseInt(formData.address.house_number),
		p_house_addition: formData.address.house_addition
	})

	if (error) {
		console.log(error.message);
		return { error: error.message }
	}

	revalidatePath('/profile')
	return { success: true }
}

