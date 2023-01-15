import React from "react";
import { render } from "@testing-library/react";
import Input from "../components/Forms/Input";

test("Render input component", () => {
  const result = render(<Input />);
  const usernameInput = result.container.querySelector("#username");
  expect(usernameInput).toBeTruthy();
});
