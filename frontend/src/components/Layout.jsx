import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Users, Calendar, Shield, LogOut, Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/inscricoes', label: 'Inscrições', icon: Users },
    { path: '/equipes', label: 'Equipes', icon: Users },
    { path: '/agendamentos', label: 'Agendamentos', icon: Calendar },
  ];

  if (usuario?.tipo === 'admin') {
    menuItems.push({ path: '/admin', label: 'Administração', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-adc-green text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="lg:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-bold">ADC Taquaras</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Olá, {usuario?.nome}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`lg:w-64 ${menuAberto ? 'block' : 'hidden'} lg:block`}>
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setMenuAberto(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                          isActive 
                            ? 'bg-adc-green text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={20} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Conteúdo */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;