"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { formSchema, FormSchema } from "./schema";
import { FarmMapComponent } from "./DrawMap";
import { ImageUploader } from "../image-uploader";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function FarmCreationForm() {
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bounds: null,
      details: "",
    },
  });

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      try {
        const { data, error } = await supabase.from("farms").insert({
          ...values,
          images: await Promise.all(
            images.map(async (image) => {
              const { data, error } = await supabase.storage.from("farm_images").upload(`${Date.now()}-${image.name}`, image);
              if (error) throw error;
              return data.path;
            })
          ),
        });

        if (error) throw error;

        console.log("Farm created successfully:", data);
      } catch (error) {
        console.error("Error creating farm:", error);
      }
    },
    [images]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bounds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Boundaries</FormLabel>
              <FormControl>
                <FarmMapComponent bounds={field.value} setBounds={(bounds) => field.onChange(bounds)} />
              </FormControl>
              <FormDescription>Draw the boundaries of your farm on the map</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm Details</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Farm Images</FormLabel>
              <FormControl>
                <ImageUploader images={images} setImages={setImages} />
              </FormControl>
              <FormDescription>Upload multiple images of your farm</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Farm</Button>
      </form>
    </Form>
  );
}
