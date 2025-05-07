import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './index.css';

// ヘッダーコンポーネント
const Header = () => {
  return (
    <header className="bg-[#58cc02] text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">分数マスター</div>
        <nav className="flex space-x-6">
          <Link to="/" className="flex items-center text-white hover:opacity-80">
            <span className="mr-1">&#x2302;</span>
            <span>ホーム</span>
          </Link>
          <div className="flex items-center cursor-pointer hover:opacity-80">
            <span className="mr-1">&#x1F464;</span>
            <span>プロフィール</span>
          </div>
          <div className="flex items-center cursor-pointer hover:opacity-80">
            <span className="mr-1">&#x1F3C6;</span>
            <span>ミッション</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

// コース選択画面
const CoursesPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">学習コース</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 実際に機能するコース */}
        <Link to="/learn" className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
          <div className="h-40 bg-blue-500 flex items-center justify-center">
            <span className="text-white text-4xl">&#x1F4D2;</span>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">コース1: 分数の基礎</h2>
            <p className="text-gray-600">分数の足し算、引き算、掛け算、割り算を学びましょう。</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">5レッスン</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                初級
              </span>
            </div>
          </div>
        </Link>
        
        {/* 機能しないコース (ホバーのみ可能) */}
        {[
          { title: "コース2: 小数と分数", desc: "小数と分数の変換と計算を学びます。", color: "bg-purple-500", level: "中級" },
          { title: "コース3: 方程式", desc: "分数を含む方程式の解き方を学びます。", color: "bg-orange-500", level: "上級" },
        ].map((course, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 opacity-70 cursor-not-allowed">
            <div className={`h-40 ${course.color} flex items-center justify-center`}>
              <span className="text-white text-4xl">&#x1F512;</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600">{course.desc}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">準備中</span>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {course.level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 進捗バー */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">総合進捗</h3>
          <span className="text-sm text-gray-500">20%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-[#58cc02] h-4 rounded-full" style={{ width: '20%' }}></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">1日5問の問題を解いて、学習を続けましょう！</p>
      </div>
      
      {/* デイリーミッション */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-4">今日のミッション</h3>
        <div className="space-y-4">
          {['5問解く', '連続3日間学習する', '友達を招待する'].map((mission, index) => (
            <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-gray-600">{index + 1}</span>
              </div>
              <span>{mission}</span>
              <div className="ml-auto">
                <span className="text-gray-400">&#x2714;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// チャットメッセージコンポーネント
const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-xl p-3 ${isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              <span>&#x1F4A1;</span>
            </div>
            <span className="font-bold text-blue-700 text-sm">AIチューター</span>
          </div>
        )}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

// 学習画面 - 一問ずつ表示
const LearnPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // 問題データを取得
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/questions');
        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('問題データ取得エラー:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // チャットが更新されたらスクロール
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // 現在の問題
  const currentQuestion = questions[currentQuestionIndex];

  // 回答を送信する
  const submitAnswer = async () => {
    if (!userAnswer) return;

    try {
      const response = await fetch('http://localhost:8000/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentQuestion.id,
          answer: userAnswer,
        }),
      });

      const result = await response.json();
      setFeedback(result);

      if (result.ok) {
        // 正解の場合、次の問題へ
        setTimeout(() => {
          setFeedback(null);
          setUserAnswer('');
          setChatMode(false);
          setChatMessages([]);
          
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
          } else {
            // 全問題終了
            navigate('/complete');
          }
        }, 1500);
      } else {
        // 不正解の場合、チャットモードを有効化
        setChatMode(true);
        // 初期メッセージを追加
        setChatMessages([
          {
            text: `この問題「${currentQuestion.body}」の解き方を一緒に考えてみましょう。まず、どのような考え方をすればよいか理解していますか？`,
            isUser: false
          }
        ]);
        // ヒントがあれば表示
        if (result.hint) {
          setChatMessages(prev => [...prev, {
            text: `ヒント: ${result.hint}`,
            isUser: false
          }]);
        }
      }
    } catch (err) {
      console.error('回答送信エラー:', err);
      setFeedback({ ok: false, hint: 'サーバーエラーが発生しました' });
    }
  };

  // チャットメッセージを送信
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // ユーザーのメッセージを追加
    const newUserMessage = {
      text: userMessage,
      isUser: true
    };
    console.log("ユーザーメッセージ:", newUserMessage);
    setChatMessages(prev => [...prev, newUserMessage]);

    // 入力欄をクリア
    setUserMessage('');

    try {
      // ローディングメッセージ
      setChatMessages(prev => [...prev, {
        text: '考え中...',
        isUser: false,
        isLoading: true
      }]);

      // チャット履歴を構築
      const chatHistory = chatMessages
        .filter(msg => !msg.isLoading)
        .map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        }));
      
      // 現在のユーザーメッセージを追加
      chatHistory.push({
        role: "user",
        content: userMessage
      });

      console.log("チャット履歴:", JSON.stringify(chatHistory));
      console.log("現在の問題:", currentQuestion?.body);
      console.log("ユーザーの回答:", userAnswer);
      console.log("正解:", currentQuestion?.answer);


      // APIに送信
      const response = await fetch('http://localhost:8000/api/chat/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem: currentQuestion.body,
          user_answer: userAnswer,
          correct_answer: currentQuestion.answer,
          chat_history: chatHistory
        }),
      });

      const data = await response.json();

      // ローディングメッセージを削除
      setChatMessages(prev => prev.filter(msg => !msg.isLoading));

      // AIの返答を追加
      setChatMessages(prev => [...prev, {
        text: data.reply,
        isUser: false
      }]);
    } catch (err) {
      // エラー処理（省略）
    }
  };

  // 正解を表示する
  const showCorrectAnswer = () => {
    if (currentQuestion && currentQuestion.answer) {
      setUserAnswer(currentQuestion.answer);
      setChatMessages(prev => [...prev, {
        text: `正解は ${currentQuestion.answer} です。`,
        isUser: false
      }]);
    }
  };

  // チャットモードを終了し、次の問題へ
  const endChatAndContinue = () => {
    setFeedback(null);
    setUserAnswer('');
    setChatMode(false);
    setChatMessages([]);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 全問題終了
      navigate('/complete');
    }
  };

  // 学習画面を終了
  const exitLesson = () => {
    if (confirm('学習を中断しますか？進捗は保存されません。')) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#58cc02] mx-auto"></div>
        <p className="mt-4 text-xl">問題を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-xl mb-4">問題が見つかりませんでした</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* 進捗バー */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={exitLesson}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-xl">&#x2715;</span>
          </button>
          <span className="text-sm font-medium">
            問題 {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-[#58cc02] h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {!chatMode ? (
        // 通常モード（問題カード）
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6">問題:</h2>
          <div className="mb-8 text-4xl text-center font-bold">{currentQuestion.body}</div>
          
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              あなたの答え:
            </label>
            <input
              type="text"
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="例: 1/2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58cc02] focus:border-transparent"
            />
          </div>

          <button
            onClick={submitAnswer}
            className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-bold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#58cc02] focus:ring-opacity-50"
          >
            回答する
          </button>
        </div>
      ) : (
        // チャットモード
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側: 問題カード */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <h2 className="text-lg font-bold mb-2">問題:</h2>
              <div className="mb-4 text-2xl text-center font-bold">{currentQuestion.body}</div>
              
              <div className="mb-4">
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  あなたの答え:
                </label>
                <input
                  type="text"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="例: 1/2"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58cc02] focus:border-transparent"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={submitAnswer}
                  className="flex-1 bg-[#58cc02] hover:bg-[#46a302] text-white font-bold py-2 px-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#58cc02] focus:ring-opacity-50 text-sm"
                >
                  再回答
                </button>
                <button
                  onClick={endChatAndContinue}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-colors focus:outline-none text-sm"
                >
                  次へ進む
                </button>
              </div>
            </div>
          </div>

          {/* 右側: チャット */}
          <div className="md:w-2/3 bg-white rounded-xl shadow-lg p-4 flex flex-col h-[500px]">
            <h2 className="text-lg font-bold mb-2">AIチューター</h2>
            
            {/* チャットメッセージ表示エリア */}
            <div className="flex-1 overflow-y-auto mb-4 p-2">
              {chatMessages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg.text} 
                  isUser={msg.isUser} 
                />
              ))}
              <div ref={chatEndRef} />
            </div>
            
            {/* チャット入力フォーム */}
            <div className="border-t pt-4">
              <form onSubmit={sendChatMessage} className="flex">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="AIチューターに質問する..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg transition-colors"
                >
                  送信
                </button>
              </form>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={showCorrectAnswer}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  正解を表示
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フィードバック */}
      {feedback && !chatMode && (
        <div className={`p-4 mb-6 rounded-xl animate-fade-in max-w-4xl mx-auto ${feedback.ok ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${feedback.ok ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              {feedback.ok ? (
                <span>&#x2714;</span>
              ) : (
                <span>&#x2716;</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{feedback.ok ? '正解です！' : '不正解です'}</h3>
              {!feedback.ok && feedback.hint && (
                <p className="text-sm">{feedback.hint}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 学習完了画面
const CompletePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl text-center">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="w-16 h-16 bg-[#58cc02] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">&#x2714;</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">お疲れ様でした！</h1>
        <p className="text-xl mb-6">すべての問題を完了しました</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span>正解率:</span>
            <span className="font-bold">80%</span>
          </div>
          <div className="flex justify-between">
            <span>獲得ポイント:</span>
            <span className="font-bold">50 XP</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            ホームに戻る
          </button>
          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            もう一度挑戦する
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        毎日学習を続けて、分数マスターになりましょう！
      </p>
    </div>
  );
};

// メインアプリケーション
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <Header />
        
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/complete" element={<CompletePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;