import {
  getRelativePath,
  getTextAlignClass,
  getTextColorClass,
} from "@/utils/helpers";
import { attrs } from "@/utils/types";
import React from "react";

function Paragraph({ data }: { data: attrs }) {
  const textColorMeta = data.textColor || data.style?.color?.text;
  const stylesClasses = `${getTextAlignClass(data.textAlign)}`;
  return (
    <p
      className={`font-body block ${stylesClasses} ${getTextColorClass(
        textColorMeta
      )}`}
      dangerouslySetInnerHTML={{ __html: getRelativePath(data.content) || "" }}
    />
  );
}

export default Paragraph;
