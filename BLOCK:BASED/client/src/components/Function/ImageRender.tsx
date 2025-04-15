import { attrs } from "@/utils/types";
import Image from "next/image";

function ImageRender({
  imageData,
  className = "",
}: {
  imageData?: attrs;
  className: string;
}) {
  return (
    <>
      <Image
        src={imageData?.url || ""}
        alt={imageData?.linkDestination || ""}
        height={imageData?.height}
        width={imageData?.width}
      ></Image>
    </>
  );
}

export default ImageRender;
