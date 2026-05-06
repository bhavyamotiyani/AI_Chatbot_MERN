import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import AdminDashboard from './AdminDashboard';

// Backend base URL switcher (local development vs production cloud server)
export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://ai-chatbot-mern-o0ka.onrender.com';

// Custom text formatter to handle markdown bold, lists, and code blocks
export function FormattedText({ text }) {
  if (!text) return null;

  // helper to convert markdown **bold** to html strong tags
  const parseBoldText = (inputText) => {
    if (!inputText) return '';
    // split by ** blocks to isolate bold chunks
    const regexParts = inputText.split(/(\*\*.*?\*\*)/g);
    return regexParts.map((subPart, subIdx) => {
      if (subPart.startsWith('**') && subPart.endsWith('**')) {
        return (
          <strong key={subIdx} style={{ fontWeight: '700', color: 'var(--text-main)' }}>
            {subPart.slice(2, -2)}
          </strong>
        );
      }
      return subPart;
    });
  };

  // split text into regular text and code block chunks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {parts.map((part, index) => {
        // if chunk is a code block, render a nice copyable code box
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          let language = 'CODE';
          let codeContent = lines.join('\n');

          // extract language label if specified (like ```javascript)
          if (lines[0] && lines[0].length < 15 && !lines[0].includes(';') && !lines[0].includes('=')) {
            language = lines[0].toUpperCase();
            codeContent = lines.slice(1).join('\n');
          }

          // single-click copy to clipboard
          const copyCode = () => {
            navigator.clipboard.writeText(codeContent);
            alert("Code copied to clipboard!");
          };

          return (
            <div key={index} className="terminal-container">
              {/* title header with copy button */}
              <div className="terminal-header">
                <span>{language}</span>
                <button onClick={copyCode} className="terminal-copy-btn">Copy</button>
              </div>
              <pre className="terminal-body">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        } else {
          // render normal text line by line
          const textLines = part.split('\n');
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {textLines.map((line, lIdx) => {
                const trimmed = line.trim();
                // if line starts with a bullet point, render it as a list item
                if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                  return (
                    <div key={lIdx} className="bullet-item">
                      <span className="bullet-dot">•</span>
                      <span>{parseBoldText(trimmed.substring(2))}</span>
                    </div>
                  );
                }
                // standard text paragraph
                return <p key={lIdx} style={{ margin: 0, minHeight: line === '' ? '8px' : 'auto' }}>{parseBoldText(line)}</p>;
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

// Custom logo helper
function LogoIcon({ size = 42, radius = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Background Rounded Square (Adjustable radius based on prop) */}
      <rect width="100" height="100" rx={radius * 2.38} fill="#1c1917" />

      {/* Sleek, friendly robot face container */}
      <rect x="25" y="32" width="50" height="40" rx="12" fill="#fafaf9" />

      {/* Side communication nodes */}
      <rect x="21" y="46" width="4" height="12" rx="2" fill="#e7e5e4" />
      <rect x="75" y="46" width="4" height="12" rx="2" fill="#e7e5e4" />

      {/* Top Antenna receiver */}
      <rect x="47" y="20" width="6" height="12" rx="3" fill="#e7e5e4" />
      <circle cx="50" cy="17" r="5" fill="#ef4444" /> {/* Cute glowing status light */}

      {/* Intelligent digital eyes */}
      <circle cx="40" cy="48" r="4.5" fill="#1c1917" />
      <circle cx="60" cy="48" r="4.5" fill="#1c1917" />

      {/* Smiling mouth */}
      <path d="M42 58 Q 50 64, 58 58" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// --- TINY ADJUSTABLE CLOSE ICON HELPER (Saves code clutter in lists) ---
function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

// --- TINY ADJUSTABLE EDIT PENCIL ICON HELPER (Saves code clutter in lists) ---
function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}

// --- TINY VECTOR CHAT ICON (Saves code clutter in list) ---
function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: '8px' }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function App() {
  // --- 1. Login System Variables ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // view password toggle
  const [isLoginMode, setIsLoginMode] = useState(true); // true = Login, false = Register
  const [authMessage, setAuthMessage] = useState('');
  const [role, setRole] = useState('user'); // Tracks 'user' or 'admin'

  // --- 2. Chat Variables ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Friendly loading state
  const [currentThreadId, setCurrentThreadId] = useState(null); // Active conversation thread ID!

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const messagesEndRef = useRef(null); // Ref to auto-scroll to bottom

  // Sync theme changes with body classList
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- 3. Login & Register Function ---
  const handleAuth = async () => {
    const endpoint = isLoginMode ? '/login' : '/register';
    const isAdminPath = window.location.pathname === '/admin';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          // --- Split URL Security Guards ---
          if (isAdminPath && data.role !== 'admin') {
            setAuthMessage("Access Denied: Only Admins can enter here.");
            return;
          }
          if (!isAdminPath && data.role === 'admin') {
            setAuthMessage("Admin account must log in from the /admin portal.");
            return;
          }

          setIsLoggedIn(true);
          setRole(data.role || 'user'); // Set user role from response
          localStorage.setItem('user', username); // Save login on refresh
          localStorage.setItem('role', data.role || 'user'); // Save role on refresh
        } else {
          setAuthMessage("Registered successfully! Now please login.");
          setIsLoginMode(true);
        }
      } else {
        setAuthMessage(data.error);
      }
    } catch (error) {
      setAuthMessage("Server error!");
    }
  };

  // --- Fetch History from MongoDB ---
  const fetchHistory = async (user = username) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/history?username=${user}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.log("Error loading history:", error);
    }
  };

  // Fetch history when logged in
  useEffect(() => {
    if (isLoggedIn && username) {
      fetchHistory(username);
    }
  }, [isLoggedIn, username]);

  // Keep user logged in when they refresh the page
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role') || 'user';
    const isAdminPath = window.location.pathname === '/admin';

    if (savedUser) {
      // Validate that role matches active sub-url pathname on boot
      if (isAdminPath && savedRole === 'admin') {
        setIsLoggedIn(true);
        setUsername(savedUser);
        setRole(savedRole);
      } else if (!isAdminPath && savedRole === 'user') {
        setIsLoggedIn(true);
        setUsername(savedUser);
        setRole(savedRole);
        fetchHistory(savedUser); // Instantly load user history
      } else {
        // Clear mismatched sessions immediately
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    }
  }, []);

  // Auto scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Dynamically change browser tab title when active chat thread changes
  useEffect(() => {
    if (currentThreadId && history.length > 0) {
      const activeThread = history.find(item => item._id === currentThreadId);
      if (activeThread) {
        document.title = `AI Chatbot | ${activeThread.title}`;
        return;
      }
    }
    document.title = "AI Chatbot";
  }, [currentThreadId, history]);

  // Load a selected past chat thread on screen
  const loadPastChat = (item) => {
    setCurrentThreadId(item._id); // Set the current thread ID
    setMessages(
      item.messages.map(m => ({ text: m.text, isUser: m.isUser }))
    );
  };

  // --- 4. Send Chat Function ---
  const sendMessage = async () => {
    if (input === "") return;

    // Add user message to screen
    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true); // Show loader!

    try {
      // Send message to backend with active thread ID if existing
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, username: username, threadId: currentThreadId })
      });

      const data = await response.json();

      // Add AI reply to screen
      setMessages([...newMessages, { text: data.reply, isUser: false }]);
      setCurrentThreadId(data.threadId); // Lock in the thread ID!
      fetchHistory(username); // Refresh history list!
    } catch (error) {
      setMessages([...newMessages, { text: "Error connecting to AI.", isUser: false }]);
    } finally {
      setIsLoading(false); // Stop loader!
    }
  };

  // --- 5. Logout Function ---
  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMessages([]);
    setRole('user'); // Reset role
    setCurrentThreadId(null); // Clear current thread
    localStorage.removeItem('user'); // Clear saved login
    localStorage.removeItem('role'); // Clear saved role
  };

  // --- 6. Clear History Function ---
  const clearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all chat history?")) {
      try {
        await fetch(`${API_URL}/history?username=${username}`, { method: 'DELETE' });
        setHistory([]);
        setMessages([]);
        setCurrentThreadId(null); // Clear current thread
      } catch (error) {
        console.log("Error clearing history:", error);
      }
    }
  };

  // --- 7. Delete Single Chat Function ---
  const deleteChat = async (id, e) => {
    e.stopPropagation(); // Stop click from loading the chat
    if (window.confirm("Delete this chat?")) {
      try {
        await fetch(`${API_URL}/history/${id}`, { method: 'DELETE' });
        if (id === currentThreadId) {
          setMessages([]);
          setCurrentThreadId(null); // Reset screen if deleting active chat
        }
        fetchHistory(username); // Refresh history list
      } catch (error) {
        console.log("Error deleting chat:", error);
      }
    }
  };

  // --- 8. Rename Single Chat Function ---
  const renameChat = async (id, currentTitle, e) => {
    e.stopPropagation(); // Stop click from loading the chat
    const newTitle = window.prompt("Rename Chat Thread:", currentTitle);
    if (newTitle && newTitle.trim() !== "" && newTitle !== currentTitle) {
      try {
        const response = await fetch(`${API_URL}/history/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle.trim() })
        });
        if (response.ok) {
          fetchHistory(username); // Refresh history list with new title
        }
      } catch (error) {
        console.log("Error renaming chat:", error);
      }
    }
  };

  // ==========================================
  // RENDER LOGIN SCREEN (If not logged in)
  // ==========================================
  if (isLoggedIn === false) {
    const isAdminPath = window.location.pathname === '/admin';
    const activeLoginMode = isAdminPath ? true : isLoginMode; // Force login on admin path

    return (
      <div className="login-screen">
        <div className="login-box">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <LogoIcon size={80} radius={18} />
          </div>
          <h2>{isAdminPath ? "Admin Portal" : (activeLoginMode ? "Welcome Back" : "Create Account")}</h2>
          <p className="login-subtitle">
            {isAdminPath ? "Secure administrative sign in" : (activeLoginMode ? "Sign in to continue your conversations" : "Get started with your free AI helper")}
          </p>

          {authMessage && (
            <div className="auth-error-banner">
              {authMessage}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? handleAuth() : null}
              style={{ width: '100%', paddingRight: '42px', boxSizing: 'border-box', margin: 0 }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-sub)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                boxShadow: 'none'
              }}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button onClick={handleAuth} style={{ marginTop: '5px' }}>
            {activeLoginMode ? "Sign In" : "Register"}
          </button>

          {!isAdminPath && (
            <p className="switch-text">
              {activeLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
              <span className="switch-link" onClick={() => { setIsLoginMode(!activeLoginMode); setAuthMessage(''); }}>
                {activeLoginMode ? "Sign Up" : "Sign In"}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER ADMIN SCREEN (If user is Admin)
  // ==========================================
  if (isLoggedIn && role === 'admin') {
    return <AdminDashboard onClose={logout} />;
  }

  // ==========================================
  // RENDER CHAT SCREEN (If logged in)
  // ==========================================
  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LogoIcon size={42} radius={10} />
            <h2>AI Chatbot</h2>
          </div>
          {/* Minimalist Professional Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-main)' }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-main)' }}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
        <p>Logged in as: <b>{username}</b></p>

        <br />
        <button onClick={() => { setMessages([]); setCurrentThreadId(null); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>

        <div className="history-list">
          <div className="history-header">
            <p className="history-title">Recent Chats</p>
            {history.length > 0 && (
              <button onClick={clearHistory} className="clear-all-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear All
              </button>
            )}
          </div>
          {history.length === 0 ? <p className="no-history">No past chats yet</p> : null}
          {history.map((item, index) => (
            <div key={index} className="history-item" onClick={() => loadPastChat(item)}>
              <span className="history-text">
                <ChatIcon />
                {item.title}
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button onClick={(e) => renameChat(item._id, item.title, e)} className="delete-btn rename-btn" title="Rename Chat">
                  <EditIcon />
                </button>
                <button onClick={(e) => deleteChat(item._id, e)} className="delete-btn" title="Delete Chat">
                  <CloseIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={logout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">

        {/* Messages List */}
        <div className="messages-box">
          {messages.length === 0 ? <p style={{ color: 'var(--text-sub)' }}>Start a conversation...</p> : null}

          {messages.map((msg, index) => (
            <div key={index} className={msg.isUser ? "user-msg" : "ai-msg"}>
              <b>{msg.isUser ? "You:" : "AI:"}</b>
              {msg.isUser ? <p>{msg.text}</p> : <FormattedText text={msg.text} />}
            </div>
          ))}

          {/* User-friendly thinking bubble (Typing Pulsing Dots) */}
          {isLoading && (
            <div className="ai-msg">
              <b>AI:</b>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {/* Invisible auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="input-box">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

      </div>

    </div>
  );
}

export default App;
