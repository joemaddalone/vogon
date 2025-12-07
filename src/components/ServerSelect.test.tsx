import { test, expect, vi } from "vitest";
import { ServerSelector } from "@/components/ServerSelect";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { api } from "@/lib/api";

const mockServers = [
  {
    id: 1,
    name: "Server 1",
    type: "plex",
    url: "http://localhost:3000",
    token: "token0",
    userid: "userid",
  },
  {
    id: 2,
    name: "Server 2",
    type: "jellyfin",
    url: "http://localhost:3001",
    token: "token1",
    userid: "userid",
  },
  {
    id: 3,
    name: "Server 3",
    type: "plex",
    url: "http://localhost:3002",
    token: "token2",
    userid: "userid",
  },
];

vi.mock("@/lib/api", () => ({
  api: {
    session: {
      update: vi.fn().mockResolvedValue({ data: { id: 2, serverId: 2 } }),
    },
  },
}));

test("ServerSelector", async () => {
  const { getByTestId, queryByTestId, getByRole } = render(
    <ServerSelector session={{ id: 1, serverId: 1 }} servers={mockServers} />
  );
  await waitFor(() => {
    expect(getByTestId("server-select-item-1")).toBeDefined();
    expect(queryByTestId("server-select-item-2")).toBeNull();
    expect(queryByTestId("server-select-item-3")).toBeNull();
  });

  // open the select
  fireEvent.click(getByRole("combobox"));
  waitFor(() => {
    expect(getByTestId("server-select-item-2")).toBeDefined();
    expect(getByTestId("server-select-item-3")).toBeDefined();
    // click on the second item
    fireEvent.click(getByTestId("server-select-item-2"));
    waitFor(() => {
      expect(api.session.update).toHaveBeenCalledWith({
        sessionId: 1,
        serverId: 2,
      });
      expect(getByTestId("server-select-item-2")).toBeDefined();
      expect(queryByTestId("server-select-item-1")).toBeNull();
      expect(queryByTestId("server-select-item-3")).toBeNull();
    });
  });
});
