"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, QrCode, LogOut, BarChart3, Globe, Users, FileText } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Estatísticas', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Configurações', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Meus QR Codes', icon: <QrCode size={20} />, path: '/' },
    { name: 'Domínio', icon: <Globe size={20} />, path: '#' },
    { name: 'Relatórios', icon: <BarChart3 size={20} />, path: '#' },
  ];

  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/login');
  };

  return (
    <aside className="sidebar no-print">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src="/logo.png" alt="Gira CODE" style={{ width: '24px' }} />
        </div>
        <span className="logo-text">Gira CODE</span>
      </div>

      <nav className="sidebar-nav">
        <Link href="/admin/dashboard" className={`nav-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}>
          <BarChart3 size={20} />
          <span>Estatísticas</span>
        </Link>
        <Link href="/admin/leads" className={`nav-link ${pathname === '/admin/leads' ? 'active' : ''}`}>
          <Users size={20} />
          <span>Gestão de Leads</span>
        </Link>
        <Link href="/admin/settings" className={`nav-link ${pathname === '/admin/settings' ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Configurações</span>
        </Link>
        <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
          <QrCode size={20} />
          <span>Meus QR Codes</span>
        </Link>
        <button className="nav-link" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
          <Globe size={20} />
          <span>Domínio</span>
        </button>
        <button className="nav-link" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
          <FileText size={20} />
          <span>Relatórios</span>
        </button>
      </nav>

      <button className="logout-btn" onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </aside>
  );
}
