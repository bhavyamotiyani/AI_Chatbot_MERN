import React, { useState, useEffect } from 'react';
import { FormattedText, API_URL } from './App';

// clean minimalist line icons
const AdminIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)', marginRight: '10px', flexShrink: 0 }}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)', flexShrink: 0 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)', flexShrink: 0 }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const FlashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)', flexShrink: 0 }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ThreadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-sub)', marginRight: '8px', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function AdminDashboard({ onClose }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalThreads: 0, totalMessages: 0 });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userThreads, setUserThreads] = useState([]);

  // 1. Fetch system statistics and registered users
  const loadAdminData = async () => {
    try {
      const statsRes = await fetch(`${API_URL}/admin/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      const usersRes = await fetch(`${API_URL}/admin/users`);
      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (err) {
      console.log("Error loading admin stats:", err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // 2. Select a user to view their conversation threads and chat logs
  const viewUserChats = async (username) => {
    setSelectedUser(username);
    try {
      const res = await fetch(`${API_URL}/history?username=${username}`);
      const data = await res.json();
      setUserThreads(data);
    } catch (err) {
      console.log("Error loading user threads:", err);
    }
  };

  // 3. Delete a user account and clear all of their chat logs
  const deleteUser = async (username) => {
    if (window.confirm(`Delete user "${username}" and all of their chat logs?`)) {
      try {
        await fetch(`${API_URL}/admin/users/${username}`, { method: 'DELETE' });
        setSelectedUser(null);
        setUserThreads([]);
        loadAdminData(); // Reload stats and directory
      } catch (err) {
        console.log("Error deleting user:", err);
      }
    }
  };

  return (
    <div className="admin-container">
      {/* header */}
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AdminIcon />
          <div>
            <h2>Simple Admin Dashboard</h2>
            <p className="admin-subtitle">Monitor server usage, manage registered users, and inspect conversation history.</p>
          </div>
        </div>
        <button onClick={onClose} className="admin-back-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      {/* stat cards */}
      <div className="admin-stats-grid">
        <div className="admin-card">
          <UsersIcon />
          <div>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-card">
          <ChatIcon />
          <div>
            <h3>{stats.totalThreads}</h3>
            <p>Total Conversations</p>
          </div>
        </div>
        <div className="admin-card">
          <FlashIcon />
          <div>
            <h3>{stats.totalMessages}</h3>
            <p>AI Queries</p>
          </div>
        </div>
      </div>

      {/* main layout grid */}
      <div className="admin-content-layout">
        
        {/* user list card */}
        <div className="admin-panel-card">
          <h3>Registered Users</h3>
          <p className="panel-desc">Click on any user row to audit their past conversations.</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Conversations</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr 
                  key={u._id} 
                  className={`user-row ${selectedUser === u.username ? 'active-user-row' : ''}`}
                  onClick={() => viewUserChats(u.username)}
                >
                  <td><b>{u.username}</b></td>
                  <td>{u.threadCount} chats</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); deleteUser(u.username); }} className="admin-delete-user-btn">
                      <TrashIcon />
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#a8a29e', padding: '20px' }}>
                    No users registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* thread auditing container */}
        <div className="admin-panel-card">
          <h3>Conversation Auditor</h3>
          {selectedUser ? (
            <div>
              <p className="panel-desc">Showing chat history for: <b>{selectedUser}</b></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                {userThreads.length === 0 ? (
                  <p className="no-history">This user hasn't created any chat threads yet.</p>
                ) : (
                  userThreads.map((thread) => (
                    <div key={thread._id} style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                        <ThreadIcon />
                        Thread: "{thread.title}"
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {thread.messages.map((m, idx) => (
                          <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-main)', borderTop: '1px dashed var(--border-color)', paddingTop: '5px' }}>
                            <b>{m.isUser ? 'User: ' : 'AI: '}</b>
                            {m.isUser ? <span>{m.text}</span> : <FormattedText text={m.text} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <p className="no-history" style={{ textAlign: 'center', padding: '60px' }}>
              Select a user from the directory to inspect their active conversation logs.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
