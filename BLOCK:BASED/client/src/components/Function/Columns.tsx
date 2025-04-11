import Container from "./Container";

function Columns({
  isStackedOnMobile,
  children,
}: {
  isStackedOnMobile: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto ${isStackedOnMobile ? "block md:flex" : "flex"}`}>
      {children}
    </div>
  );
}

export default Columns;
