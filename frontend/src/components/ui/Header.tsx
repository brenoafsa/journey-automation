import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../../services/api';
import { userService, User } from '../../services/userService';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  return (
    <header className="w-full bg-blue-600 text-white flex items-center justify-between px-6 py-3 shadow">
      <div className="flex items-center gap-4">
        <div
          className="font-bold text-xl cursor-pointer"
          onClick={() => navigate('/')}
          tabIndex={0}
          role="button"
          onKeyDown={e => { if (e.key === 'Enter') navigate('/'); }}
        >
          Home
        </div>
        {user && (
          <span className="text-white text-base">
            Olá, {user.name}!
          </span>
        )}
      </div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;