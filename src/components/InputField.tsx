import React, { forwardRef, useId, useMemo, useRef, useState } from "react";

export type InputVariant = "outlined" | "filled" | "ghost";
export type InputSize = "sm" | "md" | "lg";

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  invalid?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  isLoading?: boolean;
  clearable?: boolean;          // shows a clear (×) button when there is a value
  passwordToggle?: boolean;     // show eye toggle when type="password"
  leftIcon?: React.ReactNode;   // optional leading icon/slot
  rightIcon?: React.ReactNode;  // optional trailing icon/slot
  inputClassName?: string;      // extra classes for the <input>
  containerClassName?: string;  // extra classes for the outer wrapper
}

/**
 * Accessible, themeable Input component with variants, sizes, states,
 * clear button, and optional password toggle. TailwindCSS-based.
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      helperText,
      errorMessage,
      invalid = false,
      variant = "outlined",
      size = "md",
      isLoading = false,
      clearable = false,
      passwordToggle = true,
      type = "text",
      disabled,
      leftIcon,
      rightIcon,
      className, // from HTMLAttributes (applies to wrapper in our case)
      inputClassName,
      containerClassName,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? `input-${generatedId}`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    // controlled/uncontrolled support (for clear button)
    const isControlled = value !== undefined;
    const [inner, setInner] = useState<string>(
      (defaultValue as string) ?? ""
    );
    const currentValue: string = isControlled ? (value as string) ?? "" : inner;

    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const sizeBase = {
      sm: "h-9 text-sm",
      md: "h-10 text-base",
      lg: "h-12 text-base",
    }[size];

    // paddings adjust if we render left/right adornments
    const leftPad = leftIcon ? "pl-10" : "pl-3.5";
    const hasRightAffordances =
      !!rightIcon || isLoading || (clearable && !!currentValue) || (passwordToggle && type === "password");

    const rightPad = hasRightAffordances ? "pr-10" : "pr-3.5";

    const variantCls = {
      outlined:
        "bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-blue-500/50",
      filled:
        "bg-gray-100 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 rounded-md dark:bg-gray-800 dark:focus:ring-blue-500/50",
      ghost:
        "bg-transparent border-b border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 dark:border-gray-600",
    }[variant];

    const invalidCls = invalid
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
      : "";

    const disabledCls = disabled ? "opacity-60 cursor-not-allowed" : "";

    const baseInputCls =
      "w-full text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors";


    const inputClasses = [
      baseInputCls,
      sizeBase,
      leftPad,
      rightPad,
      variantCls,
      invalidCls,
      disabledCls,
      inputClassName,
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInner(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (disabled) return;
      if (isControlled) {
        // best-effort notify parent to clear
        const synthetic = {
          ...new Event("input", { bubbles: true }),
          target: { value: "" },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange?.(synthetic);
      } else {
        setInner("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
      // Restore focus
      inputRef.current?.focus();
    };

    const [showPassword, setShowPassword] = useState(false);
    const effectiveType =
      type === "password" && showPassword ? "text" : type;

    const describedBy = useMemo(() => {
      const ids = [];
      if (helperText && !invalid) ids.push(helpId);
      if (invalid && errorMessage) ids.push(errorId);
      return ids.join(" ") || undefined;
    }, [helperText, invalid, errorMessage, helpId, errorId]);

    return (
      <div className={["w-full", className, containerClassName].filter(Boolean).join(" ")}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left adornment */}
          {leftIcon && (
            <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={mergedRef}
            type={effectiveType}
            value={isControlled ? value : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            onChange={handleChange}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            className={inputClasses}
            {...rest}
          />

          {/* Right adornments group (stacked in a row) */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1">
            {rightIcon && (
              <span className="text-gray-500 pointer-events-auto">{rightIcon}</span>
            )}
            {isLoading && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
              />
            )}
          </div>

          {/* Action buttons (clear / password toggle) */}
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            {clearable && !!currentValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-500 hover:text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label="Clear input"
              >
                {/* × icon */}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {passwordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {/* eye / eye-off icon */}
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l18 18" strokeLinecap="round" />
                    <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 4.24A10.94 10.94 0 0121 12a10.94 10.94 0 01-2.09 3.13M6.1 6.1A10.94 10.94 0 003 12a10.94 10.94 0 005.88 4.88" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Helper / Error text */}
        {!invalid && helperText && (
          <p id={helpId} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
        {invalid && errorMessage && (
          <p id={errorId} className="mt-1 text-xs text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
