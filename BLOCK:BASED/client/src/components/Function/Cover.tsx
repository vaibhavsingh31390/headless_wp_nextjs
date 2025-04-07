import { attrs } from "@/utils/types";
import Image from "next/image";
import Container from "./Container";

function Cover({ data, children }: { data: attrs; children: React.ReactNode }) {
  return (
    <div className="h-screen bg-slate-800 relative min-h-[200px] flex justify-center items-center">
      {data.url && (
        <Image
          alt="cover"
          src={data.url}
          fill
          className="mix-blend-soft-light object-cover"
        ></Image>
      )}
      <Container>
        <div className="z-10">{children}</div>
      </Container>
    </div>
  );
}

export default Cover;
