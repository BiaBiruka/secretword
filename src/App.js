// CSS
import "./App.css";

// Componentes
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

//React
import { useCallback, useEffect, useState } from "react";

//Dados
import { wordsList } from "./data/words";

// O jogo possui 3 estágios -> Tela inicial, o jogo, tela de game over
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 5;

function App() {
  //Define o useState p/ mudar estágios. O valor inicial é o estágio inicial (start)
  const [gameStage, setGameStage] = useState(stages[0].name);

  //Init no state das palavras
  const [words] = useState(wordsList);

  //State das palavras, categorias e letras (na letra usa array vazia pois cada letra é um termo da array)
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  //Letras adivinhadas, número de tentativas e pontuação
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  //Definição da resposta correta para exibir no game over
  const [answer, setAnswer] = useState("");

  // Escolha de palavra e categoria aleatória
  const pickWordAndCategory = useCallback(() => {
    //Escolha de categorias
    const categories = Object.keys(words); //As categorias são as "chaves identificadoras" das words do documento de respostas
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)]; //Vai de 0 até a quantidade de categorias. Usa o floor pra não ter número quebrado

    //Escolha de palavra -> Acessa a lista de palavras da categoria e escolhe um número aleatório
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word };
  }, [words]);

  //Escolher palavra e iniciar o jogo (mudar stage)
  //Precisamos usar o useCallBack para evitar problemas com o useEffect
  const startGame = useCallback(() => {
    //Limpa todas as letras usadas na palavra anterior
    clearLetterStates();

    // Pick word e Pick category
    //As variáveis word e category são o return da função
    const { category, word } = pickWordAndCategory();

    //Quebra a palavra em uma array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase()); //Converte todas as letras p/ caixa baixa

    //Preencher os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    //Inicia o jogo
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Processa a letra inserida e verifica se está certa ou errada
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //Checa se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //Aprovar a letra inserida ou remover uma chance
    if (letters.includes(normalizedLetter)) {
      // Pega as letras já adivinhadas e adiciona a nova
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      //Pega a lista de letras erradas e atualiza, tirando uma tentativa
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  //Reseta o jogo
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //Monita o campo de GUESSES toda vez que ele for alterado
  useEffect(() => {
    if (guesses === 0) {
      //Se tentativas chegar a 0, apaga todos os dados e vai para o game over
      setAnswer(pickedWord);
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses, pickedWord]);

  // Checa se o usuário acertou a palavra
  useEffect(() => {
    //Cria uma lista de letras de cada palavra sem repetí-las, pois caso contrário você precisaria inserir letras repetidas várias vezes para contar os pontos
    const uniqueLetters = [...new Set(letters)];

    //Se o tamanho da listra de letras corretas adivinhadas for igual ao da lista de letras da palavra, o jogador ganha pontos e recebe outra palavra
    if (
      guessedLetters.length === uniqueLetters.length &&
      gameStage === stages[1].name
    ) {
      setScore((actualScore) => (actualScore += 50));
      //Recebendo outra palavra a partir da função já criada
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // Volta para o início do jogo e define os pontos como 0 e tentativas como 3
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
    setAnswer("");
  };

  return (
    <div className="App">
      {/* Se o estágio for X, exibe o componente X, se for Y, exibe Y */}
      {/* Passa como prop a função de mudar stage, permitindo fazer o componente mudar para a próxima etapa */}
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && (
        <GameOver retry={retry} score={score} answer={answer} />
      )}
    </div>
  );
}

export default App;
