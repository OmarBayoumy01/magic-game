import { useEffect, useState } from "react";
import "./App.css";

const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [bestScore, setBestScore] = useState(
    localStorage.getItem("bestScore") || 0
  );

  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setScore(0);
    setMoves(0);
    setTime(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const handleChoice = (card) => {
    if (!gameStarted) return;
    if (choiceOne && choiceTwo) return;
    if (choiceOne === card || choiceTwo === card) return;
    if (card.matched) return;

    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Move the resetTurn function before the useEffect that uses it
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setMoves((prev) => prev + 1);

      if (choiceOne.src === choiceTwo.src) {
        setScore((prevScore) => {
          const newScore = prevScore + 10;
          setCards((prevCards) => {
            const newCards = prevCards.map((card) => {
              if (card.src === choiceOne.src) {
                return { ...card, matched: true };
              }
              return card;
            });

            if (newCards.every((card) => card.matched)) {
              setGameWon(true);
              if (newScore > bestScore) {
                setBestScore(newScore);
                localStorage.setItem("bestScore", newScore);
              }
            }

            return newCards;
          });
          return newScore;
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo, bestScore]); // Added bestScore to dependencies

  // Start new game automatically on component mount
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="container">
      <div className="game-header">
        <h1 className="game-title">Magic Memory</h1>

        <div className="game-stats">
          <div className="stat-group">
            <span className="stat">Score: {score}</span>
            <span className="stat">Best: {bestScore}</span>
          </div>

          <button className="new-game-btn" onClick={shuffleCards}>
            New Game
          </button>

          <div className="stat-group">
            <span className="stat">Time: {formatTime(time)}</span>
            <span className="stat">Moves: {moves}</span>
          </div>
        </div>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <div
            className="card"
            key={card.id}
            onClick={() => handleChoice(card)}
          >
            <div
              className={
                card === choiceOne || card === choiceTwo || card.matched
                  ? "flipped"
                  : ""
              }
            >
              <img className="front" src={card.src} alt="card front" />
              <img className="back" src="/img/cover.png" alt="cover" />
            </div>
          </div>
        ))}
      </div>

      {gameWon && (
        <div className="win-message">
          <h2>Congratulations! You Won! 🎉</h2>
          <p>
            Score: {score} | Time: {formatTime(time)} | Moves: {moves}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
