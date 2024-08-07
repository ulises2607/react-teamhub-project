import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Agregar la lógica de autenticación
    dispatch(setUser({ name: username, email: `${username}@example.com` }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="p-8 bg-gray-700 rounded shadow-md w-96">
        <h2 className="text-white text-2xl mb-4">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 rounded text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
