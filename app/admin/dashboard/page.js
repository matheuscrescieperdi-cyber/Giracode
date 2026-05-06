"use client";
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Users, Scan, MousePointer2, Calendar, Filter, Download, Trash2 } from 'lucide-react';

// Cores seguindo a nova identidade (Azul e Amarelo)
const COLORS = ['#3d5afe', '#fbc02d', '#536dfe', '#fdd835', '#c5cae9'];

export default function DashboardPage() {
  const [stats, setStats] = useState({ scans: [] });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Erro ao carregar stats');
    }
  };

  // Dados para os gráficos
  const deviceData = Object.entries(
    stats.scans.reduce((acc, s) => {
      acc[s.device] = (acc[s.device] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Simulação de dados por hora (baseado na imagem)
  const hourlyData = [
    { hour: '12am', scans: 0 }, { hour: '4am', scans: 0 }, { hour: '8am', scans: 0 },
    { hour: '12pm', scans: 0 }, { hour: '4pm', scans: 0 }, { hour: '6pm', scans: 1 },
    { hour: '8pm', scans: 0 }, { hour: '11pm', scans: 0 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Estatísticas</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Veja os dados sobre varreduras de código QR, usuários e geografia
        </p>
      </header>

      {/* Filtros conforme a imagem */}
      <div className="filters-bar">
        <Filter size={18} color="var(--primary)" />
        <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
          <select style={{ width: 'auto', background: '#fff' }}>
            <option>Localização: Todas</option>
          </select>
          <select style={{ width: 'auto', background: '#fff' }}>
            <option>Período: Últimos 7 dias</option>
          </select>
          <select style={{ width: 'auto', background: '#fff' }}>
            <option>Dispositivo: Todos</option>
          </select>
        </div>
        <button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }}>Aplicar filtros</button>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trash2 size={16} /> Limpar filtros
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid-stats">
        <div className="card">
          <div className="stat-label">Vedeces Totais</div>
          <div className="stat-value">{stats.scans.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Abr 28, 26 - May 05, 26</div>
        </div>
        <div className="card">
          <div className="stat-label">Varreduras Únicas</div>
          <div className="stat-value">{new Set(stats.scans.map(s => s.userAgent)).size}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Abr 28, 26 - May 05, 26</div>
        </div>
        <div className="card">
          <div className="stat-label">Usuários Totais</div>
          <div className="stat-value">1</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Sempre</div>
        </div>
      </div>

      {/* Gráficos de Dispositivo e SO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Dispositivas</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData.length > 0 ? deviceData : [{name: 'Sem dados', value: 1}]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Sistema Operacional</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData.length > 0 ? deviceData : [{name: 'Sem dados', value: 1}]}
                  outerRadius={80}
                  dataKey="value"
                >
                   {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Varreduras Diárias */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Digitaliza Durante O Dia</h3>
        <div className="chart-container" style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
