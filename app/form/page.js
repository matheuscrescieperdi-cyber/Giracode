"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

// Versão 1.2 - Correção de lógica e cache
const QUESTIONS_TEMPLATE = [
  { 
    id: 'nome', 
    label: 'Para começar, qual o seu nome completo?', 
    type: 'text', 
    placeholder: 'Digite seu nome aqui...', 
    section: 'Dados Básicos',
    autoComplete: 'name'
  },
  { 
    id: 'parentesco', 
    label: 'Qual o seu parentesco com os pequenos?', 
    type: 'select', 
    options: ['Mãe', 'Pai', 'Avó / Avô', 'Tia / Tio', 'Outro'],
    section: 'Dados Básicos'
  },
  { 
    id: 'whatsapp', 
    label: 'Qual o seu WhatsApp com DDD?', 
    type: 'tel', 
    placeholder: '(00) 00000-0000', 
    section: 'Dados Básicos',
    mask: 'phone',
    autoComplete: 'tel'
  },
  { 
    id: 'email', 
    label: 'Qual o seu melhor e-mail?', 
    type: 'email', 
    placeholder: 'exemplo@email.com', 
    section: 'Dados Básicos',
    autoComplete: 'email'
  },
  { 
    id: 'cep', 
    label: 'Qual o seu CEP?', 
    type: 'text', 
    placeholder: '00000-000', 
    section: 'Dados Básicos',
    mask: 'cep',
    autoComplete: 'postal-code'
  },
  { 
    id: 'qtd_filhos', 
    label: 'Quantos filhos você tem?', 
    type: 'select', 
    options: ['1 filho', '2 filhos', '3 ou mais', 'Bebê a caminho', 'Ainda não tenho filhos'],
    section: 'Sobre sua família' 
  },
  { 
    id: 'sexo_filhos', 
    label: 'Qual o sexo?', 
    type: 'select', 
    options: [], 
    section: 'Sobre sua família'
  },
  { 
    id: 'fase', 
    label: 'Qual a idade do seu filho(a) mais novo(a)?', 
    type: 'select', 
    options: ['Gestante', '0 a 12 meses', '1 a 3 anos', '4 a 6 anos', '7 a 10 anos', '11 a 16 anos', 'Não tenho filhos'],
    section: 'Sobre sua família'
  },
  { 
    id: 'escola', 
    label: 'O seu filho(a) já frequenta a escola?', 
    type: 'select', 
    options: ['Sim, Escola Pública', 'Sim, Escola Particular', 'Ainda não frequenta escola'],
    section: 'Sobre sua família'
  },
  { 
    id: 'relacao', 
    label: 'Você já conhece a Cresci e Perdi?', 
    type: 'select', 
    options: ['Sim, compro e vendo sempre', 'Sim, já fui algumas vezes', 'Conheço, mas nunca fui', 'Não conheço ainda'],
    section: 'Sua experiência'
  },
  { 
    id: 'origem', 
    label: 'Como você nos encontrou?', 
    type: 'select', 
    options: ['Instagram', 'Facebook', 'WhatsApp', 'Indicação', 'Vi a loja física', 'Outro'],
    section: 'Sua experiência'
  },
  { 
    id: 'desapego', 
    label: 'Você já desapegou (vendeu) na Cresci e Perdi?', 
    type: 'select', 
    options: ['Sim, já vendi várias vezes', 'Sim, já vendi uma vez', 'Ainda não, mas tenho interesse', 'Prefiro doar ou guardar'],
    section: 'Sua experiência'
  }
];

export default function SmartForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState('');

  // Lógica de visibilidade e labels dinâmicos
  const visibleQuestions = QUESTIONS_TEMPLATE.filter(q => {
    if (q.id === 'sexo_filhos') {
      const qtd = formData.qtd_filhos;
      return qtd === '1 filho' || qtd === '2 filhos' || qtd === '3 ou mais';
    }
    return true;
  }).map(q => {
    if (q.id === 'sexo_filhos') {
      const qtd = formData.qtd_filhos;
      if (qtd === '1 filho') {
        return {
          ...q,
          label: 'É um menino ou uma menina?',
          options: ['Menino', 'Menina']
        };
      } else {
        return {
          ...q,
          label: 'Quais os sexos dos pequenos?',
          options: ['Apenas Meninos', 'Apenas Meninas', 'Meninos e Meninas']
        };
      }
    }
    return q;
  });

  const activeQuestion = visibleQuestions[currentStep] || visibleQuestions[0];
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100;

  const maskPhone = (value) => {
    let clean = value.replace(/\D/g, '');
    if (clean.startsWith('55') && clean.length > 10) {
      clean = clean.substring(2);
    }
    clean = clean.substring(0, 11);
    if (clean.length <= 10) {
      return clean.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return clean.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  const maskCEP = (value) => {
    return value.replace(/\D/g, '').substring(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  };

  const validate = () => {
    const value = formData[activeQuestion.id] || '';
    if (activeQuestion.type === 'select') return true;
    if (!value) return false;
    if (activeQuestion.id === 'email') {
      const re = /\S+@\S+\.\S+/;
      if (!re.test(value)) { setError('Por favor, insira um e-mail válido.'); return false; }
    }
    if (activeQuestion.id === 'whatsapp') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) { setError('Insira o número completo com DDD.'); return false; }
    }
    if (activeQuestion.id === 'cep') {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 8) { setError('O CEP deve ter 8 números.'); return false; }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validate()) {
      if (currentStep < visibleQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
        setError('');
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleChange = (value) => {
    let formattedValue = value;
    if (activeQuestion.mask === 'phone') formattedValue = maskPhone(value);
    if (activeQuestion.mask === 'cep') formattedValue = maskCEP(value);
    setFormData({ ...formData, [activeQuestion.id]: formattedValue });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ ...formData, created_at: new Date() }]);
      if (error) throw error;
      setIsFinished(true);
    } catch (err) {
      console.error('Erro ao salvar:', err);
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '10px' }}>Pronto!</h1>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Suas respostas foram enviadas. Agora é só aguardar que entraremos em contato com você!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#fff', padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <span style={{ fontWeight: 800, color: '#3d5afe', fontSize: '1.2rem' }}>Gira CODE</span>
      </header>

      <div style={{ height: '6px', background: '#e0e0e0', width: '100%' }}>
        <div style={{ height: '100%', background: '#3d5afe', width: `${progress}%`, transition: 'width 0.4s ease' }} />
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', background: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', position: 'relative' }}>
          
          <div style={{ marginBottom: '10px', color: '#3d5afe', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {activeQuestion.section}
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '30px', lineHeight: '1.3', color: '#1a1a1a' }}>
            {activeQuestion.label}
          </h2>

          <div style={{ marginBottom: '40px' }}>
            {activeQuestion.type === 'select' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { 
                      setFormData({ ...formData, [activeQuestion.id]: opt });
                      setTimeout(handleNext, 300); 
                    }}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: `2px solid ${formData[activeQuestion.id] === opt ? '#3d5afe' : '#f0f0f0'}`,
                      background: formData[activeQuestion.id] === opt ? '#e8eaf6' : '#fff',
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
              <div style={{ position: 'relative' }}>
                <input
                  type={activeQuestion.type}
                  name={activeQuestion.id}
                  autoComplete={activeQuestion.autoComplete || 'off'}
                  placeholder={activeQuestion.placeholder}
                  value={formData[activeQuestion.id] || ''}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  autoFocus
                  style={{
                    fontSize: '1.4rem',
                    padding: '15px 0',
                    border: 'none',
                    borderBottom: `2px solid ${error ? '#ff5252' : '#3d5afe'}`,
                    borderRadius: '0',
                    background: 'transparent',
                    width: '100%',
                    color: '#1a1a1a'
                  }}
                />
                {error && (
                  <div style={{ color: '#ff5252', fontSize: '0.85rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handleBack} disabled={currentStep === 0} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: currentStep === 0 ? '#ccc' : '#666', cursor: 'pointer', fontWeight: 500 }}>
              <ChevronLeft size={20} /> Voltar
            </button>
            {activeQuestion.type !== 'select' && (
              <button className="btn-primary" onClick={handleNext} disabled={!formData[activeQuestion.id] || isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Enviando...' : (currentStep === visibleQuestions.length - 1 ? 'Finalizar' : 'Próximo')} <ChevronRight size={20} />
              </button>
            )}
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
            Pergunta {currentStep + 1} de {visibleQuestions.length}
          </div>
        </div>
      </main>
      <footer style={{ padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#999' }}>
        Cresci e Perdi &copy; 2026 - Protegido por Gira CODE
      </footer>
      <style jsx global>{`
        body { background: #f5f7fb !important; font-family: sans-serif; }
        input:focus { outline: none; }
        .btn-primary { background: #3d5afe; color: #fff; padding: 12px 24px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #304ffe; }
        .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
