import Container from "./Container";

function Columns({
  isStackedOnMobile,
  children,
}: {
  isStackedOnMobile: boolean;
  children: React.ReactNode;
}) {
  return (
    <Container defaultPadding>
      <div
        className={`mx-auto ${isStackedOnMobile ? "block md:flex" : "flex"}`}
      >
        {children}
      </div>
    </Container>
  );
}

export default Columns;
