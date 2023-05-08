import { render } from "../../test-utils";
import { App } from "./App";
import { screen } from "@testing-library/react";
import React from "react";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn chakra/i);
  expect(linkElement).toBeInTheDocument();
});
