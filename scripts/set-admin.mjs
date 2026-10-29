// Run from trusted terminal only: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/set-admin.mjs email@example.com
// To revoke: ... node scripts/set-admin.mjs email@example.com user
import {createClient} from '@supabase/supabase-js';
const [email,role='admin']=process.argv.slice(2);
if(!email||!['admin','user'].includes(role)){console.error('Usage: node scripts/set-admin.mjs <email> [admin|user]');process.exit(1)}
const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key){console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');process.exit(1)}
const sb=createClient(url,key,{auth:{persistSession:false}});
let page=1,target=null;
while(!target){const {data,error}=await sb.auth.admin.listUsers({page,perPage:1000});if(error)throw error;target=data.users.find(u=>u.email?.toLowerCase()===email.toLowerCase());if(target||data.users.length<1000)break;page++}
if(!target){console.error('Account not found. User must register first.');process.exit(1)}
const {error}=await sb.auth.admin.updateUserById(target.id,{app_metadata:{...target.app_metadata,role}});
if(error)throw error;console.log(`Updated ${email}: role=${role}`);
