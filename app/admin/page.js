"use client";
import React, { useState, useEffect } from 'react';
import { QrCode, ExternalLink, Printer, Download, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const scanUrl = `${baseUrl}/api/scan`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(scanUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>Meus QR Codes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gerencie seus códigos e prepare-os para impressão</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        <div className="card printable" style={{ textAlign: 'center', padding: '3rem', position: 'relative' }}>
          <img src="/logo.png" alt="Mascote Gira" style={{ width: '60px', position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', border: '4px solid #fff', borderRadius: '50%' }} className="no-print" />
          <div style={{ border: '1px solid #eee', borderRadius: '24px', padding: '2rem', display: 'inline-block', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            {baseUrl ? (
              <img src={qrCodeUrl} alt="QR Code Gira CODE" style={{ width: '300px', height: '300px' }} />
            ) : (
              <div style={{ width: '300px', height: '300px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Carregando...
              </div>
            )}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Gira CODE</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Escaneie para acessar o formulário
            </p>
            
            <div className="no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Printer size={18} /> Imprimir / PDF
              </button>
              <button className="nav-link" onClick={handleCopy} style={{ border: '1px solid #ddd', background: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {copied ? <Check size={18} color="#4caf50" /> : <Copy size={18} />} 
                {copied ? 'Copiado!' : 'Copiar Link'}
              </button>
            </div>
          </div>
        </div>

        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Informações do Link</h3>
            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', wordBreak: 'break-all', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {scanUrl}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Este é o link inteligente que faz o rastreamento. Você pode alterar o destino dele nas <strong>Configurações</strong>.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Instruções</h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Imprima o QR Code em alta qualidade.</li>
              <li>Coloque em um local visível na loja.</li>
              <li>Configure o link do seu <strong>Google Forms</strong> na aba de Configurações.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
