"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldLegend,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

interface ConfigFormData {
  plexServerUrl: string;
  plexToken: string;
  tmdbApiKey: string;
  fanartApiKey: string;
  removeOverlays: number;
  thePosterDbEmail: string;
  thePosterDbPassword: string;
}

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigFormData>({
    plexServerUrl: "",
    plexToken: "",
    tmdbApiKey: "",
    fanartApiKey: "",
    removeOverlays: 0,
    thePosterDbEmail: "",
    thePosterDbPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    const result = await api.config.get();
    if (result.data) {
      setConfig({
        plexServerUrl: result.data.plexServerUrl || "",
        plexToken: result.data.plexToken || "",
        tmdbApiKey: result.data.tmdbApiKey || "",
        fanartApiKey: result.data.fanartApiKey || "",
        removeOverlays: result.data.removeOverlays ?? 0,
        thePosterDbEmail: result.data.thePosterDbEmail || "",
        thePosterDbPassword: result.data.thePosterDbPassword || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Load initial configuration on mount - valid use case for data fetching
    const doThing = async () => loadConfig();
    doThing();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await api.config.save(config);

    if (result.error) {
      setMessage({
        type: "error",
        text: result.error.message || "Failed to save configuration",
      });
    } else {
      setMessage({
        type: "success",
        text: "Configuration saved successfully!",
      });
      // Reload to get masked values
      await loadConfig();
    }

    setSaving(false);
  };

  const handleChange = (
    field: keyof ConfigFormData,
    value: string | boolean | number
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p className="text-muted-foreground">
          Configure your Plex server and API credentials. All values are stored
          securely in the local database.{" "}
          <i className="text-sm text-orange-200">
            Environment variables will take precedence here.
          </i>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup className="p-4">
          {/* Plex Server URL */}
          <Field>
            <FieldLabel htmlFor="plexServerUrl">
              Plex Server URL{" "}
              <span className="text-xs text-muted-foreground">
                env. PLEX_SERVER_URL
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="plexServerUrl"
              type="text"
              value={config.plexServerUrl}
              onChange={(e) => handleChange("plexServerUrl", e.target.value)}
              placeholder="http://192.168.1.2:32400"
              required
            />
            <FieldDescription>
              Your Plex Media Server URL (usually local network IP with port
              32400)
            </FieldDescription>
          </Field>

          {/* Plex Token */}
          <Field>
            <FieldLabel htmlFor="plexToken">
              Plex Token{" "}
              <span className="text-xs text-muted-foreground">
                env. PLEX_TOKEN
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="plexToken"
              type="password"
              value={config.plexToken}
              onChange={(e) => handleChange("plexToken", e.target.value)}
              placeholder="Enter your Plex token"
              required
            />
            <FieldDescription>
              Your Plex authentication token.{" "}
              <a
                href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                How to find your token
              </a>
            </FieldDescription>
          </Field>

          {/* TMDB API Key */}
          <Field>
            <FieldLabel htmlFor="tmdbApiKey">
              TMDB API Key{" "}
              <span className="text-xs text-muted-foreground">
                env. TMDB_API_KEY
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="tmdbApiKey"
              type="password"
              value={config.tmdbApiKey}
              onChange={(e) => handleChange("tmdbApiKey", e.target.value)}
              placeholder="Enter your TMDB API key"
              required
            />
            <FieldDescription>
              The Movie Database (TMDB) API key for poster lookups.{" "}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get your API key
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
        {/* Fanart API Key (Optional) */}
        <FieldGroup className="p-4 mt-5 bg-muted">
          <FieldLegend>Optional Fields</FieldLegend>
          <Field>
            <FieldLabel htmlFor="fanartApiKey">
              Fanart.tv API Key (Optional){" "}
              <span className="text-xs text-muted-foreground">
                env. FANART_API_KEY
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="fanartApiKey"
              type="password"
              value={config.fanartApiKey}
              onChange={(e) => handleChange("fanartApiKey", e.target.value)}
              placeholder="Enter your Fanart.tv API key (optional)"
            />
            <FieldDescription>
              Optional: Fanart.tv API key for additional poster sources.{" "}
              <a
                href="https://fanart.tv/get-an-api-key/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get your API key
              </a>
            </FieldDescription>
          </Field>
          {/* ThePosterDB Email */}
          <Field>
            <FieldLabel htmlFor="thePosterDbEmail">
              ThePosterDB Email{" "}
              <span className="text-xs text-muted-foreground">
                env. THEPOSTERDB_EMAIL
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="thePosterDbEmail"
              type="email"
              value={config.thePosterDbEmail}
              onChange={(e) => handleChange("thePosterDbEmail", e.target.value)}
              placeholder="Enter your ThePosterDB email"
            />
            <FieldDescription>
              Your ThePosterDB email for poster lookups.
            </FieldDescription>
          </Field>
          {/* ThePosterDB Password */}
          <Field>
            <FieldLabel htmlFor="thePosterDbPassword">
              ThePosterDB Password{" "}
              <span className="text-xs text-muted-foreground">
                env. THEPOSTERDB_PASSWORD
              </span>
            </FieldLabel>
            <Input
              className="h-12 px-3 text-lg"
              id="thePosterDbPassword"
              type="password"
              value={config.thePosterDbPassword}
              onChange={(e) =>
                handleChange("thePosterDbPassword", e.target.value)
              }
              placeholder="Enter your ThePosterDB password"
            />
            <FieldDescription>
              Your ThePosterDB password for poster lookups.
            </FieldDescription>
          </Field>

          {/* Remove Overlays Checkbox */}
          <Field>
            <div className="flex items-center gap-2">
              <input
                id="removeOverlays"
                type="checkbox"
                checked={config.removeOverlays === 1}
                onChange={(e) =>
                  handleChange("removeOverlays", e.target.checked ? 1 : 0)
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <FieldLabel htmlFor="removeOverlays" className="mb-0!">
                Remove Overlays{" "}
                <span className="text-xs text-muted-foreground">
                  env. REMOVE_OVERLAYS
                </span>
              </FieldLabel>
            </div>
            <FieldDescription>
              Remove Plex overlay labels when updating posters{" "}
              <span className="font-bold">(useful for Kometa/PMM users)</span>
            </FieldDescription>
          </Field>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
