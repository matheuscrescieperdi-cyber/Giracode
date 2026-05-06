import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { data: config, error } = await supabase
      .from('config')
      .select('destination_url')
      .eq('id', 'main')
      .maybeSingle();

    let destination = config?.destination_url || 'https://google.com';
    
    // Garantir que a URL seja absoluta
    if (destination.startsWith('/')) {
      destination = new URL(destination, request.url).toString();
    }

    return NextResponse.redirect(destination);
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.redirect(new URL('https://google.com', request.url));
  }
}
