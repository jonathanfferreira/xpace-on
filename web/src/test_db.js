const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const { data: p, error: pe } = await supabase.from('profiles').select('*').limit(1);
    console.log("Profiles:", Object.keys(p && p.length ? p[0] : {}).join(', '));
    const { data: vw, error: vwe } = await supabase.from('leaderboard_global').select('*').limit(1);
    console.log("Leaderboard Global:", Object.keys(vw && vw.length ? vw[0] : {}).join(', '));
    const { data: p2, error: pe2 } = await supabase.from('user_profiles').select('*').limit(1);
    console.log("User Profiles:", Object.keys(p2 && p2.length ? p2[0] : {}).join(', '));
}
run();
