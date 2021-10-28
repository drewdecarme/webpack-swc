import clsx from "clsx";
import React from "react";

import { default as ButtonStyle } from "./Button.scss";

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
        className={clsx(className, {
          [ButtonStyle.primary]: variant === "primary",
          [ButtonStyle.secondary]: variant === "secondary",
        })}
        {...restProps}
      >
        {children}
      </button>
    );
  }
);
