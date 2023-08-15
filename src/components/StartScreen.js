import "./StartScreen.css";

const StartScreen = ({ startGame }) => {
  return (
    <div className="start">
      <img src="/teste.svg" alt="Paisagem de um planalto ao pôr-do-sol" />
      <h1>Bem-Vindo ao Secret Word!</h1>
      <p>Clique no botão abaixo para começar a jogar</p>
      {/* Quando o usuário clicar no botão, ativa a função de mudar stage que chegou como prop */}
      <button onClick={startGame}>Começar o jogo</button>
    </div>
  );
};

export default StartScreen;
