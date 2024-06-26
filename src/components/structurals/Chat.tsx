import React, { useEffect, useRef, useState } from 'react';
import { chatProps } from '../../classes/Chat';

interface chatComponentProps{
    chat: chatProps,
    readOnly: boolean
}

const ChatComponent: React.FC<chatComponentProps> = ({
    chat,
    readOnly
}) => {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            console.log(chatRef.current)
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat.chatHistory]);

    enum Users{
        ARCHITECT = "ARCHITECT", 
        BUILDER = "BUILDER "
    }

    const [user, setUser] = useState<Users>(Users.ARCHITECT)

    return (
        <div id="chat" className='module'>
            <h3>Chat</h3>
            <hr/>
            <div ref={chatRef}>
                {chat.chatHistory.map((message, i) => (
                    <div key={i}>
                        {(i === 0 || message.user !== chat.chatHistory[i-1].user) && (
                            <span className='userName' key={`user-${i}`}>
                                {message.user}
                            </span>
                        )}
                        <div
                            key={i}
                            className={`message`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            {(!readOnly && (
                <>
                    <hr />
                    <div>
                        <button
                            onClick={e => {
                                setUser(Object.keys(Users)[(Object.keys(Users).findIndex(x => x === user) + 1) % Object.keys(Users).length] as Users)
                            }}    
                        >
                            {user}
                        </button>
                        <input 
                            type='text'
                            onKeyDown={e => {
                                if(e.key === 'Enter'){
                                    chat.addMessage({
                                        content:e.currentTarget.value,
                                        user: user
                                    })
                                    e.currentTarget.value = ""
                                }
                            }}
                        />
                    </div>
                </>
            ))}
        </div>
    );
};

export default ChatComponent;
