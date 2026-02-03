import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../../lib/contexts/user-context';

export const LogoutButton = () => {
    const { logout } = useContext(UserContext);
    return (
        <button
            onClick={logout}
            aria-label="Logout from account"
            className="btn ml-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-slate-100 font-semibold rounded-lg 
                       hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/50
                       focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-950
                       transition-all duration-200 active:scale-95"
        >
            Logout
        </button>
    )
}



