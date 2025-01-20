"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { formSchema, FormSchema } from "./schema";
import { MapComponent } from "./MapComponent";
import { MonthlyProductionSelector } from "./MonthlyProductionSelector";
import { processImage } from "./utils";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function TreeCreationForm() {
  const [treeTypes, setTreeTypes] = useState<{ name: string; id: string }[]>([]);
  const [farms, setFarms] = useState<{ name: string; id: string }[]>([]);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    async function fetchSelectOptions() {
      const { data: fruits, error: error_fruits } = await supabase.from("fruits").select();
      const { data: farms, error: error_farms } = await supabase.from("farms").select();
      if (error_fruits || error_farms) {
        return;
      }

      setTreeTypes(fruits ?? []);
      setFarms(farms ?? []);
    }

    fetchSelectOptions();
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fruit_id: "",
      age: 0,
      estimated_production: {},
      farm_id: "",
      description: "",
      location: { lat: 0, lng: 0 },
    },
  });

  const onSubmit = useCallback(async (values: FormSchema) => {
    try {
      const { image, ...rest } = values;
      let imageUrl = null;
      if (image) {
        const processedImage = await processImage(image);
        const { data, error } = await supabase.storage.from("tree-images").upload(`${Date.now()}-${processedImage.name}`, processedImage);

        if (error) throw error;
        imageUrl = data.path;
      }
      const { data, error } = await supabase.from("trees").insert({
        ...values,
        image_url: imageUrl,
      });

      if (error) throw error;

      console.log("Tree created successfully:", data);
    } catch (error) {
      console.error("Error creating tree:", error);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fruit_id"
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
                  {treeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="farm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.name}
                    </SelectItem>
                  ))}
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
          name="estimated_production"
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <MapComponent
                  location={{ lat: field.value.lat, lng: field.value.lng }}
                  setLocation={(lat, lng) => {
                    field.onChange({ lat, lng });
                  }}
                />
              </FormControl>
              <FormDescription>Search for a location, click on the map, or use your current location to set the tree location</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tree Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
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
