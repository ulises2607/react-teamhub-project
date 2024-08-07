import React, { useState } from 'react';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="flex items-center">
        <img
          className="w-10 h-10 rounded-full"
          src="https://https://sandbox.academiadevelopers.com/user/profiles/1"
          alt="User"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</a>
          <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
        </div>
      )}
    </div>
  );
};

export default Profile;
