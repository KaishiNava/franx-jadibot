'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export async function saveSettings(formData:FormData){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/login');const display_name=String(formData.get('displayName')||'').trim();const botName=String(formData.get('botName')||'').trim();const prefix=String(formData.get('prefix')||'').trim();const ownerName=String(formData.get('ownerName')||'').trim();const ownerNumber=String(formData.get('ownerNumber')||'').trim();
const pairingNumber=String(formData.get('pairingNumber')||'').trim();
const bannerUrl=String(formData.get('bannerUrl')||'').trim();
const bannerType=String(formData.get('bannerType')||'image').trim();
const nameBanner=String(formData.get('nameBanner')||'').trim();if(!display_name||!botName||!prefix||!ownerName||display_name.length>50||botName.length>40||prefix.length>5||ownerName.length>50||ownerNumber.length>20||pairingNumber.length>20||bannerUrl.length>1000||nameBanner.length>1000||!['image','video'].includes(bannerType))redirect('/settings?error=Periksa%20kembali%20kolom%20yang%20diisi');const {error}=await supabase.auth.updateUser({data:{display_name,bot_config:{...((user.user_metadata?.bot_config)||{}),botName,prefix,ownerName,ownerNumber,pairingNumber,bannerUrl,bannerType,nameBanner}}});if(error)redirect('/settings?error=Gagal%20menyimpan%20pengaturan');redirect('/settings?message=Pengaturan%20berhasil%20disimpan');}
