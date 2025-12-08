"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Insertable, Selectable, Server } from "@/lib/types";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

const JELLYFIN_ENABLED = true;

export const ServerForm = ({
  data,
}: {
  data: Selectable<Server> | undefined;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serverType, setServerType] = useState(data?.type || "");
  const [_, formAction, pending] = useActionState(
    async (_prev: Server | null | undefined, fdata: FormData) => {
      const server: Insertable<Server> = {
        type: JELLYFIN_ENABLED ? (fdata.get("type") as string) : "plex",
        name: fdata.get("name") as string,
        url: fdata.get("url") as string,
        token: fdata.get("token") as string,
      };

      if (fdata.get("userid")) {
        server.userid = fdata.get("userid") as string;
      }

      if (data?.id) {
        server.id = data.id;
      }
      const result = data?.id
        ? await api.server.update(server)
        : await api.server.create(server);

      setOpen(false);
      router.refresh();
      return result.data;
    },
    null
  );

  const handleDelete = () => {
    if (data?.id) {
      if (window.confirm(t("config.deleteServerConfirm"))) {
        api.server.delete(data.id);
        router.refresh();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle className="text-2xl! pb-0! mb-0! font-bold">
              {data?.name ? t("config.editServer") : t("config.addServer")}
            </DialogTitle>
            <DialogDescription className="text-sm! mb-4!">
              {data?.name ? t("config.editServerDescription") : t("config.addServerDescription")}
            </DialogDescription>
          </DialogHeader>

          {JELLYFIN_ENABLED ? (
            <Field className="mb-4">
              <FieldLabel htmlFor="type">{t("config.serverType")}</FieldLabel>
              <Select
                name="type"
                defaultValue={serverType}
                onValueChange={setServerType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("config.selectServerType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plex">{t("config.plex")}</SelectItem>
                  <SelectItem value="jellyfin">{t("config.jellyfin")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          <Field className="mb-4">
            <FieldLabel htmlFor="name">{t("config.serverName")}</FieldLabel>
            <Input
              className=""
              id="name"
              type="text"
              name="name"
              defaultValue={data?.name || ""}
              placeholder={t("config.serverNamePlaceholder")}
              required
            />
          </Field>
          <Field className="mb-4">
            <FieldLabel htmlFor="name">{t("config.serverUrl")}</FieldLabel>
            <Input
              className=""
              id="name"
              type="text"
              name="url"
              defaultValue={data?.url || ""}
              placeholder={t("config.serverUrlPlaceholder")}
              required
            />
          </Field>
          <Field className="mb-4">
            <FieldLabel htmlFor="name">{t("config.token")}</FieldLabel>
            <Input
              className=""
              id="name"
              type="text"
              name="token"
              defaultValue={data?.token || ""}
              placeholder={t("config.tokenPlaceholder")}
              required
            />
          </Field>
          {serverType === "jellyfin" ? (
            <Field className="mb-4">
              <FieldLabel htmlFor="name">{t("config.userId")}</FieldLabel>
              <Input
                className=""
                id="name"
                type="text"
                name="userid"
                defaultValue={data?.userid || ""}
                placeholder={t("config.userIdPlaceholder")}
                required={serverType === "jellyfin"}
              />
            </Field>
          ) : null}
          <DialogFooter>
            <div className="flex justify-between items-center w-full mt-4">
              <div>
                {data?.id ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    {t("common.delete")}
                  </Button>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {/* <DialogClose asChild>
                  <Button variant="outline">Test Connection</Button>
                </DialogClose> */}
                <Button type="submit" disabled={pending}>
                  {pending ? <Spinner /> : t("common.save")}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
      <DialogTrigger asChild>
        <div className="border border-gray-500 rounded-md p-4 shadow-md cursor-pointer text-sm hover:bg-gray-500">
          <span className="font-bold">{data?.name || t("config.addServer")}</span>
        </div>
      </DialogTrigger>
    </Dialog>
  );
};
