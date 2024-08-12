import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Importa el archivo CSS

const LoginForm = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const username = formData.get("username");
    const password = formData.get("password");

    dispatch(login({ username, password }));
  };

  if (auth.token !== null) {
    navigate("/main");
  }

  return (
    <div className="w-full h-screen">
      <div className="h-full flex">
        <div className="hidden lg:flex w-full lg:w-1/2 relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://cdn.pixabay.com/video/2018/03/04/14696-258543627_large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white p-10">
            <h1 className="text-white font-bold text-4xl font-sans">
              Bienvenido!
            </h1>
            <p className="text-white mt-1">Powered by React-Error-Lab</p>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 justify-center items-center bg-black space-y-8">
          <div className="w-full px-8 md:px-32 lg:px-24">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-2xl form-container p-5"
            >
              <h1 className="text-gray-800 font-bold text-2xl mb-1">
                Hola Amigo!
              </h1>
              <p className="text-sm font-normal text-gray-600 mb-8">
                Comencemos...
              </p>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl border-discord-input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="username"
                  className="pl-2 w-full outline-none border-none bg-transparent "
                  type="text"
                  name="username"
                  placeholder="Introduce tu usuario..."
                />
              </div>
              <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl border-discord-input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  className="pl-2 w-full outline-none border-none bg-transparent"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Introduce tu contraseña..."
                />
              </div>
              <button
                type="submit"
                className="block w-full bg-discord-blue mt-5 py-2 rounded-2xl hover:bg-discord-blue-dark hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              >
                Iniciar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
