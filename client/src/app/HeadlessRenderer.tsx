import Cards from "@/components/functional/Cards";
import Hero from "@/components/functional/Hero";
import React from "react";

const componentLib: Record<string, React.FC<any>> = {
  Hero,
  Cards,
};

const HeadlessRenderer = ({ components }: { components: any }) => {
  return (
    <>
      {components.map((component: any, index: number) => {
        const componentName = component.fieldGroupName
          .replace("AcfPagePageComponents", "")
          .replace("Layout", "");
        const Component = componentLib[componentName];
        return Component ? <Component key={index} {...component} /> : null;
      })}
    </>
  );
};

export default HeadlessRenderer;
