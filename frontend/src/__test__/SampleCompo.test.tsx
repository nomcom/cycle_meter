import { render, screen } from "@testing-library/react";
import { MyComponent } from "./SampleCompo";

test("「Hello Test」が描画されている", () => {
  render(<MyComponent />);
  screen.debug();
  expect(screen.getByText("Hello Test")).toBeInTheDocument();
});
