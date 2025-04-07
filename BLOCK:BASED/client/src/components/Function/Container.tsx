function Container({
  defaultPadding = false,
  fluid = false,
  children,
  className = "",
}: {
  defaultPadding?: boolean;
  fluid?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative ${!fluid ? "container" : ""} ${
        defaultPadding ? " pt-20 pb-20" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Container;
