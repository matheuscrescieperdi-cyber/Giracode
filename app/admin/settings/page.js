"use client";
import React, { useState, useEffect } from 'react';
import { Save, Link as LinkIcon, AlertCircle, Sparkles, ExternalLink, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('external'); // 'external' or 'internal'
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        const currentUrl = data.destinationUrl || '';
        setUrl(currentUrl);
        if (currentUrl === '/form') {
          setMode('internal');
        } else {
          setMode('external');
        }
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('Salvando...');
    const finalUrl = mode === 'internal' ? '/form' : url;
    
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl: finalUrl })
      });
      
      if (res.ok) {
        setStatus('Configuração salva com sucesso!');
        setTimeout(() => setStatus(''), 3000);
      } else {
        const errorData = await res.json();
        setStatus(`Erro: ${errorData.error || 'Falha ao salvar'}`);
      }
    } catch (error) {
      console.error('Save Error:', error);
      setStatus('Erro de conexão ao salvar.');
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Configurações do QR Code</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Escolha como os usuários interagem ao escanear o seu código.
        </p>
      </header>

      {/* Seletor de Modo (Tabs) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f5f5f5', padding: '0.5rem', borderRadius: '12px' }}>
        <button 
          onClick={() => setMode('external')}
          style={{ 
            flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: mode === 'external' ? '#fff' : 'transparent',
            boxShadow: mode === 'external' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            fontWeight: 600, color: mode === 'external' ? 'var(--primary)' : '#666',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <Globe size={18} /> Link Externo (Google Forms)
        </button>
        <button 
          onClick={() => setMode('internal')}
          style={{ 
            flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: mode === 'internal' ? '#fff' : 'transparent',
            boxShadow: mode === 'internal' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            fontWeight: 600, color: mode === 'internal' ? 'var(--primary)' : '#666',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <Sparkles size={18} /> Formulário Inteligente Gira
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSave}>
          {mode === 'external' ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <LinkIcon size={18} color="var(--primary)" />
                URL de Destino
              </label>
              <input 
                type="text" 
                value={url === '/form' ? '' : url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://docs.google.com/forms/d/..."
                required={mode === 'external'}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.8rem' }}>
                Recomendado para usar Google Forms, WhatsApp ou seu site próprio.
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Sparkles size={24} color="var(--primary)" />
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Formulário Inteligente Ativado</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>As perguntas aparecerão uma por uma para o usuário.</p>
                </div>
              </div>
              <a href="/form" target="_blank" className="nav-link" style={{ background: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <ExternalLink size={16} /> Visualizar Formulário
              </a>
            </div>
          )}

          <div style={{ padding: '1rem', background: '#fff9c4', borderRadius: '8px', border: '1px solid #fff59d', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <AlertCircle size={20} color="#fbc02d" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#616161', lineHeight: '1.4' }}>
              <strong>Importante:</strong> Ao salvar, o QR Code passará a levar para a opção selecionada acima instantaneamente.
            </p>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Save size={18} />
            Salvar Configurações
          </button>

          {status && (
            <p style={{ marginTop: '1rem', textAlign: 'center', color: status.includes('Erro') ? '#f44336' : '#4caf50', fontWeight: 600 }}>
              {status}
            </p>
          )}
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Ajuda com Supabase</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Se você estiver usando o <strong>Formulário Inteligente</strong>, certifique-se de que configurou as variáveis de ambiente na Netlify.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="badge" style={{ border: '1px solid #ddd' }}>Ver Tutorial</button>
          <button className="badge" style={{ border: '1px solid #ddd' }}>Copiar SQL</button>
        </div>
      </div>
    </div>
  );
}
