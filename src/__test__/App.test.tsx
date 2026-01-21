import { render, fireEvent, cleanup } from "@testing-library/react";
import { expect, it, describe, afterEach } from "vitest";
import App from "../App";

describe("App Component", () => {
  afterEach(cleanup);

  it("should have default unit as %", () => {
    const { getByText } = render(<App />);
    const percentBtn = getByText("%");
    expect(percentBtn.className).toContain("bg-[#424242]");
  });

  it("should replace comma with dot in input", () => {
    const { getByRole } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12,3" } });
    expect(input.value).toBe("12.3");
  });

  it("should remove invalid characters on blur: 123a -> 123", () => {
    const { getByRole, getByText } = render(<App />);
    const pxBtn = getByText("px");
    fireEvent.click(pxBtn);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123a" } });
    fireEvent.blur(input);
    expect(input.value).toBe("123");
  });

  it("should remove invalid characters on blur: 12a3 -> 12", () => {
    const { getByRole } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12a3" } });
    fireEvent.blur(input);
    expect(input.value).toBe("12");
  });

  it("should handle invalid characters on blur: a123 -> 0", () => {
    const { getByRole, getByText } = render(<App />);
    const pxBtn = getByText("px");
    fireEvent.click(pxBtn);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "a123" } });
    fireEvent.blur(input);
    expect(input.value).toBe("123");
  });

  it("should handle multiple dots on blur: 12.4.5 -> 12.4", () => {
    const { getByRole } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12.4.5" } });
    fireEvent.blur(input);
    expect(input.value).toBe("12.4");
  });

  it("should clamp negative values to 0 on blur", () => {
    const { getByRole } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "-5" } });
    fireEvent.blur(input);
    expect(input.value).toBe("0");
  });

  it("should clamp values > 100 to last valid value when unit is %", () => {
    const { getByRole } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.blur(input);
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    expect(input.value).toBe("50");
  });

  it("should disable - button when value is 0", () => {
    const { getByRole, getByText } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    const decreaseBtn = getByText("−") as HTMLButtonElement;
    expect(decreaseBtn.disabled).toBe(true);
  });

  it("should disable + button when value is 100 and unit is %", () => {
    const { getByRole, getByText } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    const increaseBtn = getByText("+") as HTMLButtonElement;
    expect(increaseBtn.disabled).toBe(true);
  });

  it("should update to 100 when switching from px to % with value > 100", () => {
    const { getByText, getByRole } = render(<App />);
    const pxBtn = getByText("px");
    fireEvent.click(pxBtn);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.blur(input);
    const percentBtn = getByText("%");
    fireEvent.click(percentBtn);
    expect(input.value).toBe("100");
  });

  it("should allow values > 100 when unit is px", () => {
    const { getByText, getByRole } = render(<App />);
    const pxBtn = getByText("px");
    fireEvent.click(pxBtn);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.blur(input);
    expect(input.value).toBe("200");
  });

  it("should not disable + button when unit is px", () => {
    const { getByText, getByRole } = render(<App />);
    const pxBtn = getByText("px");
    fireEvent.click(pxBtn);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    const increaseBtn = getByText("+") as HTMLButtonElement;
    expect(increaseBtn.disabled).toBe(false);
  });

  it("should handle float values", () => {
    const { getByRole } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12.5" } });
    fireEvent.blur(input);
    expect(input.value).toBe("12.5");
  });

  it("should increment value by 0.1 when clicking +", () => {
    const { getByRole, getByText } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.blur(input);
    const increaseBtn = getByText("+");
    fireEvent.click(increaseBtn);
    expect(input.value).toBe("10.1");
  });

  it("should decrement value by 0.1 when clicking -", () => {
    const { getByRole, getByText } = render(<App />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.blur(input);
    const decreaseBtn = getByText("−");
    fireEvent.click(decreaseBtn);
    expect(input.value).toBe("9.9");
  });
});
