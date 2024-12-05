const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient(
    global.config.get('SUPABASE_URL'),
    global.config.get('SUPABASE_KEY'),
)

module.exports = supabase;