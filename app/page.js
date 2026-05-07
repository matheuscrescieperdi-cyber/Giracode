"use client";
import React from 'react';
import { QrCode, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PublicQRPage() {
  const [scanUrl, setScanUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setScanUrl(`${window.location.origin}/api/scan`);
    }
  }, []);

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
        <div style={{ width: '100px', height: '100px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Gira CODE" style={{ maxWidth: '100%', maxHeight: '100%', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Gira <span style={{ color: '#ffd600' }}>CODE</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '3rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Escaneie e participe das nossas ações! 🦒✨
        </p>

        <div style={{ 
          background: '#fff', 
          padding: '2rem', 
          borderRadius: '48px', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '-12px', right: '10%', background: '#ffd600', color: '#000', padding: '6px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <Sparkles size={14} /> NOVIDADE
          </div>

          <div style={{ padding: '10px', background: '#fff', borderRadius: '20px' }}>
            <QRCodeSVG 
              value={scanUrl} 
              size={260} 
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/logo.png",
                height: 50,
                width: 50,
                excavate: true,
              }}
            />
          </div>
          
          <div style={{ marginTop: '1.5rem', color: '#333', fontWeight: 600, fontSize: '1rem', opacity: 0.8 }}>
            Aponte a câmera do seu celular
          </div>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', opacity: 0.6, fontSize: '0.8rem', width: '100%' }}>
          <div style={{ width: '30px', height: '1px', background: '#fff' }} />
          PRESENÇA DIGITAL • CRESCI E PERDI
          <div style={{ width: '30px', height: '1px', background: '#fff' }} />
        </div>
      </div>
    </div>
  );
}
