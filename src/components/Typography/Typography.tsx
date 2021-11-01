import clsx from "clsx";
import React from "react";

import { default as TypographyStyle } from "./Typography.scss";

const variantMapping = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
}

export type TypographyProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2";
    color?: "primary" | "secondary" | "error";
}

export const Typography = React.forwardRef<HTMLDivElement, TypographyProps>(
    function Typography (
        { variant = "body1", color: color = "primary", className, children, ...props}, 
        ref
    ) {
        const Foo = variant ? variantMapping[variant] : "p";
        return (
            <Foo
                ref={ref}
                className={clsx(className, {
                    [TypographyStyle.h1]: variant === "h1",
                    [TypographyStyle.h2]: variant === "h2",
                }, {
                    [TypographyStyle.primary]: color === "primary",
                    [TypographyStyle.secondary]: color === "secondary",
                    [TypographyStyle.error]: color === "error",
                })}
                {...props}
                >
                {children}
            </Foo>
        );
    }) 