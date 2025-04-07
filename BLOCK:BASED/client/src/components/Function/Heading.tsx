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
  )}`;
  const tag = React.createElement(`h${data.level}`, {
    dangerouslySetInnerHTML: { __html: data.content },
    className: `font-heading block my-5 ${stylesClasses} ${getTextColorClass(
      data.textColor
    )}`,
  });

  return tag;
}

export default Heading;
