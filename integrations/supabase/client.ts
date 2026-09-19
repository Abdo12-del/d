import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cqynyfcpptlvibnqmfpq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_FpmVjjvsTnOxf4G7jAqGjA_9qF4x9nH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
