import { getRelativePath } from "@/utils/helpers";
import Link from "next/link";

function CtaButton({
  ctaData,
  className = "",
}: {
  ctaData?: {
    label?: string;
    destination?: string;
    alignment?: string;
  };
  className: string;
}) {
  const alignMap = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };
  const alignment = (ctaData?.alignment || "left") as keyof typeof alignMap;
  return (
    <div className={`${alignMap[alignment]} ${className || ""}`}>
      <Link
        href={getRelativePath(ctaData?.destination) || "/"}
        className="px-7 py-3 uppercase rounded-md font-bold button-with-transition-2 inline-block"
      >
        {ctaData?.label || ""}
      </Link>
    </div>
  );
}

export default CtaButton;
