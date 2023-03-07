import "./Single.Card.css";
import React from "react";

function SingleCard({ card, handelChoice, flipped }) {
  const handleClick = () => {
    handelChoice(card);
  };
  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img src={card.src} alt="front card" className="front" />
        <img
          src="./img/cover.png"
          alt="back card"
          className="back"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default SingleCard;
