"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, QrCode } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Senha simples para o MVP. Em produção o ideal é usar Supabase Auth.
    if (password === 'admin123') {
      document.cookie = "admin_session=true; path=/; max-age=86400"; // 24 horas
      router.push('/dashboard');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary-light)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <img src="/logo.png" alt="Gira CODE" style={{ width: '35px' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Gira CODE Admin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Acesso restrito ao painel</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#666' }}>Senha de Acesso</label>
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Entrar no Painel
          </button>

          {error && (
            <p style={{ marginTop: '1rem', color: '#f44336', fontSize: '0.85rem', fontWeight: 500 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
