const Button = (props: { label: string; onClick: () => void }) => {
  return (
    <div
      className={[
        "w-full h-fit p-1 hover:cursor-pointer",
        "text-sm text-link underline",
        "flex flex-row items-center justify-center space-x-1",
        "hover:text-primary",
      ].join(" ")}
      onClick={props.onClick}
    >
      {props.label}
    </div>
  );
};

export default Button;
