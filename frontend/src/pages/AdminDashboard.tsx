import { useState } from 'react';
import { logout } from '../utils/auth';
import MassScheduleManager from '../components/admin/MassScheduleManager';
import SpiritualMessageManager from '../components/admin/SpiritualMessageManager';
import MediaGalleryManager from '../components/admin/MediaGalleryManager';
import AnnouncementsManager from '../components/admin/AnnouncementsManager';
import {
  Calendar,
  BookOpen,
  Image,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

type Module = 'mass' | 'message' | 'media' | 'announcements';

const modules: { id: Module; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'mass',
    label: 'Mass Schedule',
    icon: <Calendar size={20} />,
    description: 'Manage mass timings and services',
  },
  {
    id: 'message',
    label: 'Spiritual Message',
    icon: <BookOpen size={20} />,
    description: 'Update daily spiritual message',
  },
  {
    id: 'media',
    label: 'Media Gallery',
    icon: <Image size={20} />,
    description: 'Upload images and videos',
  },
  {
    id: 'announcements',
    label: 'Announcements',
    icon: <Bell size={20} />,
    description: 'Manage church announcements',
  },
];

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState<Module>('mass');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  const activeModuleData = modules.find((m) => m.id === activeModule)!;

  return (
    <div className="min-h-screen bg-ivory flex font-body">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
              <img
                src="/assets/generated/church-logo.dim_256x256.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-cinzel text-gold text-xs tracking-wider uppercase">Admin Panel</p>
              <p className="font-heading text-white text-sm font-semibold leading-tight">Holy Rosary</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => {
                setActiveModule(mod.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeModule === mod.id
                  ? 'bg-gold text-navy font-semibold'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={activeModule === mod.id ? 'text-navy' : 'text-gold'}>
                {mod.icon}
              </span>
              <span className="font-body text-sm">{mod.label}</span>
              {activeModule === mod.id && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white text-sm font-body transition-colors"
          >
            ← View Website
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-body"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gold/20 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-navy p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-navy">{activeModuleData.label}</h1>
              <p className="font-body text-navy/50 text-xs hidden sm:block">{activeModuleData.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block font-body text-navy/50 text-xs">
              Parishudda Japamaala Maatha Devalayamu
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors text-sm font-body"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {activeModule === 'mass' && <MassScheduleManager />}
          {activeModule === 'message' && <SpiritualMessageManager />}
          {activeModule === 'media' && <MediaGalleryManager />}
          {activeModule === 'announcements' && <AnnouncementsManager />}
        </main>
      </div>
    </div>
  );
}
