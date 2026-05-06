"use client";
import React from 'react';
import { QrCode, Sparkles } from 'lucide-react';
import QRCode from 'qrcode.react';

export default function PublicQRPage() {
  const scanUrl = "https://giracode.netlify.app/api/scan";

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #3d5afe 0%, #304ffe 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#fff',
      textAlign: 'center'
    }}>
      {/* Círculos de fundo decorativos */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '30%', height: '30%', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <img src="/logo.png" alt="Gira CODE" style={{ width: '120px', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Gira <span style={{ color: '#ffd600' }}>CODE</span>
        </h1>
        <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '3rem', fontWeight: 500 }}>
          Escaneie e participe das nossas ações! 🦒✨
        </p>

        <div style={{ 
          background: '#fff', 
          padding: '2.5rem', 
          borderRadius: '40px', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          display: 'inline-block',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#ffd600', color: '#000', padding: '8px 15px', borderRadius: '15px', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={16} /> NOVIDADE
          </div>

          <QRCode 
            value={scanUrl} 
            size={280} 
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/logo.png",
              x: null,
              y: null,
              height: 60,
              width: 60,
              excavate: true,
            }}
          />
          
          <div style={{ marginTop: '1.5rem', color: '#333', fontWeight: 600, fontSize: '1.1rem' }}>
            Aponte a câmera do seu celular
          </div>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '15px', opacity: 0.7, fontSize: '0.9rem' }}>
          <div style={{ width: '40px', height: '1px', background: '#fff' }} />
          PRESENÇA DIGITAL • CRESCI E PERDI
          <div style={{ width: '40px', height: '1px', background: '#fff' }} />
        </div>
      </div>
    </div>
  );
}
