import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

const TABLES = {
  videosLongos: 'videos_longos',
  videosCurtos: 'videos_curtos',
  cortes: 'cortes',
  frases: 'frases',
  equipe: 'equipe',
  calendario: 'calendario',
  producao: 'producao',
}

export async function loadCollection(name) {
  const table = TABLES[name]
  if (!table) return null

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error loading ${name}:`, error)
    return null
  }

  return data || []
}

export async function addItem(name, item) {
  const table = TABLES[name]
  if (!table) return null

  const { data, error } = await supabase
    .from(table)
    .insert([{
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) {
    console.error(`Error adding to ${name}:`, error)
    return null
  }

  return data
}

export async function updateItem(name, id, updates) {
  const table = TABLES[name]
  if (!table) return null

  const { data, error } = await supabase
    .from(table)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating ${name}:`, error)
    return null
  }

  return data
}

export async function deleteItem(name, id) {
  const table = TABLES[name]
  if (!table) return null

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting from ${name}:`, error)
    return null
  }

  return true
}
