import BlockRenderer from "@/components/Function/BlockRenderer";
import requestGraphQl from "@/utils/graphQL/graphQLClient";
import { homePageQuery, processJsonForBlocks } from "@/utils/helpers";
import { NodeByUri } from "@/utils/types";

export default async function Home() {
  const data = await requestGraphQl<{
    nodeByUri: NodeByUri;
  }>(homePageQuery());
  return (
    <BlockRenderer
      container={data.nodeByUri?.container?.container || false}
      blocks={processJsonForBlocks(data.nodeByUri.blocks)}
    />
  );
}
