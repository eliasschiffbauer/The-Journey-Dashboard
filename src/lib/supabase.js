import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Load dashboard data for a user
export async function loadDashboardData(userId) {
  const { data, error } = await supabase
    .from('dashboard_data')
    .select('data')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Load error:', error)
    return null
  }
  return data?.data ?? null
}

// Save dashboard data for a user (upsert)
export async function saveDashboardData(userId, dashboardData) {
  const { error } = await supabase
    .from('dashboard_data')
    .upsert(
      { user_id: userId, data: dashboardData, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  if (error) console.error('Save error:', error)
}

// Delete dashboard data for a user
export async function deleteDashboardData(userId) {
  const { error } = await supabase
    .from('dashboard_data')
    .delete()
    .eq('user_id', userId)

  if (error) console.error('Delete error:', error)
}
