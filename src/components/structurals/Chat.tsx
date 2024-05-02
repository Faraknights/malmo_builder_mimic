import React, { useEffect, useRef } from 'react';
import { chatProps } from '../../classes/Chat';

const Chat: React.FC<chatProps> = ({
    chatHistory
}) => {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom of the chat when chatHistory changes
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div id="chat" ref={chatRef}>
            <span>Chat</span>
            <hr />
            <div>
                {chatHistory.map((chat, i) => (
                    <>
                        {(i === 0 || chat.user !== chatHistory[i-1].user) && (
                            <span className='userName' key={`user-${i}`}>
                                {chat.user}
                            </span>
                        )}
                        <div
                            key={i}
                            className={`message`}
                        >
                            {chat.content}
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
};

export default Chat;
