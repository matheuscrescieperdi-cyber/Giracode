import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // Rotas que exigem autenticação (Área Administrativa)
  const isAdminPath = pathname.startsWith('/admin');
  
  // Se for uma rota de admin e não tiver sessão, redireciona para login
  if (isAdminPath) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Se já estiver logado e tentar ir para login, manda para o admin
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|form|logo.png).*)',
  ],
};
