import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('destination_url')
      .eq('id', 'main')
      .maybeSingle(); // Usar maybeSingle para evitar erro se não existir

    return NextResponse.json({ destinationUrl: data?.destination_url || 'https://google.com' });
  } catch (error) {
    return NextResponse.json({ destinationUrl: 'https://google.com', error: error.message });
  }
}

export async function POST(request) {
  try {
    const { destinationUrl } = await request.json();

    if (!destinationUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('config')
      .upsert({ id: 'main', destination_url: destinationUrl })
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Crash Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
