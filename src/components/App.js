import React, { useEffect, useRef, useState } from 'react';
import { auth, database } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onValue, push, query, ref, limitToLast, orderByChild } from 'firebase/database';
import LoginForm from './components/LoginForm';

const App = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  // Auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Messages stream (most recent 100)
  useEffect(() => {
    const messagesRef = query(ref(database, 'messages'), orderByChild('timestamp'), limitToLast(100));
    const unsub = onValue(messagesRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setMessages(list);
    });
    return () => unsub();
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!user) return;
    const value = text.trim();
    if (!value) return;

    await push(ref(database, 'messages'), {
      text: value,
      sender: user.email,
      uid: user.uid,
      timestamp: Date.now(),
    });
    setText('');
  };

  // If not logged in, show login form
  if (!user) return <LoginForm />;

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Realtime Chat (Firebase)</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user.email}</span>
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-message ${m.uid === user.uid ? 'own' : ''}`}>
            <div className="bubble">
              <div className="meta"><strong>{m.sender || 'Anonymous'}</strong></div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
