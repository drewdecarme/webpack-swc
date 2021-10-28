import React from "react";

import { Button } from "./Button";

export default {
  title: "Components / Button",
};

export const Primary = () => {
  return <Button>test button</Button>;
};
export const Secondary = () => {
  return <Button variant="secondary">test button</Button>;
};
