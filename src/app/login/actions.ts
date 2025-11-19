// src/app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { headers } from 'next/headers';

// --- LOGIN PINTAR (Smart Redirect) ---
export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Login ke Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Login gagal. Periksa email/password.')
  }

  // 2. Cek Role User di Database
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    revalidatePath('/', 'layout')

    // 3. Redirect Berdasarkan Role
    if (profile?.role === 'admin') {
      return redirect('/admin')
    } else if (profile?.role === 'partner') {
      return redirect('/partner')
    } else {
      return redirect('/') // User biasa ke Home
    }
  }

  // Default fallback
  redirect('/')
}

// --- REGISTER (DAFTAR) ---
export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (authError) {
    return redirect('/login?message=Gagal daftar: ' + authError.message)
  }

  // Update profil tambahan
  if (authData.user) {
    await supabase
      .from('profiles')
      .update({
        phone_number: phone,
        address: address
      })
      .eq('id', authData.user.id)
  }

  revalidatePath('/', 'layout')
  // User baru daftar biasanya role-nya masih 'user', jadi ke home saja
  redirect('/') 
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // Setelah sukses login di Google, user dilempar ke route callback kita
      redirectTo: `${origin}/auth/callback`, 
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect('/login?message=Gagal koneksi ke Google')
  }

  if (data.url) {
    redirect(data.url) // Redirect user ke halaman Login Google
  }
}

// --- LOGOUT ---
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}