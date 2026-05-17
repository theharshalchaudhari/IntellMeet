import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { app } from "./app";

const PORT = process.env.PORT || 5000;

async function runSupabasePreflight() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend env");
    return;
  }

  const supabase = createClient(url, key);

  const { error } = await supabase.from("profiles").select("id").limit(1);

  if (error) {
    console.error("Supabase preflight failed for profiles table:", {
      code: error.code,
      message: error.message,
      hint: error.hint,
    });
    console.error(
      "Run SQL: GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;"
    );
    return;
  }

  console.log("Supabase preflight passed: service_role can access public.profiles");
}

runSupabasePreflight().finally(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});

