import "@testing-library/jest-dom";
import React from "react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => {
    return React.createElement("a", { href, onClick }, children);
  };
  return MockLink;
});
