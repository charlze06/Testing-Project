import { useState } from 'react'
import { questions } from './data/questions'
import './App.css'

const categories = [
  {
    id: 'Tayo',
    name: 'Tayo Langs',
    iconBg: '#facc15',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M13 2L4.5 12.5a1 1 0 0 0 .7 1.7H11v7.8a1 1 0 0 0 1.7.7L22 13V2H13Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: 'geography',
    name: 'Geography',
    iconBg: '#2dd4bf',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="2" />
        <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'general',
    name: 'General Knowledge',
    iconBg: '#fb7185',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M9 4a3 3 0 0 0-3 3v1H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a3 3 0 0 0-3-3H9Zm0 2h6a1 1 0 0 1 1 1v1H8V7a1 1 0 0 1 1-1Z"
          fill="currentColor"
        />
        <circle cx="8.5" cy="13.5" r="1.2" fill="#fff" />
        <circle cx="15.5" cy="13.5" r="1.2" fill="#fff" />
        <path d="M10 17c.8 1 3.2 1 4 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
]

function getCategoryName(categoryId) {
  return categories.find((category) => category.id === categoryId)?.name ?? 'Quiz'
}

function StatusIcon({ type }) {
  return (
    <span className={`status-icon status-icon-${type}`} aria-hidden="true">
      {type === 'correct' ? (
        <svg viewBox="0 0 24 24">
          <path d="M7 12.5 10.5 16 17 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

function App() {
  const [screen, setScreen] = useState('landing')
  const [selectedCategory, setSelectedCategory] = useState('science')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answers, setAnswers] = useState([])

  const quizQuestions = questions[selectedCategory]
  const activeQuestion = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1
  const isCorrect = selectedAnswer === activeQuestion?.answer
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  function startQuiz() {
    setScreen('quiz')
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setHasAnswered(false)
    setAnswers([])
  }

  function handleAnswer(index) {
    if (hasAnswered) return

    setSelectedAnswer(index)
    setHasAnswered(true)
  }

  function handleNext() {
    if (selectedAnswer === null || !hasAnswered) return

    const updatedAnswers = [...answers, selectedAnswer]
    setAnswers(updatedAnswers)

    if (isLastQuestion) {
      setScreen('results')
      return
    }

    setCurrentQuestion((index) => index + 1)
    setSelectedAnswer(null)
    setHasAnswered(false)
  }

  function restartQuiz() {
    setScreen('landing')
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setHasAnswered(false)
    setAnswers([])
  }

  function getOptionClass(index) {
    if (!hasAnswered) {
      return selectedAnswer === index ? ' selected' : ''
    }

    if (index === activeQuestion.answer) return ' correct'
    if (index === selectedAnswer) return ' wrong'
    return ''
  }

  const score = answers.reduce((total, answer, index) => {
    return total + (answer === quizQuestions[index].answer ? 1 : 0)
  }, 0)

  if (screen === 'quiz') {
    const correctAnswerText = activeQuestion.options[activeQuestion.answer]

    return (
      <main className="quiz">
        <header className="quiz-header">
          <p className="quiz-category">{getCategoryName(selectedCategory)}</p>
          <p className="quiz-count">
            {currentQuestion + 1} / {quizQuestions.length}
          </p>
        </header>

        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <section className="question-box">
          <h2>{activeQuestion.question}</h2>
        </section>

        <div className="options" role="radiogroup" aria-label="Answer choices">
          {activeQuestion.options.map((option, index) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selectedAnswer === index}
              disabled={hasAnswered}
              className={`option${getOptionClass(index)}`}
              onClick={() => handleAnswer(index)}
            >
              <span className="option-label">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {hasAnswered && index === activeQuestion.answer && <StatusIcon type="correct" />}
              {hasAnswered && index === selectedAnswer && index !== activeQuestion.answer && (
                <StatusIcon type="wrong" />
              )}
            </button>
          ))}
        </div>

        {hasAnswered && (
          <div className={`feedback-banner${isCorrect ? ' correct' : ' wrong'}`} role="status">
            <StatusIcon type={isCorrect ? 'correct' : 'wrong'} />
            <p>
              {isCorrect
                ? 'Correct!'
                : `Incorrect. The answer was '${correctAnswerText}'.`}
            </p>
          </div>
        )}

        {hasAnswered && (
          <button type="button" className="next-button" onClick={handleNext}>
            {isLastQuestion ? 'See results' : 'Next question'} <span aria-hidden="true">→</span>
          </button>
        )}
      </main>
    )
  }

  if (screen === 'results') {
    return (
      <main className="results">
        <header className="hero">
          <p className="eyebrow">Quiz complete</p>
          <h1>
            You scored <span>{score}</span>
          </h1>
          <p className="subtitle">
            {score} out of {quizQuestions.length} correct in {getCategoryName(selectedCategory)}.
          </p>
        </header>

        <section className="results-summary">
          {quizQuestions.map((item, index) => {
            const userAnswer = answers[index]
            const isCorrect = userAnswer === item.answer

            return (
              <article key={item.question} className={`result-item${isCorrect ? ' correct' : ' wrong'}`}>
                <p className="result-question">
                  {index + 1}. {item.question}
                </p>
                <p className="result-answer">
                  Your answer: {item.options[userAnswer]}
                </p>
                {!isCorrect && (
                  <p className="result-correct">
                    Correct answer: {item.options[item.answer]}
                  </p>
                )}
              </article>
            )
          })}
        </section>

        <button type="button" className="start-button" onClick={restartQuiz}>
          Play again <span aria-hidden="true">→</span>
        </button>
      </main>
    )
  }

  return (
    <main className="landing">
      <header className="hero">
        <p className="eyebrow">Test your knowledge</p>
        <h1>
          Brain <span>Quiz</span>
        </h1>
        <p className="subtitle">
          5 questions. No lifelines. Pure brainpower. Pick a category and find out what you
          really know.
        </p>
      </header>

      <section className="categories" aria-labelledby="category-heading">
        <h2 id="category-heading">Choose category</h2>
        <div className="category-grid" role="radiogroup" aria-label="Quiz category">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={selectedCategory === category.id}
              className={`category-card${selectedCategory === category.id ? ' selected' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon" style={{ backgroundColor: category.iconBg }}>
                {category.icon}
              </span>
              <span className="category-name">{category.name}</span>
              <span className="category-meta">{questions[category.id].length} questions</span>
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="start-button" onClick={startQuiz}>
        Start quiz <span aria-hidden="true">→</span>
      </button>
    </main>
  )
}

export default App
