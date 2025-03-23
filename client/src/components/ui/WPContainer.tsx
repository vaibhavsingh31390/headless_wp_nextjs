import "./WPContainer.css";

interface WPContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

function WPContainer({ children, fluid = false, className }: WPContainerProps) {
  return (
    <div
      className={`wp-container ${
        fluid ? "wp-container-fluid " : ""
      }${className}`}
    >
      {children}
    </div>
  );
}

export default WPContainer;
