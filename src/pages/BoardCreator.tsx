type CategoryRow = {
  position: number;
  answer: string;
  count: number;
  score: string;
};

type AnswerRow = {
  position: number;
  answer: string;
  count: number;
};

const categoryData: CategoryRow[] = [
  {
    position: 1,
    answer: "Nintendo",
    count: 12,
    score: "85%",
  },
  {
    position: 1,
    answer: "Nintendo",
    count: 12,
    score: "85%",
  },
];

const answerData: AnswerRow[] = [
  {
    position: 1,
    answer: "Mario Kart",
    count: 9,
  },
  {
    position: 1,
    answer: "Mario Kart",
    count: 9,
  },
];

export default function BoardCreator() {
  return (
    <div className="board-creator">
      <div className="question-selector">
        <button className="arrow-button">←</button>

        <h2 className="question-number">Question #1</h2>

        <button className="arrow-button">→</button>
      </div>

      <p className="question-text">What is your favorite Nintendo franchise?</p>

      <div className="bottom-section">
        <div className="table-container">
          <div className="table-header">
            <span>position</span>
            <span>answer</span>
            <span>count</span>
            <span>score</span>
          </div>

          <div className="table-list">
            {categoryData.map((item) => (
              <div key={item.position} className="table-row">
                <span>{item.position}</span>

                <span className="answer-column">{item.answer}</span>

                <span>{item.count}</span>

                <span>{item.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-container">
          <div className="table-header answers-header">
            <span>position</span>
            <span>answer</span>
            <span>count</span>
          </div>

          <div className="table-list">
            {answerData.map((item) => (
              <div key={item.position} className="table-row answers-row">
                <span>{item.position}</span>

                <span className="answer-column">{item.answer}</span>

                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="start-game-button">Start Game</button>
    </div>
  );
}
