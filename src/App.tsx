import React from "react";
import "./App.css";

function App() {
  const [otp, setOtp] = React.useState(Array(6).fill(""));

  const otpLength = React.useMemo(() => otp.length, [otp]);

  // Ref to focus the first input field
  const firstInputRef = React.useRef<HTMLInputElement | null>(null);

  // Reference to input elements to manage focus between inputs
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(otpLength).fill(null)
  );

  // Focus on the first input field when the component is mounted
  React.useEffect(() => {
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 0);
  }, []);

  React.useEffect(() => {
    if (otp.every((v) => v == "")) {
      firstInputRef.current?.focus();
    }
  }, [otp]);

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nativeEvent = event.nativeEvent as InputEvent;
    const inputType = nativeEvent.inputType;
    const value = nativeEvent.data;

    if (!/^\d+$/.test(value ?? "")) return;
    if (inputType === "insertFromPaste") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field
    if (index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Prevent the default behavior to replace the value as we are handling it
    event.preventDefault();
  };

  // Handle key down events
  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const key = event.key;

    // Handle backspace
    if (key === "Backspace") {
      // Clear the current input field
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Move focus to the previous input field if necessary
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const inputValue: string = event.clipboardData.getData("Text");
    if (!/^\d+$/.test(inputValue)) return;

    const value = inputValue.substring(0, otpLength - index);

    const newOtp = [...otp];
    for (let i = 0; i < value.length; i++) {
      newOtp[index + i] = value[i];
      inputRefs.current[index + i]?.focus();
    }
    setOtp(newOtp);
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
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onChange={(event) => handleChange(index, event)}
            ref={(ref) => {
              inputRefs.current[index] = ref;
              // Set the first input field reference
              if (index === 0) {
                firstInputRef.current = ref;
              }
            }}
            className="w-[2.875rem] h-[2.875rem] rounded-md bg-base-white text-center text-h1-500 font-kanit [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            autoComplete="off"
          />
        ))}
      </div>
      <div>{otp}</div>
    </div>
  );
}

export default App;
