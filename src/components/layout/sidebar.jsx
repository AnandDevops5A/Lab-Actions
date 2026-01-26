"use client";
import React from "react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  menuItems,
  isDarkMode,
}) => {
  const activeTabStyle = isDarkMode
    ? "bg-linear-to-r from-orange-500 to-sky-100 text-slate-900 shadow-lg pointer-events-none"
    : "bg-linear-to-r from-orange-500 to-sky-100 text-slate-100 pointer-events-none  ";
  const inactiveTabStyle = isDarkMode
    ? "text-gray-400 hover:text-slate-100 hover:bg-gray-800 hover:scale-105 cursor-pointer transition-all duration-400 border  hover:border-orange-500"
    : " text-gray-600 hover:text-slate-900 hover:bg-gray-200 hover:scale-105 cursor-pointer transition-all duration-400 border  hover:border-orange-500";
  
    return (
    <div
      className={`
        ${sidebarOpen ? "w-64" : "w-16"} 
            bg-gray-950 shadow-2xl transition duration-900 fixed left-0 top-16 
              h-[calc(100vh-4rem)] border-r border-gray-800 z-50 overflow-y-auto 
           md:top-0 md:h-screen no-scrollbar 
          `}
    >
      <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 z-50 bg-gray-950">
        {sidebarOpen && (
          <h2 className="text-xl font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        )}
        <span
          
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-pressed={sidebarOpen}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="text-2xl hover:text-orange-500 transition-all duration-500 hover:scale-105 hover:cursor-pointer active:scale-95 ml-auto p-2"
        >
          <span aria-hidden>{sidebarOpen ? "⬅️" : "☰"}</span>
        </span>
      </div>

      <div className="mt-8 space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center align-middle space-x-2 px-4 py-3 rounded-lg transition-all duration-300 m-2 
                ${activeTab === item.id ? activeTabStyle : inactiveTabStyle}`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 bg-gray-800 rounded-lg p-4">
        {sidebarOpen && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Admin Account</p>
            <p className="text-sm font-bold">Admin User</p>
            <p className="text-xs text-gray-500">admin@tournament.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Sidebar);



