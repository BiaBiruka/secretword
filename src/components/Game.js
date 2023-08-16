import "./Game.css";
import { useState, useRef } from "react";
const Game = ({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  // Mudar estado da letra do input
  const [letter, setLetter] = useState("");
  //Cria uma referência ao imput da letra
  const letterInputRef = useRef(null);

  // Fazer o submit da letra
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    setLetter(""); //Apaga a letra da caixinha de chute
    letterInputRef.current.focus(); //Foca no elemento referenciado (a caixa de adivinhar letra)
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação atual: {score}</span>
      </p>
      <h1>Adivinhe a palavra!</h1>
      <h3 className="tip">
        Categoria: <span>{pickedCategory}</span>
      </h3>
      <p>
        Você tem {guesses} {guesses === 1 ? "tentativa" : "tentativas"}
      </p>
      {/* Caixinhas com as letras */}
      <div className="wordContainer">
        {letters.map((letter, i) =>
          // Se a letra tiver sido adivinhada, exibe ela
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Adivinhe uma letra da palavra: </p>
        <form onSubmit={handleSubmit}>
          {/* O valor do input é o valor da letra naquele momento */}
          <input
            type="text"
            name="letter"
            maxLength="1"
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef} //Cria a referência a esse campo
            required
          />
          <button>Adivinhar</button>
        </form>
        <p>
          <b> Dica: </b> Lembre-se de acentuar as letras!
        </p>
      </div>

      {/* Letras incorretas */}
      <div className="wrongLetterContainers">
        <p>
          Letras utilizadas:
          {/* Exibe as letras erradas */}
          {wrongLetters.map((letter, i) => (
            <span key={i}> {letter},</span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Game;
