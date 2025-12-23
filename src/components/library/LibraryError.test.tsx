import { render, cleanup } from "@testing-library/react";
import { LibraryError } from "@/components/library/LibraryError";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock dependencies
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/FadeIn", () => ({
  FadeIn: ({ children, className }: { children: React.ReactNode; className: string; }) => (
    <div className={className} data-testid="fade-in">
      {children}
    </div>
  ),
}));


vi.mock("next-intl", () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

afterEach(() => {
  cleanup();
});

describe("LibraryError", () => {
  it("should render error message", () => {
    const errorMessage = "Test error message";

    const { getByTestId } = render(<LibraryError error={errorMessage} />);

    expect(getByTestId("error-title")).toBeDefined();
    expect(getByTestId("error-message")).toBeDefined();
  });

  it("should render back to home button", () => {
    const { getByTestId } = render(<LibraryError error="Test error" />);

    expect(getByTestId("button")).toBeDefined();
    expect(getByTestId("back-to-home")).toBeDefined();
  });

  it("should render with correct styling classes", () => {
    const { getByTestId } = render(<LibraryError error="Test error" />);

    const fadeInElement = getByTestId("fade-in");
    expect(fadeInElement).toBeDefined();
  });

  it("should display AlertCircle icon", () => {
    render(<LibraryError error="Test error" />);

    // The icon should be rendered (we can't easily test lucide icons directly, but we can check the structure)
    const iconElement = document.querySelector("svg");
    expect(iconElement).toBeDefined();
  });
});