"use client";

import { useState, useActionState } from "react";
import { api } from "@/lib/api";
import {
  FieldGroup,
} from "@/components/ui/field";
import { Updateable } from "kysely";
import { Configuration } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ConfigField } from "./ConfigField";

export default function ConfigForm({ config }: { config: Configuration }) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();
  const [configData, formAction, pending] = useActionState(
    async (prev: Configuration | null, data: FormData) => {
      const updateable: Updateable<Configuration> = {
        plexServerUrl: data.get("plexServerUrl") as string | undefined,
        plexToken: data.get("plexToken") as string | undefined,
      };
      const result = await api.config.save(updateable);
      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
        return prev;
      }
      setMessage({
        type: "success",
        text: "Configuration saved successfully",
      });
      router.prefetch("/");
      router.prefetch("/movie");
      router.prefetch("/show");
      router.prefetch("/import");
      router.refresh();
      return result.data;
    },
    config
  );

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p>
          Configure your Plex server and API credentials. All values are stored
          securely in the local database.{" "}
          <i className="text-sm text-orange-200">
            Environment variables will take precedence here.
          </i>
        </p>
      </div>

      <form action={formAction}>
        <FieldGroup className="p-4">
          <ConfigField
            configData={configData as Configuration}
            label="Plex Server URL"
            hint="env. PLEX_SERVER_URL"
            dataKey="plexServerUrl"
            placeholder="http://192.168.1.2:32400"
            required
          >
            Your Plex Media Server URL (usually local network IP with port
            32400)
          </ConfigField>
          <ConfigField
            configData={configData as Configuration}
            label="Plex Token"
            hint="env. PLEX_TOKEN"
            dataKey="plexToken"
            placeholder="Enter your Plex token"
            required
          >
            Your Plex authentication token.{" "}
            <a
              href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              How to find your token
            </a>
          </ConfigField>
        </FieldGroup>
      </form>
    </div>
  );
}
