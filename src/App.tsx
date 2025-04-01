import React from "react";
import "./App.css";

interface KeyLog {
  value: string;
  index: number;
  key: string;
}

function App() {
  const [history, setHistory] = React.useState<KeyLog[]>(
    Array.from(Array(6).keys()).map((e) => ({ value: "", index: e, key: "" }))
  );
  const [activeInput, setActiveInput] = React.useState(0);
  const [otp, setOtp] = React.useState(Array(6).fill(""));
  const [keyDown, setKeyDown] = React.useState("");
  const [log, setLog] = React.useState("");

  const otpLength = React.useMemo(() => otp.length, [otp]);

  // Reference to input elements to manage focus between inputs
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(otpLength).fill(null)
  );

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isInputValueValid = (value: string) => {
    return /^\d+$/.test(value);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    console.log("onchange");
    const otpIndexValue = otp[index];

    const nativeEvent = event.nativeEvent as InputEvent;

    const nativeData = nativeEvent.data;
    const targetValue = event.target.value;

    let value = "";

    if (nativeData) {
      if (!isInputValueValid(nativeData)) return;
      value = nativeData;
    } else {
      if (!isInputValueValid(targetValue)) return;
      value = targetValue;

      const length = value.length;
      if (length > 1) {
        const arr = value.split("");
        const diff = arr.filter((char) => !otpIndexValue.includes(char));
        value = diff.join("");
      }
    }

    setLog(`${log} |------| ${index} key ${keyDown} value ${value}`);

    let new_history = history;
    const auto_fill =
      new_history.find((e) => e.index === 0)?.key !== "Unidentified" &&
      keyDown === "Unidentified";
    if (auto_fill) {
      new_history = new_history.map((e) =>
        e.index === 0 ? { ...e, value, key: keyDown } : e
      );
    } else {
      new_history = new_history.map((e) =>
        e.index === index ? { ...e, value, key: keyDown } : e
      );
    }

    setHistory(new_history);

    if (value.length === 1) {
      const newOtp = [...otp];
      if (auto_fill) {
        newOtp[0] = value;
      } else {
        newOtp[index] = value;
      }
      setOtp(newOtp);

      if (auto_fill) return inputFocus(1);
      if (index < otpLength - 1) {
        return inputRefs.current[index + 1]?.focus();
      }
    } else {
      const newOtp = [...otp];
      let newIndex = index;
      for (let i = 0; i < otp.length; i++) {
        if (value[i]) {
          newOtp[i] = value[i];
          newIndex = i;
        } else {
          newOtp[i] = "";
        }
      }

      setOtp(newOtp);

      if (newIndex < otp.length - 1) {
        return inputFocus(newIndex + 1);
      } else {
        return inputRefs.current[index]?.blur();
      }
    }
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    console.log("onkeydown");
    // setKeyDown(
    //   `${keyDown} |------| ${index} : code ${event.code}, key ${event.key} type ${event.type}`
    // );
    const newOtp = [...otp];
    setKeyDown(event.key);
    if ([event.code, event.key].includes("Backspace")) {
      event.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      inputFocus(activeInput - 1);
    } else if (event.code === "Delete") {
      event.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      inputFocus(activeInput - 1);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      inputFocus(activeInput + 1);
    }
    // React does not trigger onChange when the same value is entered
    // again. So we need to focus the next input manually in this case.
    else if (event.key === newOtp[activeInput]) {
      event.preventDefault();
      inputFocus(activeInput + 1);
    } else if (
      event.code === "Space" ||
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      event.preventDefault();
    }
  };

  const onFocus = (index: number) => {
    setActiveInput(index);
  };

  const inputFocus = (index: number) => {
    inputRefs.current[index]?.focus();
    setActiveInput(index);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-[21.125rem] flex justify-between [&>input]:shadow [&>input]:drop-shadow-md [&>input]:border-0 [&>input]:border-b-2 [&>input]:border-[transparent] [&>input]:rounded-md">
        {otp.map((digit, index) => (
          <input
            id={`input-otp${index + 1}`}
            key={index}
            type="number"
            inputMode="numeric"
            pattern="\d{1}"
            maxLength={1}
            value={digit}
            onKeyDown={(event) => onKeyDown(event, index)}
            onChange={(event) => onChange(event, index)}
            onFocus={() => onFocus(index)}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            className="w-[2.875rem] h-[2.875rem] rounded-md bg-base-white text-center text-h1-500 font-kanit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            autoComplete={!index ? "one-time-code" : "off"}
          />
        ))}
      </div>

      <div className="mt-6">OTP: {otp}</div>
      <div className="mt-6">
        Log:{" "}
        {log.split("|------|").map((e, i) => (
          <p key={e + i}>{e}</p>
        ))}
      </div>
      <div className="mt-6">KeyDown: {keyDown}</div>
      <div className="mt-6">History: {JSON.stringify(history)}</div>
    </div>
  );
}

export default App;
