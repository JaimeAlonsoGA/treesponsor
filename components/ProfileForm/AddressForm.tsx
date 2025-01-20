import { Control } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type AddressFormProps = {
  control: Control<any>;
};

export default function AddressForm({ control }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="address.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="Your country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="Your city" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street</FormLabel>
            <FormControl>
              <Input placeholder="Your street" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal Code</FormLabel>
            <FormControl>
              <Input placeholder="Your postal code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.street_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Number</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Street number" {...field} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.house_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>House Number</FormLabel>
            <FormControl>
              <Input type="number" placeholder="House number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.house_addition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>House Addition</FormLabel>
            <FormControl>
              <Input placeholder="House addition (optional)" {...field} />
            </FormControl>
            <FormDescription>E.g., Apartment number, floor, etc.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
