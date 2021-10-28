# React Component Library - Webpack & SWC

This is an example repository to display arguably the proper way to setup a ESModule React component library that is light weight, virtually dependency free and offers extremely fast builds.

  - [Type Safety](#type-safety)
  - [Flexible and Lightweight styling](#flexible-and-lightweight-styling)
    - [CSS Modules](#css-modules)
  - [Build Flexibility and Speed](#build-flexibility-and-speed)
    - [Webpack for flexibility](#webpack-for-flexibility)
      - [TS Transpilation & CSS Compilation](#ts-transpilation--css-compilation)
      - [Dependency Externalization](#dependency-externalization)
    - [`@swc/loader` for speed](#swcloader-for-speed)
  - [Package Weight & Native HTML node components](#package-weight--native-html-node-components)

## Type Safety

Inclusion of `tsconfig.json` that was created using `tsc init` is included to display some of the strict configurations needed to employ safe development practices.

## Flexible and Lightweight styling

Opted to use Sass and CSS instead of a CSS-in-JS library in order stay as close to the CSS spec as possible. Adding a CSS-in-JS solution adds a significant amount of JS package weight in the build. Utilizing CSS and CSS Variables allows us to keep uses classes
to keep the theme stored and parsed inside of the CSS engine and not the memory of the package.

Sass is used to make the following a little easier:

- Mixins for easy to use media queries
- Nesting (pretty critical if you want to write CSS fast)
- Mixins for including CSS variables `makeColor`, `makeRem`, etc...

Sass shouldn't be used for storing variables as we want to stick to CSS as much as possible.

### CSS Modules

CSS Modules are turned on in this project and can be used by importing the styles from the style sheet.

Refer to the below `<Button >` component.

```tsx
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
          [ButtonStyle.secondary]: variant === "secondary"
        })}
        {...restProps}
      >
        {children}
      </button>
    );
  }
);
```

The styles are imported from the Sass file that is stored next to the component in the filesystem and are then used as key indices. The final build will include references to those objects and replace the `classNames` with the hashed references that css modules creates.

## Build Flexibility and Speed

Since there are 2 needs of this build...

1. Create the ESM Bundle (minify, terse, etc...)
2. Create the Component Stylesheet

Webpack was the obvious choice to do that.

### Webpack for flexibility

#### TS Transpilation & CSS Compilation

We can create aa simple configuration to create the library and then extend that configuration to enable Sass and CSS Modules. We didn't have to sacrifice speed since we are using the `@swc/loader` from the `swc` project.

In addition to using that loader, we can also use the `MiniCssExtractPlugin` to extract all of our styles into one stylesheet.

Take a look at the snapshot of the config below to see the both points above in action

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: "swc-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: "compressed"
              }
            }
          }
        ],
        exclude: /node_modules/,
        sideEffects: true
      }
    ]
  }
};
```

#### Dependency Externalization

We also externalize all of our dependencies with Webpack. Essentially we tell webpack that we don't want to bundle our dependencies with this project and instead will require the consumers of the project to include our required dependencies in their `dependencies`. In order to do this we copy our `dependencies` into the `peerDependencies` in our `package.json`.

```json
{
  "dependencies": {
    "clsx": "^1.1.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "peerDependencies": {
    "clsx": "^1.1.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
```

Then we tell webpack that we don't need these packages with this webpack plugin

```js
const nodeExternals = require("webpack-node-externals");

module.exports = {
  // only bundle the code that you write
  // and not the other external dependencies
  // it will be up to the consume to download them
  externals: [nodeExternals()],
  externalsPresets: { node: true }
};
```

### `@swc/loader` for speed

Realizes extremely fast build speeds by using `@swc/loader` instead of using `ts-loader` or `babel-loader`. Transpilation of TS assets take a fraction fo the time.

```js
module.exports = {
  // other webpack options
  ...webpackConfigOptions,
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: "swc-loader"
      }
    ]
  }
};
```

## Package Weight & Native HTML node components

In order to keep it light we forgo the use of a lot of extraneous styling dependencies as well as opinionated state management systems. The goal of this repository is to keep the components as close to if not completely close to the DOM nodes that they represent.

```tsx
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
          [ButtonStyle.secondary]: variant === "secondary"
        })}
        {...restProps}
      >
        {children}
      </button>
    );
  }
);
```

If you consider the above `<Button >` component, you'll notice that the only props (at the moment) regulate and control the `classNames` of the `button` node. All other props are the possible attributes that could be utilized if you we're just to use the Button itself. In this case, the component library is used only as a proxy to control the style and maybe some of the markup of the design system.

Outside of that, using a component should be almost the same if not completely the same as using it's respective node. This keeps package weight **_EXTREMELY_** low.
