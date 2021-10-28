import "./Button.css";

import clsx from "clsx";
import React from "react";

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "text";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", className, children, ...restProps },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={clsx(className, "htc_button", {
          "htc_button primary": variant === "primary",
          "htc_button secondary": variant === "secondary",
        })}
        {...restProps}
      >
        {children}
      </button>
    );
  }
);
