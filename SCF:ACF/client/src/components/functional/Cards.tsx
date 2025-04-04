import WPColumn from "../ui/WPColumn";
import WPContainer from "../ui/WPContainer";
import WPRow from "../ui/WPRow";
import Card from "./Card";

type CardsProps = {
  enableCarousel?: boolean;
  cards: {
    headline: string;
    cardContent: {
      heading: string;
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
      content: string;
    }[];
  };
};

function Cards({ cards, enableCarousel = false }: CardsProps) {
  return (
    <WPContainer>
      <WPRow defaultPadding>
        <WPColumn className="wp-col-12 md:wp-col-6 justify-center">
          <h1 className="wp-cards-h1">{cards.headline}</h1>
          {enableCarousel ? (
            "Enabled"
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.cardContent.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </div>
          )}
        </WPColumn>
      </WPRow>
    </WPContainer>
  );
}

export default Cards;
