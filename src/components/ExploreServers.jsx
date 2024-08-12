import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exploreServers, joinServer } from "../redux/serverSlice";
import { useNavigate } from "react-router-dom";

const ExploreServers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { servers, isLoading, errors } = useSelector((state) => state.servers);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm]);

  useEffect(() => {
    dispatch(exploreServers(searchParams));
  }, [searchParams, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleJoinServer = (serverId) => {
    dispatch(joinServer(serverId));
  };

  const handleBackToMain = () => {
    navigate("/main");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Explore Servers</h1>
        <button
          onClick={handleBackToMain}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Volver
        </button>
      </div>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search servers..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {isLoading && <p className="text-center text-gray-600">Loading...</p>}
      {errors?.detail && <p className="text-center text-red-500">{errors.detail}</p>}
      <ul className="space-y-4">
        {servers.length > 0 ? (
          servers.map((server) => (
            <li key={server.id} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-md">
              <div className="mr-4">
                <img 
                  src={server.icon || '/default-icon.png'} 
                  alt={`${server.name} icon`} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{server.name}</h2>
                <p className="text-gray-600">{server.description}</p>
              </div>
              <button
                onClick={() => handleJoinServer(server.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Unirse
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600">Servidores no encontrados.</p>
        )}
      </ul>
    </div>
  );
};

export default ExploreServers;
