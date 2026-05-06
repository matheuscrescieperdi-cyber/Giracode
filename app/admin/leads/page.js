"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, MessageCircle, Mail, MapPin, Calendar, Flame, IceCream, ThermometerSun } from 'lucide-react';

export default function LeadsKanban() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setLeads(data);
    setLoading(false);
  };

  const getTemperature = (lead) => {
    // Lógica de qualificação baseada nas respostas
    if (lead.relacao?.includes('Já sou cliente') || lead.desapego?.includes('frequência')) {
      return { label: 'Quente', color: '#ff5252', icon: <Flame size={14} /> };
    }
    if (lead.relacao?.includes('Já conheço') || lead.origem?.includes('Indicação')) {
      return { label: 'Morna', color: '#ffab40', icon: <ThermometerSun size={14} /> };
    }
    return { label: 'Fria', color: '#448aff', icon: <IceCream size={14} /> };
  };

  const columns = [
    { id: 'Fria', title: 'Leads Frios', color: '#448aff' },
    { id: 'Morna', title: 'Leads Mornos', color: '#ffab40' },
    { id: 'Quente', title: 'Leads Quentes', color: '#ff5252' },
  ];

  if (loading) return <div style={{ padding: '2rem' }}>Carregando leads...</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Gestão de Leads (Kanban)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Qualificação automática baseada no comportamento do cliente
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        flex: 1,
        overflowX: 'auto',
        paddingBottom: '2rem'
      }}>
        {columns.map(col => (
          <div key={col.id} style={{ background: '#f8f9fa', borderRadius: '16px', padding: '1rem', minHeight: '500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: col.color }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{col.title}</h3>
              <span style={{ fontSize: '0.8rem', color: '#999', marginLeft: 'auto' }}>
                {leads.filter(l => getTemperature(l).label === col.id).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leads
                .filter(lead => getTemperature(lead).label === col.id)
                .map(lead => {
                  const temp = getTemperature(lead);
                  return (
                    <div key={lead.id} className="card" style={{ padding: '1rem', border: '1px solid #eee', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase', 
                          color: temp.color, 
                          background: `${temp.color}15`, 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {temp.icon} {temp.label}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#999' }}>
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#666" /> {lead.nome}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#666' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MessageCircle size={14} /> {lead.whatsapp}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={14} /> {lead.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={14} /> {lead.fase}
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px dashed #eee', fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}>
                        "{lead.origem}"
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
