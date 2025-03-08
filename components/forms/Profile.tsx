"use client";

import { ProfileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  clerkId: string;
  user: string;
}

function Profile({ clerkId, user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: JSON.parse(user)?.name || "",
      username: JSON.parse(user)?.username || "",
      portfolioWebsite: JSON.parse(user)?.portfolioWebsite || "",
      location: JSON.parse(user)?.location || "",
      bio: JSON.parse(user)?.bio || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      setIsSubmitting(true);

      const res = await updateUser({
        clerkId,
        userData: values,
        path: pathname,
      });

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success("Profile Updated");
        router.back();
      }
    }  finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark400_light800 paragraph-semibold">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="no-focus paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default Profile;
