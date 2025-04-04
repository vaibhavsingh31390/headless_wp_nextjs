import WPColumn from "../ui/WPColumn";
import WPContainer from "../ui/WPContainer";
import WPRow from "../ui/WPRow";
import "./Hero.css";
import Image from "next/image";

type HeroProps = {
  heroSection: {
    headline: string;
    promo: string;
    image: {
      node: {
        altText: string;
        mediaItemUrl: string;
        mediaDetails: {
          width: number;
          height: number;
        };
      };
    };
  };
};

function Hero({ heroSection }: HeroProps) {
  return (
    <WPContainer className="bg-white">
      <WPRow defaultPadding>
        <WPColumn className="wp-col-12 md:wp-col-6 justify-center">
          <h1 className="wp-hero-h1">{heroSection.headline}</h1>
          <div
            className="wp-hero-p"
            dangerouslySetInnerHTML={{ __html: heroSection.promo || "" }}
          ></div>
        </WPColumn>
        <WPColumn className="wp-col-12 md:wp-col-6">
          <Image
            className="wp-responsive-image shadow-xl rounded"
            src={heroSection.image.node.mediaItemUrl}
            width={heroSection.image.node.mediaDetails.width}
            height={heroSection.image.node.mediaDetails.height}
            alt={heroSection.image.node.altText}
          />
        </WPColumn>
      </WPRow>
    </WPContainer>
  );
}

export default Hero;
