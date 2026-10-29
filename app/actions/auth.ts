'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  if (!email || !password) redirect('/login?error=Lengkapi%20email%20dan%20password');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect('/login?error=Email%20atau%20password%20tidak%20valid');
  redirect('/dashboard');
}
export async function signUp(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const name = String(formData.get('name') || '').trim();
  if (!email || password.length < 8 || !name) redirect('/register?error=Isi%20semua%20kolom%20dan%20gunakan%20password%20minimal%208%20karakter');
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name }, emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/dashboard` } });
  if (error) redirect('/register?error=Gagal%20mendaftar.%20Periksa%20email%20atau%20pengaturan%20Supabase');
  redirect('/login?message=Cek%20email%20untuk%20konfirmasi%20akun%20jika%20verifikasi%20email%20aktif');
}
export async function resetPassword(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  if (!email) redirect('/forgot-password?error=Masukkan%20email');
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/settings` });
  redirect('/forgot-password?message=Jika%20email%20terdaftar,%20instruksi%20reset%20akan%20dikirim');
}
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login?message=Kamu%20sudah%20logout');
}
