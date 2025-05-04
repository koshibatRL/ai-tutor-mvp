import React, { useState } from "react";
import ChatUI from "./ChatUI";

export default function Learn() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [showChatUI, setShowChatUI] = useState(false);
    const [currentHint, setCurrentHint] = useState("");

    const handleCheckAnswer = async () => {
        const response = await fetch("/api/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: "q"+(currentIndex+1), answer })
        });
        const result = await response.json();
        
        if (result.ok) {
            setCurrentIndex(i => i + 1);
        } else {
            setShowChatUI(true);
            setCurrentHint(result.hint);
        }
    };

    return (
        <div className="learn-container">
            {/* Existing question display */}
            <div className="answer-section">
                <input 
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer..."
                />
                <button onClick={handleCheckAnswer}>
                    Check Answer
                </button>
            </div>
            {showChatUI && <ChatUI hint={currentHint} />}
        </div>
    );
}
