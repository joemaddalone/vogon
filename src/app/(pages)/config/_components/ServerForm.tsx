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

const JELLYFIN_ENABLED = true;

export const ServerForm = ({
  data,
}: {
  data: Selectable<Server> | undefined;
}) => {
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
      if (window.confirm("Are you sure you want to delete this server?")) {
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
              {data?.name ? "Edit" : "Add"} Server
            </DialogTitle>
            <DialogDescription className="text-sm! mb-4!">
              {data?.name ? "Edit" : "Add"} the server configuration.
            </DialogDescription>
          </DialogHeader>

          {JELLYFIN_ENABLED ? (
            <Field className="mb-4">
              <FieldLabel htmlFor="type">Server Type</FieldLabel>
              <Select
                name="type"
                defaultValue={serverType}
                onValueChange={setServerType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Server Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plex">Plex</SelectItem>
                  <SelectItem value="jellyfin">Jellyfin</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          ) : null}
          <Field className="mb-4">
            <FieldLabel htmlFor="name">Server Name</FieldLabel>
            <Input
              className=""
              id="name"
              type="text"
              name="name"
              defaultValue={data?.name || ""}
              placeholder="Name your server"
              required
            />
          </Field>
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
          {serverType === "jellyfin" ? (
            <Field className="mb-4">
              <FieldLabel htmlFor="name">User ID</FieldLabel>
              <Input
                className=""
                id="name"
                type="text"
                name="userid"
                defaultValue={data?.userid || ""}
                placeholder="Enter your server user id"
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
                    Delete
                  </Button>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {/* <DialogClose asChild>
                  <Button variant="outline">Test Connection</Button>
                </DialogClose> */}
                <Button type="submit" disabled={pending}>
                  {pending ? <Spinner /> : "Save"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
      <DialogTrigger asChild>
        <div className="border border-gray-500 rounded-md p-4 shadow-md cursor-pointer text-sm hover:bg-gray-500">
          <span className="font-bold">{data?.name || "Add Server"}</span>
        </div>
      </DialogTrigger>
    </Dialog>
  );
};
