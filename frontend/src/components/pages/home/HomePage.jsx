import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const technologies = [
    { name: "React", icon: "react.svg" },
    { name: "Node.js", icon: "nodejs.svg" },
    { name: "Vite", icon: "vite.svg" },
    { name: "React Router", icon: "reactrouter.svg" },
    { name: "Redux", icon: "redux.svg" },
    { name: "Tailwind", icon: "tailwindcss.svg" },
    { name: "Vercel", icon: "vercel.svg" },
    { name: "Git", icon: "git.svg" },
    { name: "Github", icon: "github.svg" },
  ];

  const teamMembers = [
    {
      name: "Rodrigo Eduardo Gonza",
      linkedin: "https://www.linkedin.com/in/rodrigo-gonza",
    },
    {
      name: "Cesar Ulises Cappa Subelza",
      linkedin: "https://www.linkedin.com/in/cesar-ulises-cappa-subelza",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.pixabay.com/video/2018/10/23/18849-297379170_large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay para fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 opacity-75"></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">Aplicación de Mensajería</h2>
        
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
            <img
                src="/logo.jpeg"
                alt="Logo"
                className="w-40 h-40 rounded-full shadow-lg"
            />
        </div>

        {/* Botón de Login */}
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 mb-4"
        >
          Iniciar Sesión
        </button>

        {/* Título de Tecnologías */}
        <h2 className="text-3xl font-semibold text-white mb-4 text-center">
          Tecnologías utilizadas
        </h2>

        {/* Tecnologías */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center mb-16">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center">
              <img
                src={`/${tech.icon}`}
                alt={tech.name}
                className="w-12 h-12 mb-2"
              />
              <p className="text-lg font-semibold text-white">{tech.name}</p>
            </div>
          ))}
        </div>

        {/* Equipo de Trabajo */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4 text-center mb-16">React-Error-Lab</h2>
          <ul className="flex flex-col md:flex-row justify-center gap-8">
            {teamMembers.map((member) => (
              <li key={member.name} className="text-center">
                <p className="text-lg font-semibold text-white">{member.name}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* <img
                    src={`/${member.image}`}
                    alt={member.name}
                    className="w-16 h-16 rounded-full mb-2 mx-auto"
                  /> */}
                  <img
                    src="linkedin.svg"
                    alt={`LinkedIn`}
                    className="w-12 h-12 mx-auto"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
