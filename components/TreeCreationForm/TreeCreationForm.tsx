"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { formSchema, FormSchema } from "./schema";
import { processImage } from "./utils";
import { MapComponent } from "./MapComponent";
import { MonthlyProductionSelector } from "./MonthlyProductionSelector";

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function TreeCreationForm() {
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      treeName: "",
      treeType: "",
      age: 0,
      estimatedProduction: {},
      description: "",
      latitude: location.lat,
      longitude: location.lng,
    },
  });

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      try {
        // Process and upload image to Supabase Storage
        let imageUrl = null;
        if (image) {
          const processedImage = await processImage(image);
          const { data, error } = await supabase.storage.from("tree-images").upload(`${Date.now()}-${processedImage.name}`, processedImage);

          if (error) throw error;
          imageUrl = data.path;
        }

        // Insert tree data into Supabase
        const { data, error } = await supabase.from("trees").insert({
          ...values,
          image_url: imageUrl,
        });

        if (error) throw error;

        console.log("Tree created successfully:", data);
        // Reset form or show success message
      } catch (error) {
        console.error("Error creating tree:", error);
        // Show error message to user
      }
    },
    [image]
  );

  const handleSetLocation = useCallback(
    (lat: number, lng: number) => {
      setLocation({ lat, lng });
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);
    },
    [form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="treeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tree name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="oak">Oak</SelectItem>
                  <SelectItem value="pine">Pine</SelectItem>
                  <SelectItem value="maple">Maple</SelectItem>
                  <SelectItem value="birch">Birch</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (years)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedProduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Monthly Production</FormLabel>
              <FormControl>
                <MonthlyProductionSelector value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>Enter the estimated production for each month in kg and units</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter tree description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <MapComponent location={location} setLocation={handleSetLocation} />
              </FormControl>
              <FormDescription>Search for a location, click on the map, or use your current location to set the tree location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
                      field.onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>The image will be converted to WebP format and resized before upload</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Tree</Button>
      </form>
    </Form>
  );
}
