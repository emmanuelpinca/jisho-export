import { type ReactNode } from "react";

const Button = (props: { onClick: () => void; children?: ReactNode }) => {
  return (
    <div
      className={[
        "w-full h-fit p-1 hover:cursor-pointer",
        "text-sm text-secondary border rounded-md",
        "flex flex-row items-center justify-center space-x-1",
        "hover:text-primary",
      ].join(" ")}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default Button;
