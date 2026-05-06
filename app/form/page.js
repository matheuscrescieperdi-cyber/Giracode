"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ChevronLeft, CheckCircle2, QrCode } from 'lucide-react';

const QUESTIONS = [
  { id: 'nome', label: 'Qual o seu nome completo?', type: 'text', placeholder: 'Digite seu nome aqui...', section: 'Dados Básicos' },
  { id: 'whatsapp', label: 'Seu WhatsApp (DDD + Número)', type: 'tel', placeholder: '(11) 99999-9999', section: 'Dados Básicos' },
  { id: 'email', label: 'E-mail para receber novidades', type: 'email', placeholder: 'seu@email.com', section: 'Dados Básicos' },
  { id: 'cep', label: 'Qual o seu CEP?', type: 'text', placeholder: '00000-000', section: 'Dados Básicos' },
  { 
    id: 'pequenos', 
    label: 'Quem são seus pequenos?', 
    type: 'select', 
    options: ['Menino(s)', 'Menina(s)', 'Menino(s) e menina(s)', 'Bebê a caminho', 'Outro'],
    section: 'Sobre sua família' 
  },
  { 
    id: 'fase', 
    label: 'Qual a fase do(a) caçula hoje?', 
    type: 'select', 
    options: ['Gestante', '0 a 12 meses', '1 a 3 anos', '4 a 6 anos', '7 a 10 anos', '11 a 16 anos', 'Não tenho filhos'],
    section: 'Sobre sua família'
  },
  { 
    id: 'escola', 
    label: 'Hoje ele(a) já vai para escola?', 
    type: 'select', 
    options: ['Pública (Municipal/Estadual)', 'Particular (Bairro)', 'Particular (Rede de Ensino)', 'Ainda não frequenta escola'],
    section: 'Sobre sua família'
  },
  { 
    id: 'relacao', 
    label: 'Qual é sua relação com a Cresci e Perdi hoje?', 
    type: 'select', 
    options: ['Já sou cliente e compro e ou vendo sempre', 'Já conheço e já fui algumas vezes', 'Conheço, mas ainda não visitei', 'Estou conhecendo agora'],
    section: 'Sua experiência'
  },
  { 
    id: 'origem', 
    label: 'Como você descobriu essa ação?', 
    type: 'select', 
    options: ['Instagram', 'Facebook', 'WhatsApp', 'Indicação de amiga/familiar', 'Vi na loja', 'Outro'],
    section: 'Sua experiência'
  },
  { 
    id: 'desapego', 
    label: 'O que você costuma fazer com as roupinhas que não servem mais?', 
    type: 'select', 
    options: ['Costumo vender ou desapegar com frequência', 'Às vezes vendo ou desapego', 'Ainda não faço, mas tenho interesse', 'Prefiro doar ou guardar', 'Outro'],
    section: 'Sua experiência'
  }
];

export default function SmartForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const currentQuestion = QUESTIONS[currentStep];

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (value) => {
    setFormData({ ...formData, [currentQuestion.id]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Registrar no Supabase
      const { error } = await supabase
        .from('leads')
        .insert([{ ...formData, created_at: new Date() }]);

      if (error) throw error;
      
      setIsFinished(true);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar no Supabase: ' + err.message);
      setIsFinished(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', padding: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={80} color="#3d5afe" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '10px' }}>Obrigado!</h1>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Suas respostas foram enviadas com sucesso. Em breve entraremos em contato com novidades!
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '30px' }}>
            Responder novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#fff', padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <img src="/logo.png" alt="Gira CODE" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
        <span style={{ fontWeight: 800, color: '#3d5afe', fontSize: '1.2rem' }}>Gira CODE</span>
      </header>

      {/* Progress Bar */}
      <div style={{ height: '6px', background: '#e0e0e0', width: '100%' }}>
        <div style={{ height: '100%', background: '#3d5afe', width: `${progress}%`, transition: 'width 0.4s ease' }} />
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', background: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ marginBottom: '10px', color: '#3d5afe', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {currentQuestion.section}
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', lineHeight: '1.3' }}>
            {currentQuestion.label}
          </h2>

          <div style={{ marginBottom: '40px' }}>
            {currentQuestion.type === 'select' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { handleChange(opt); setTimeout(handleNext, 300); }}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: `2px solid ${formData[currentQuestion.id] === opt ? '#3d5afe' : '#f0f0f0'}`,
                      background: formData[currentQuestion.id] === opt ? '#e8eaf6' : '#fff',
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type={currentQuestion.type}
                placeholder={currentQuestion.placeholder}
                value={formData[currentQuestion.id] || ''}
                onChange={(e) => handleChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                autoFocus
                style={{
                  fontSize: '1.4rem',
                  padding: '15px 0',
                  border: 'none',
                  borderBottom: '2px solid #3d5afe',
                  borderRadius: '0',
                  background: 'transparent',
                  width: '100%'
                }}
              />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={handleBack} 
              disabled={currentStep === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: currentStep === 0 ? '#ccc' : '#666', cursor: 'pointer', fontWeight: 500 }}
            >
              <ChevronLeft size={20} /> Voltar
            </button>

            {currentQuestion.type !== 'select' && (
              <button 
                className="btn-primary" 
                onClick={handleNext}
                disabled={!formData[currentQuestion.id]}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {currentStep === QUESTIONS.length - 1 ? 'Finalizar' : 'Próximo'} <ChevronRight size={20} />
              </button>
            )}
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
            Pergunta {currentStep + 1} de {QUESTIONS.length}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#999' }}>
        Cresci e Perdi &copy; 2026 - Protegido por Gira CODE
      </footer>

      <style jsx global>{`
        body { background: #f5f7fb !important; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}
