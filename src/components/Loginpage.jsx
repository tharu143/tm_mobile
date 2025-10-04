import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Loginpage({ setIsLoggedIn, theme, toggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('loggedIn', 'true');
        setIsLoggedIn(true);
        navigate('/');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      alert('Error during login: ' + error.message);
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <style>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          overflow: hidden;
          color: ${theme === 'light' ? '#000' : theme === 'dark' ? '#fff' : theme === 'nature' ? '#1f2937' : '#1f2937'};
        }
        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${theme === 'light' ? 'rgba(255,255,255,0.3)' : theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(240,247,244,0.4)'};
          backdrop-filter: blur(5px);
          z-index: 1;
        }
        .boy-container {
          position: relative;
          width: 120px;
          height: 180px;
          margin-bottom: 30px;
          z-index: 2;
        }
        .boy-head {
          width: 50px;
          height: 50px;
          background: linear-gradient(145deg, #ffd700, #ffa500);
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 35px;
          animation: jump-head 1.5s ease-in-out infinite;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .boy-body {
          width: 60px;
          height: 70px;
          background: linear-gradient(145deg, #00bfff, #1e90ff);
          border-radius: 10px;
          position: absolute;
          top: 50px;
          left: 30px;
          animation: jump-body 1.5s ease-in-out infinite;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .boy-arms {
          width: 70px;
          height: 12px;
          background: linear-gradient(145deg, #ff4500, #ff6347);
          border-radius: 5px;
          position: absolute;
          top: 60px;
          left: 25px;
          animation: jump-arms 1.5s ease-in-out infinite;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .boy-legs {
          width: 25px;
          height: 60px;
          background: linear-gradient(145deg, #228b22, #32cd32);
          border-radius: 5px;
          position: absolute;
          top: 120px;
          left: 47px;
          animation: jump-legs 1.5s ease-in-out infinite;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        @keyframes jump-head {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-60px) scale(1.1); }
        }
        @keyframes jump-body {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-60px); }
        }
        @keyframes jump-arms {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-60px) rotate(60deg); }
        }
        @keyframes jump-legs {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-60px) scaleY(0.7); }
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: ${theme === 'light' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? 'rgba(51,51,51,0.9)' : theme === 'nature' ? 'rgba(224,242,241,0.9)' : 'rgba(254,215,170,0.9)'};
          padding: 50px;
          border-radius: 15px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          z-index: 2;
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        input {
          margin: 12px 0;
          padding: 12px;
          width: 280px;
          border: 2px solid ${theme === 'light' ? '#ccc' : theme === 'dark' ? '#555' : '#4b5563'};
          border-radius: 8px;
          background-color: ${theme === 'light' ? '#fff' : theme === 'dark' ? '#444' : '#fff'};
          color: inherit;
          transition: border-color 0.3s, transform 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #007bff;
          transform: scale(1.02);
        }
        button {
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 15px;
          transition: background-color 0.3s, transform 0.3s;
        }
        button:hover {
          background-color: #0056b3;
          transform: scale(1.05);
        }
        .theme-toggle {
          margin-top: 25px;
          padding: 12px 24px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
          z-index: 2;
        }
        .theme-toggle:hover {
          background-color: #218838;
          transform: scale(1.05);
        }
      `}</style>
      <div className="boy-container">
        <div className="boy-head"></div>
        <div className="boy-body"></div>
        <div className="boy-arms"></div>
        <div className="boy-legs"></div>
      </div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username (Name)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button className="theme-toggle" onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

export default Loginpage;