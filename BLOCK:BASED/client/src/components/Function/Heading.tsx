import {
  getFontSizeClass,
  getTextAlignClass,
  getTextColorClass,
} from "@/utils/helpers";
import { attrs } from "@/utils/types";
import React from "react";

function Heading({ data }: { data: attrs }) {
  const stylesClasses = `${getFontSizeClass(data.level)} ${getTextAlignClass(
    data.textAlign
  )} ${getTextColorClass(data.textColor)}`;
  const tag = React.createElement(`h${data.level}`, {
    dangerouslySetInnerHTML: { __html: data.content },
    className: `font-heading block my-5 ${stylesClasses.trim()} `,
  });

  return tag;
}

export default Heading;
