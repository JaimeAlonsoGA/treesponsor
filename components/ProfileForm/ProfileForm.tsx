"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { updateProfile } from "./actions";
import AddressForm from "./AddressForm";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.enum(["client", "farmer", "both"], {
    required_error: "Please select a role.",
  }),
  address: z.object({
    id: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    street: z.string().min(1, "Street is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    street_number: z.number().nullable(),
    house_number: z.number().min(1, "House number is required"),
    house_addition: z.string().optional(),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type Profile = {
  user_id: string;
  name: string | null;
  role: string;
  has_profile: boolean;
  score: number | null;
  profile_picture_url: string | null;
  address: string | null;
  addresses: ProfileFormValues["address"] | null;
};

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name || "",
      role: profile.role as "client" | "farmer" | "both",
      address: profile.addresses || {
        country: "",
        city: "",
        street: "",
        postal_code: "",
        street_number: null,
        house_number: 0,
        house_addition: "",
      },
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    const result = await updateProfile(data);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select your role in the platform.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AddressForm control={form.control} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
