import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icbputkucrvzbzhqhtca.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljYnB1dGt1Y3J2emJ6aHFodGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDY0MjksImV4cCI6MjA5MDg4MjQyOX0.x8dhww1Eqg8WtpuRFR2giQcMvJ4MX_hJju8UBZPkY34';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
    const username = 'testuser_' + Date.now();
    const password = 'password123';
    const email = `${username}@spark.local`;

    console.log(`Setting up user: ${username}`);

    // Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username },
        }
    });

    if (signUpError) {
        console.error('Sign Up Error:', signUpError.message);
        return;
    }
    console.log('Sign Up Data User ID:', signUpData?.user?.id);
    console.log('Sign Up Data Session:', signUpData?.session ? 'Exists' : 'Null');

    // Log in
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError) {
        console.error('Login Error:', loginError.message);
    } else {
        console.log('Login successful! Session:', loginData?.session ? 'Exists' : 'Null');
    }
}

testAuth();
