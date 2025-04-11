function Column({
  children,
  width,
  className,
}: {
  children: React.ReactNode;
  width?: string;
  className?: string;
}) {
  const widthStyle = width
    ? {
        minWidth: width,
        flexGrow: 1,
      }
    : {
        flexGrow: 1,
        flexBasis: 0,
      };
  return (
    <div style={widthStyle} className={`px-2 ${className}`}>
      {children}
    </div>
  );
}

export default Column;
