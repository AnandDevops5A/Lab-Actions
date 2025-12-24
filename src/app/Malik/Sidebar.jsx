import React from 'react'

const Sidebar = ({sidebarOpen, setSidebarOpen, activeTab, setActiveTab, menuItems}) => {
  return (
   <div className={`
        ${sidebarOpen ? 'w-64' : 'w-16'} 
         bg-gray-950 shadow-2xl transition-all duration-300 fixed left-0 top-16 
           h-[calc(100vh-4rem)] border-r border-gray-800 z-40 overflow-y-auto 
           md:top-0 md:h-screen
          `}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl hover:text-orange-500 transition hover:scale-104 hover:cursor-pointer ">
            {sidebarOpen ? '⬅️' : '☰'}
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center align-middle space-x-3 px-5 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

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

  )
}

export default Sidebar

