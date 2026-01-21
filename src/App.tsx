import { useState, useRef } from "react";

type Unit = "percent" | "px";

const App = () => {
  const [value, setValue] = useState(100);
  const [unit, setUnit] = useState<Unit>("percent");
  const [lastValidValue, setLastValidValue] = useState(100);
  const [inputValue, setInputValue] = useState("100");
  const [showTooltip, setShowTooltip] = useState({
    decrease: false,
    increase: false,
  });
  const increaseRef = useRef<HTMLButtonElement>(null);
  const decreaseRef = useRef<HTMLButtonElement>(null);
  const [tooltipPos, setTooltipPos] = useState({
    increase: { left: 0, top: 0 },
    decrease: { left: 0, top: 0 },
  });

  const formatValue = (val: number) =>
    Number.isInteger(val) ? String(val) : val.toFixed(1);

  const clampValue = (val: number) => {
    if (val < 0) return 0;
    if (unit === "percent" && val > 100) return lastValidValue;
    return val;
  };

  const updateValue = (newValue: number) => {
    const clamped = clampValue(newValue);
    if (unit === "percent" && clamped >= 0 && clamped <= 100) {
      setLastValidValue(clamped);
    }
    setValue(clamped);
    setInputValue(formatValue(clamped));
  };

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    if (newUnit === "percent" && value > 100) {
      updateValue(100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(",", ".");
    setInputValue(val);
  };

  const handleInputBlur = () => {
    let input = inputValue.trim();
    if (!input) {
      updateValue(0);
      return;
    }
    input = input.replace(",", ".");
    const match = input.match(/-?\d+(\.\d+)?/);
    const cleanValue = match ? parseFloat(match[0]) : 0;
    updateValue(cleanValue);
  };

  const handleStepper = (delta: number) => {
    const currentValue = parseFloat(inputValue) || 0;
    updateValue(currentValue + delta);
  };

  const handleMouseEnter = (action: "increase" | "decrease") => {
    const ref = action === "increase" ? increaseRef : decreaseRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipPos((prev) => ({
        ...prev,
        [action]: { left: rect.left + rect.width / 2, top: rect.top - 38 },
      }));
    }
    setShowTooltip((prev) => ({ ...prev, [action]: true }));
  };

  const handleMouseLeave = (action: "increase" | "decrease") => {
    setShowTooltip((prev) => ({ ...prev, [action]: false }));
  };

  const isDecreaseDisabled = value === 0;
  const isIncreaseDisabled = unit === "percent" && value === 100;

  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="bg-neutral-800 p-6 rounded-xl w-[280px] text-white space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#AAAAAA]">Unit</span>
          <div className="flex flex-row items-start p-0.5 gap-0.5 w-[140px] h-9 bg-neutral-900 rounded-lg">
            <button
              onClick={() => handleUnitChange("percent")}
              className={`flex flex-row justify-center items-center w-[67px] h-8 rounded-md border-none cursor-pointer font-medium text-xs leading-5 text-center transition-all duration-200 ${
                unit === "percent"
                  ? "bg-[#424242] text-[#F9F9F9]"
                  : "bg-transparent text-[#AAAAAA]"
              }`}
            >
              %
            </button>
            <button
              onClick={() => handleUnitChange("px")}
              className={`flex flex-row justify-center items-center w-[67px] h-8 rounded-md border-none cursor-pointer font-medium text-xs leading-5 text-center transition-all duration-200 ${
                unit === "px"
                  ? "bg-[#424242] text-[#F9F9F9]"
                  : "bg-transparent text-[#AAAAAA]"
              }`}
            >
              px
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-[#AAAAAA]">Value</span>
          <div className="flex flex-row items-center w-[140px] h-9 bg-neutral-900 rounded-lg border border-transparent focus-within:border-[#3C67FF] focus-within:shadow-[0_0_0_1px_#3C67FF] transition-all duration-200 overflow-hidden relative">
            <div
              className="flex flex-col items-center h-9 flex-[0_0_36px]"
              onMouseEnter={() => handleMouseEnter("decrease")}
              onMouseLeave={() => handleMouseLeave("decrease")}
            >
              <button
                ref={decreaseRef}
                onClick={() => handleStepper(-0.1)}
                disabled={isDecreaseDisabled}
                className={`flex justify-center items-center w-9 h-9 bg-neutral-900
                  text-white text-[20px] transition-colors duration-200
                  hover:bg-neutral-700 disabled:opacity-50
                  ${isDecreaseDisabled ? "cursor-default" : "cursor-pointer"}`}
              >
                −
              </button>

              {showTooltip.decrease && (
                <div
                  className="flex flex-col items-center fixed z-[1000] pointer-events-none"
                  style={{
                    left: tooltipPos.decrease.left,
                    top: tooltipPos.decrease.top,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="px-2 py-1 min-w-[176px] h-[26px] bg-neutral-900 rounded-lg text-xs">
                    Value must greater than 0
                  </div>
                  <div
                    className="w-2 h-1 bg-neutral-900 absolute -bottom-1 left-1/2 -translate-x-1/2"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                </div>
              )}
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="flex flex-row justify-center items-center px-2 w-[68px] h-9 bg-neutral-900 border-none outline-none text-white font-normal text-xs leading-5 text-center transition-colors duration-200 hover:bg-neutral-700"
            />
            <div
              className="static flex flex-col items-center h-9 flex-[0_0_36px]"
              onMouseEnter={() => handleMouseEnter("increase")}
              onMouseLeave={() => handleMouseLeave("increase")}
            >
              <button
                ref={increaseRef}
                onClick={() => handleStepper(0.1)}
                disabled={isIncreaseDisabled}
                className={`flex flex-row justify-center items-center w-9 h-9
                  bg-neutral-900 border-none text-white text-[20px]
                  transition-colors duration-200 relative z-[1]
                  hover:bg-neutral-700 disabled:opacity-50
                  ${isIncreaseDisabled ? "cursor-default" : "cursor-pointer"}`}
              >
                +
              </button>

              {showTooltip.increase && (
                <div
                  className="flex flex-col justify-end items-center fixed w-auto min-w-[176px]
                    bg-transparent z-[1000] pointer-events-none"
                  style={{
                    left: `${tooltipPos.increase.left}px`,
                    top: `${tooltipPos.increase.top}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="flex flex-row items-center justify-center px-2 py-1
                      min-w-[176px] h-[26px] bg-neutral-900 rounded-lg
                      text-white font-normal text-xs leading-5 text-center whitespace-nowrap"
                  >
                    Value must smaller than 100
                  </div>

                  <div
                    className="w-2 h-1 bg-neutral-900 absolute -bottom-1 left-1/2 -translate-x-1/2"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
