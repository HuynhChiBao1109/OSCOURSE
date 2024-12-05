import React, { useState } from 'react';
import { Button, Typography, message } from 'antd';
import styles from './Quiz.module.css';

const { Title } = Typography;

const questions = [
  {
    question: 'BEM là viết tắt của?',
    options: ['Block Element Modifier', 'Block Equation Multiple', 'Block Element Multiple', 'Berlin Element Modifier'],
    answer: 'Block Element Modifier'
  },
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    message.success('Trả lời thành công')
  };

  return (
    <div className={styles.container}>
     <div><Title level={2}>Ôn tập BEM #1</Title>
      <div className={styles.questioncontainer}>
        <Title level={4}>{questions[currentQuestion].question}</Title>
        {questions[currentQuestion].options.map((option, index) => (
          <Button 
            key={index} 
            type="default" 
            onClick={() => handleAnswer(option)}
            style={{ margin: '5px',border: selectedAnswer === option ? "1px solid #1088ff" : ""  }}
          >
            {option}
          </Button>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end'}}><Button shape='round' size='large' type="primary" onClick={handleNextQuestion}>Trả Lời</Button></div></div>
    </div>
  );
}

export default Quiz;
