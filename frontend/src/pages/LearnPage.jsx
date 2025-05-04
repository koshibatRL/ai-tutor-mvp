import { useState, useEffect } from 'react';

export default function LearnPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleSkip = () => {
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  return (
    <div>
      {questions.length > 0 ? (
        <div>
          <h1>{questions[currentIndex].body}</h1>
          <button onClick={handleSkip}>Skip</button>
        </div>
      ) : <p>Loading questions...</p>}
    </div>
  );
}