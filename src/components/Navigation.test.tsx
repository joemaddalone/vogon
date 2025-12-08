import { render } from "@testing-library/react";
import { Navigation } from "@/components/Navigation";
import { expect, it, describe } from "vitest";


describe("Navigation", () => {
  it("should render the navigation", () => {
    const { getByTestId } = render(<Navigation />);
    expect(getByTestId("navigation-movies")).toBeDefined();
    expect(getByTestId("navigation-shows")).toBeDefined();
    expect(getByTestId("navigation-import")).toBeDefined();
    expect(getByTestId("navigation-config")).toBeDefined();
  });
});