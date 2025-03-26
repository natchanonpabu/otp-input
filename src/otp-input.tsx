import React from "react";

const OTPInput = ({
  otp,
  onchange,
  log,
  setLog,
}: {
  otp: string[];
  onchange: React.Dispatch<React.SetStateAction<string[]>>;
  log: string;
  setLog: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(otp.length).fill(null)
  );

  const valueItems = React.useMemo(() => {
    const items: Array<string> = [];

    for (let i = 0; i < otp.length; i++) {
      const char = otp[i];

      if (/^\d+$/.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }

    return items;
  }, [otp]);

  React.useEffect(() => {
    if (otp.every((item) => item === "")) {
      inputRefs.current[0]?.focus();
    }
  }, [inputRefs, otp]);

  const focusToNextInput = (index: number) => {
    inputRefs.current[index + 1]?.focus();
  };

  const focusToPrevInput = (index: number) => {
    inputRefs.current[index - 1]?.focus();
  };

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = e.target as HTMLInputElement;
    const nativeEvent = e.nativeEvent as InputEvent;
    let targetValue = nativeEvent.data ?? target.value;
    const isTargetValueDigit = /^\d+$/.test(targetValue);

    console.log("target", target.value);
    console.log("native", nativeEvent.data);

    setLog(
      log +
        ` ${index}) target.value is ${target.value}, targetValue is ${targetValue} | `
    );

    if (!isTargetValueDigit && targetValue !== "") {
      return;
    }

    // const nextInputEl = inputRefs.current[index + 1] as HTMLInputElement | null;

    // only delete digit if next input element has no value
    // if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
    //   return;
    // }

    targetValue = isTargetValueDigit ? targetValue : " ";

    const newValue = [...otp];

    if (targetValue.length === 1) {
      newValue[index] = targetValue;
      onchange(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(index);
    } else {
      for (let i = index; i < otp.length; i++) {
        if (targetValue[i - index]) newValue[i] = targetValue[i - index];
      }

      onchange(newValue);

      console.log("targetValue.length: ", targetValue.length, "index: ", index);

      if (targetValue.length + index < otp.length) {
        return focusToNextInput(targetValue.length + index);
      } else {
        target.blur();
      }
    }
  };

  const inputOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(index);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(index);
    }

    const targetValue = target.value;

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(1, targetValue.length);

    if (e.key !== "Backspace" || targetValue !== "") {
      return;
    }

    focusToPrevInput(index);
  };

  const inputOnFocus = (
    e: React.FocusEvent<HTMLInputElement>,
    index: number
  ) => {
    const { target } = e;

    // keep focusing back until previous input
    // element has value
    const prevInputEl = inputRefs.current[index - 1] as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }

    target.setSelectionRange(1, target.value.length);
  };

  return valueItems.map((item, index) => {
    return (
      <input
        type="text"
        inputMode="numeric"
        pattern="\d{1}"
        className="w-[2.875rem] h-[2.875rem] rounded-md bg-base-white text-center text-h1-500 font-kanit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        // maxLength={1}
        value={item}
        key={index}
        ref={(ref) => {
          inputRefs.current[index] = ref;
        }}
        onChange={(e) => inputOnChange(e, index)}
        onKeyDown={(e) => inputOnKeyDown(e, index)}
        onFocus={(e) => inputOnFocus(e, index)}
        autoComplete="one-time-code"
      />
    );
  });
};

export default OTPInput;
