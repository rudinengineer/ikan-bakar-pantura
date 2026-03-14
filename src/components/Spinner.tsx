import React from "react";

type Props = {
  color?: "primary" | "dark" | "light";
  size?: "sm" | "md" | "lg";
};

const colors = {
  primary: "border-primary",
  dark: "border-dark",
  light: "border-white",
};

const sizes = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

export default function Spinner({ color, size }: Props) {
  return (
    <div role="status" className="inline-block">
      <div
        className={`${color ? colors[color] : "border-white"} ${size ? sizes[size] : "size-5"} border-[3px] border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
