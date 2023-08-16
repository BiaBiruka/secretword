import "./GameOver.css";

const GameOver = ({ retry, score, answer }) => {
  return (
    <div className="gameOver">
      <h1>Fim de jogo!</h1>
      <h3>
        A resposta era <span> {answer} </span>
      </h3>
      <h2>
        Você fez<span> {score} </span>pontos
      </h2>

      <button onClick={retry}>Jogar de novo</button>
    </div>
  );
};

export default GameOver;
