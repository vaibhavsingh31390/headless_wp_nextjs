import React from "react";
import "./WPRow.css";

interface WPRowProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  defaultPadding?: boolean;
  fullHeight?: boolean;
}

const WPRow: React.FC<WPRowProps> = ({
  children,
  className = "",
  fluid = false,
  defaultPadding = false,
  fullHeight = false,
}) => {
  const rowClasses = [
    "wp-row",
    className,
    fluid ? "wp-row-fluid" : "",
    defaultPadding ? "wp-row-padding" : "",
    fullHeight ? "wp-row-full-height" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={rowClasses}>{children}</div>;
};

export default WPRow;
