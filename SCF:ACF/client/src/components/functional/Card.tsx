"use client";
import { useState } from "react";
import "./Card.css";

type Card = {
  heading: string;
  image: {
    node: {
      altText: string;
      mediaItemUrl: string;
    };
  };
  content: string;
};

export default function Card({ card }: { card: Card }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  const displayedText = isExpanded
    ? card.content
    : truncateText(card.content, 20);

  return (
    <div className="wp-card">
      <div className="wp-card-image-frame">
        <div
          className="wp-card-image"
          style={{
            backgroundImage: `url(${card.image.node.mediaItemUrl})`,
          }}
          role="img"
          aria-label={card.image.node.altText}
        ></div>
      </div>
      <div className="wp-card-content">
        <h3 className="wp-card-h3">{card.heading}</h3>
        <div
          className="wp-card-text"
          dangerouslySetInnerHTML={{ __html: displayedText }}
        />
        {card.content.split(" ").length > 20 && (
          <div className="read-more-button" onClick={toggleReadMore}>
            {isExpanded ? "Read Less" : "Read More"}
          </div>
        )}
      </div>
    </div>
  );
}
