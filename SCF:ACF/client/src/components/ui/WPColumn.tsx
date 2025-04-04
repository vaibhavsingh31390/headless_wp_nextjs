import "./WPColumn.css";

interface WPColumnProps {
  children: React.ReactNode;
  className?: string;
}

const WPColumn: React.FC<WPColumnProps> = ({ children, className = "" }) => {
  return <div className={`wp-column ${className}`}>{children}</div>;
};

export default WPColumn;
