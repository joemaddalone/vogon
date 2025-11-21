"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Insertable, Selectable, Server } from "@/lib/types";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export const ServerForm = ({
  data,
}: {
  data: Selectable<Server> | undefined;
}) => {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [_, formAction, pending] = useActionState(
    async (_prev: Server | null | undefined, fdata: FormData) => {
      const server: Insertable<Server> = {
        type: 'plex',
        name: 'Plex Server',
        url: fdata.get("url") as string,
        token: fdata.get("token") as string,
      };

      if (data?.id) {
        server.id = data.id;
      }
      const result = data?.id
        ? await api.server.update(server)
        : await api.server.create(server);

      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
        return null;
      }

      setMessage({
        type: "success",
        text: "Server configuration saved successfully",
      });

      router.refresh();
      return result.data;
    },
    null
  );

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <form action={formAction}>
        <Field className="mb-4">
          <FieldLabel htmlFor="name">Server URL</FieldLabel>
          <Input
            className=""
            id="name"
            type="text"
            name="url"
            defaultValue={data?.url || ""}
            placeholder="http://192.168.1.2:32400"
            required
          />
        </Field>
        <Field className="mb-4">
          <FieldLabel htmlFor="name">Token</FieldLabel>
          <Input
            className=""
            id="name"
            type="text"
            name="token"
            defaultValue={data?.token || ""}
            placeholder="Enter your server token"
            required
          />
        </Field>

        <div className="flex justify-between items-center w-full mt-6">
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? <><Spinner />Save Server Configuration</> : "Save Server Configuration"}
            </Button>
          </div>
        </div>
        {message && (
            <div
              className={`p-4 rounded-md mt-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}
      </form>
    </div>
  );
};