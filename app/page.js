"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function PublicQRPage() {
  const [scanUrl, setScanUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setScanUrl(`${window.location.origin}/api/scan`);
    }
  }, []);

  return (
    <div className="container">
      {/* Círculos de fundo decorativos */}
      <div className="bg-circle circle-1" />
      <div className="bg-circle circle-2" />

      <div className="content">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="Gira CODE" className="main-logo" />
        </div>
        
        <h1 className="title">
          Gira <span className="highlight">CODE</span>
        </h1>
        <p className="subtitle">
          Escaneie e participe das nossas ações! 🦒✨
        </p>

        <div className="qr-card">
          <div className="badge">
            <Sparkles size={14} /> NOVIDADE
          </div>

          <div className="qr-wrapper">
            <QRCodeSVG 
              value={scanUrl || "https://giracode.vercel.app"} 
              size={240} 
              level="H"
              includeMargin={false}
              className="qr-code"
              imageSettings={{
                src: "/logo.png",
                height: 45,
                width: 45,
                excavate: true,
              }}
            />
          </div>
          
          <p className="instruction">
            Aponte a câmera do seu celular
          </p>
        </div>

        <div className="footer-line">
          <div className="line" />
          <span>PRESENÇA DIGITAL • CRESCI E PERDI</span>
          <div className="line" />
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #3d5afe 0%, #304ffe 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #fff;
          text-align: center;
          overflow: hidden;
          position: relative;
          font-family: sans-serif;
        }

        .bg-circle {
          position: absolute;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          z-index: 0;
        }

        .circle-1 { top: -10%; left: -10%; width: 40vw; height: 40vw; }
        .circle-2 { bottom: -10%; right: -10%; width: 30vw; height: 30vw; }

        .content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 500px;
        }

        .logo-wrapper {
          width: 90px;
          height: 90px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 50%;
          padding: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          border: 3px solid rgba(255,255,255,0.3);
        }

        .main-logo {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
        }

        .title {
          font-size: clamp(2rem, 8vw, 3rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }

        .highlight { color: #ffd600; }

        .subtitle {
          font-size: clamp(0.9rem, 4vw, 1.2rem);
          opacity: 0.9;
          margin-bottom: 2.5rem;
          font-weight: 500;
        }

        .qr-card {
          background: #fff;
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: auto;
          max-width: 90vw;
        }

        .badge {
          position: absolute;
          top: -12px;
          background: #ffd600;
          color: #000;
          padding: 6px 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          right: 20px;
        }

        .qr-wrapper {
          padding: 10px;
          background: #fff;
          border-radius: 15px;
        }

        :global(.qr-code) {
          max-width: 100%;
          height: auto !important;
        }

        .instruction {
          margin-top: 1.2rem;
          color: #333;
          font-weight: 600;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .footer-line {
          margin-top: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          opacity: 0.6;
          font-size: 0.7rem;
          width: 100%;
          letter-spacing: 1px;
        }

        .line { width: 20px; height: 1px; background: #fff; }

        @media (max-width: 480px) {
          .qr-card { padding: 1.5rem; border-radius: 32px; }
          .logo-wrapper { width: 60px; height: 60px; }
          .title { margin-bottom: 0.2rem; }
          .subtitle { margin-bottom: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
