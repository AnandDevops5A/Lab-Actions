import React from 'react'
import { useContext } from 'react';
import { UserContext } from '../Library/ContextAPI';

export const LogoutButton = () => {
    const { logout } = useContext(UserContext);
    return (
        <button
            onClick={logout}
            className="ml-4 text-xs px-4 py-2 bg-neon-red text-amber-200 bg-green-400 font-bold rounded-lg hover:bg-red-600 transition duration-200 cursor-pointer hover:scale-105 "
        >
            Logout
        </button>
    )
}
