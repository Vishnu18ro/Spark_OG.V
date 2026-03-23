
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('Testing connection to Supabase...')
    const { data, error } = await supabase.from('users').select('username').limit(1)

    if (error) {
        console.error('Connection error:', error.message)
        console.error('Code:', error.code)
    } else {
        console.log('Successfully connected to Supabase!')
        console.log('Sample data count:', data.length)
    }
}

testConnection()
