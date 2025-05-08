import React, { useEffect } from 'react'
import { usePersonality } from '../context/PersonalityContext'
import Question from '../components/Question'
import ProgressBar from '../components/ProgressBar'
import { useNavigate } from 'react-router-dom'

const Quiz = () => {
  const { currentQuestion, questions, handleAnswer, setCurrentQuestion } = usePersonality()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!questions || questions.length === 0) {
        navigate('/')
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [questions, navigate])

  const onAnswer = (score) => {
    handleAnswer(score)
    if (currentQuestion === questions.length - 1) {
      setTimeout(() => navigate('/results'), 80)
    }
  }

  
const goBack = () => {
  if (currentQuestion > 0) {
    setCurrentQuestion((prev) => prev - 1)
    setAnswers((prev) => prev.slice(0, -1))
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 text-lg">
        Loading quiz...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      <Question
        question={questions[currentQuestion]}
        onAnswer={onAnswer}
        onBack={goBack}
        showBack={currentQuestion > 0}
        isLastQuestion={currentQuestion === questions.length - 1}
        isFirstQuestion={currentQuestion === 0}
      />
    </div>
  )
}

export default Quiz


