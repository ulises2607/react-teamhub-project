import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServers, createServer } from "../../redux/server/serverSlice";
import { useNavigate } from "react-router-dom";

const ServerList = () => {
  const dispatch = useDispatch();
  const serversState = useSelector((state) => state.servers);
  const auth = useSelector((state) => state.auth.token);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: null,
  });
  const navigate = useNavigate();

  const nameRef = useRef();
  const descriptionRef = useRef();
  const iconRef = useRef();

  useEffect(() => {
    dispatch(getServers());
  }, [dispatch]);

  console.log("Servers: ", serversState.servers);
  console.log("El token de la auth en el server component: ", auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const serverData = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      icon: iconRef.current.files[0],
    };

    console.log(
      "La data que se capta del formulario en el cliente: ",
      serverData
    );

    dispatch(createServer(serverData));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Server List</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            ref={nameRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            ref={descriptionRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Icon
          </label>
          <input
            type="file"
            name="icon"
            ref={iconRef}
            className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Server
        </button>
      </form>

      <div>
        {serversState.isLoading && <p>Loading...</p>}
        {serversState.errors && (
          <p className="text-red-500">{serversState.errors}</p>
        )}
        {serversState.messages && (
          <p className="text-green-500">{serversState.messages}</p>
        )}
      </div>

      <ul className="list-disc pl-5">
        {serversState.servers
          ? serversState.servers.map((server) => (
              <li key={server.id} className="mb-2">
                <div className="p-4 bg-white shadow rounded-lg">
                  <h2 className="text-lg font-bold">{server.name}</h2>
                  <p>{server.description}</p>
                  {server.icon && (
                    <img
                      src={server.icon}
                      alt={server.name}
                      className="w-16 h-16 mt-2"
                    />
                  )}
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default ServerList;
