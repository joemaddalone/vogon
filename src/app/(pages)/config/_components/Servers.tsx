import { Selectable, Server } from "@/lib/types";
import { ServerForm } from "./ServerForm";

export const Servers = ({
  servers,
}: {
  servers: Selectable<Server>[] | undefined;
}) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4 p-4">
        {servers?.map((server) => (
          <ServerForm key={server.id} data={server} />
        ))}
        <ServerForm data={undefined} />
      </div>
    </>
  );
};