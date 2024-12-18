import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import Alert from './alert';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";



const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage({ type: 'success', text: 'Registration successful!' });
      navigate('/login');
    } catch (error: any) {

      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  return (
    <StyledWrapper>
      <div className="login-box">
        <p>Register</p>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              required
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              required
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label>Password</label>
          </div>
          {message.text && (
            <Alert type={message.type} message={message.text} onClose={handleCloseMessage} />
          )}
          <button type="submit" className="submit-button">
            <a >

              <span />
              <span />
              <span />
              <span />
              Submit
            </a>
          </button>
        </form>

        <p>
          Already have an account? <a href="/login" className="a2">Login!</a>
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  margin: 20px auto;
  transform: translate(-50%, -55%);
  background: rgba(0, 0, 0, .9);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
}

.login-box p:first-child {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #fff;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  font-weight: bold;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 10px;
  letter-spacing: 3px;
}

.login-box a:hover {
  background: #fff;
  color: #272727;
  border-radius: 5px;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff);
  animation: btn-anim1 1.5s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%, 100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #fff);
  animation: btn-anim2 1.5s linear infinite;
  animation-delay: .375s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }

  50%, 100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #fff);
  animation: btn-anim3 1.5s linear infinite;
  animation-delay: .75s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }

  50%, 100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #fff);
  animation: btn-anim4 1.5s linear infinite;
  animation-delay: 1.125s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }

  50%, 100% {
    bottom: 100%;
  }
}

.login-box p:last-child {
  color: #aaa;
  font-size: 14px;
  text-align: center; /* Centra el párrafo que contiene el enlace */
}

.login-box a.a2 {
  color: #fff;
  text-decoration: none;
  display: inline-block; /* Asegura que el enlace se comporte como un bloque */
}

.login-box a.a2:hover {
  background: transparent;
  color: #aaa;
  border-radius: 5px;
}

/* CENTRADO del botón Submit */
.login-box form button {
  display: block;
  width: 100%;
  text-align: center; /* Asegura que el texto esté centrado dentro del botón */
}

/* CENTRADO del enlace "Already have an account?" */
.login-box p {
  text-align: center; /* Centra todo el contenido dentro del párrafo */
}

`;

export default RegisterForm;
