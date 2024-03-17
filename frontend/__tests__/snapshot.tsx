/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
// import { } from "@/pages/"

it("renders homepage unchanged", () => {
  const { container } = render(<Login />);
  expect(container).toMatchSnapshot();
});
