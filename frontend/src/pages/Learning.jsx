import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function LearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: questions[currentQuestionIndex].id,
        answer: userAnswer
      })
    });
    
    const result = await response.json();
    if (result.ok) {
      setShowHint(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setUserAnswer('');
      }
    } else {
      setShowHint(true);
    }
  };

  return (
    &lt;div className=&quot;p-8 max-w-2xl mx-auto&quot;&gt;
      &lt;div className=&quot;mb-8 flex items-center gap-4&quot;&gt;
        &lt;button 
          onClick={() => navigate('/')}
          className=&quot;px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300&quot;&gt;
          ← Back to Home
        &lt;/button&gt;
        &lt;h1 className=&quot;text-2xl font-bold text-blue-600&quot;&gt;{courseId}&lt;/h1&gt;
      &lt;/div&gt;

      {questions[currentQuestionIndex] &amp;&amp; (
        &lt;div className=&quot;bg-white p-6 rounded-xl shadow-md mb-8&quot;&gt;
          &lt;div className=&quot;mb-4 text-xl font-semibold&quot;&gt;
            {questions[currentQuestionIndex].body}
          &lt;/div&gt;
          &lt;form onSubmit={handleSubmit}&gt;
            &lt;input
              type=&quot;text&quot;
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className=&quot;border p-2 rounded w-full mb-4&quot;
              placeholder=&quot;Your answer...&quot;
            /&gt;
            &lt;button 
              type=&quot;submit&quot;
              className=&quot;px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600&quot;&gt;
              Submit Answer
            &lt;/button&gt;
          &lt;/form&gt;
          {showHint &amp;&amp; (
            &lt;div className=&quot;mt-4 p-4 bg-yellow-100 rounded border border-yellow-200&quot;&gt;
              &lt;p className=&quot;text-yellow-800&quot;&gt;Hint: Try breaking down the fractions!&lt;/p&gt;
            &lt;/div&gt;
          )}
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
}