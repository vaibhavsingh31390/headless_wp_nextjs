import { Block } from "@/utils/types";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import Cover from "./Cover";
import CtaButton from "./CtaButton";
import Columns from "./Columns";
import Column from "./Column";
import ImageRender from "./Image";
import Container from "./Container";

function BlockRenderer({
  blocks,
  container,
}: {
  blocks: Block[];
  container: boolean;
}) {
  if (blocks?.length === 0) return null;
  return blocks.map((block) => {
    const blockComponent = (() => {
      switch (block.name) {
        case "core/heading":
          return <Heading key={block.id} data={block.attributes} />;
        case "core/paragraph":
          return <Paragraph key={block.id} data={block.attributes} />;
        case "core/cover":
          return (
            <Cover key={block.id} data={block.attributes}>
              {block.innerBlocks && (
                <BlockRenderer
                  container={container}
                  blocks={block.innerBlocks}
                />
              )}
            </Cover>
          );
        case "acf/ctabutton":
          return (
            <CtaButton
              className="mt-12"
              key={block.id}
              ctaData={block.attributes.data}
            />
          );
        case "core/columns":
          return (
            <Columns
              key={block.id}
              isStackedOnMobile={block.attributes.isStackedOnMobile || false}
            >
              {block.innerBlocks && (
                <BlockRenderer
                  container={container}
                  blocks={block.innerBlocks}
                />
              )}
            </Columns>
          );
        case "core/column":
          return (
            <Column
              key={block.id}
              width={
                block.attributes?.width ? `${block.attributes.width}%` : "50%"
              }
            >
              {block.innerBlocks && (
                <BlockRenderer
                  container={container}
                  blocks={block.innerBlocks}
                />
              )}
            </Column>
          );
        case "core/image":
          return (
            <ImageRender
              key={block.id}
              imageData={block.attributes}
              className=""
            />
          );
        default:
          return null;
      }
    })();

    return container ? (
      <Container key={block.id}>{blockComponent}</Container>
    ) : (
      blockComponent
    );
  });
}

export default BlockRenderer;
