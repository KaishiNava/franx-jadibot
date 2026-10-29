import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Franxx MD — Bot Dashboard', description: 'Kelola akun Franxx MD dengan dashboard yang simpel dan aman.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }
