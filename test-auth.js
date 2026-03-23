import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktppinbrnlmqbxajwhit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cHBpbmJybmxtcWJ4YWp3aGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Mjk1OTksImV4cCI6MjA3NzEwNTU5OX0.QwEu-ECL4ciDLZltgkiZNZ3UeKSH_afuCp2lIIEqfJ4';

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
        // Let's also check if user exists in the auth.users table if we can, 
        // but the anonymous key might not have access.
    } else {
        console.log('Login successful! Session:', loginData?.session ? 'Exists' : 'Null');
    }
}

testAuth();
