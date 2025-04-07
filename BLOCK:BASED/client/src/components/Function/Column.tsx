function Column({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: string;
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
    <div style={widthStyle} className="px-2">
      {children}
    </div>
  );
}

export default Column;
