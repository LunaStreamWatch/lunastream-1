import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (req.method === "POST") {
      const clientIP = getClientIP(req);
      const hashedIP = await hashIP(clientIP);

      const { data: existingVisitor } = await supabase
        .from("unique_visitors")
        .select("id")
        .eq("ip_address", hashedIP)
        .maybeSingle();

      if (!existingVisitor) {
        const { error: insertError } = await supabase
          .from("unique_visitors")
          .insert({
            ip_address: hashedIP,
          });

        if (insertError) {
          throw insertError;
        }

        const { data: currentStats, error: fetchError } = await supabase
          .from("visitor_stats")
          .select("total_unique")
          .eq("id", 1)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const newCount = (currentStats?.total_unique || 0) + 1;

        const { error: updateError } = await supabase
          .from("visitor_stats")
          .update({
            total_unique: newCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", 1);

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            new_visitor: true,
            total: newCount,
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data: stats } = await supabase
        .from("visitor_stats")
        .select("total_unique")
        .eq("id", 1)
        .single();

      return new Response(
        JSON.stringify({
          success: true,
          new_visitor: false,
          total: stats?.total_unique || 0,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("visitor_stats")
        .select("total_unique")
        .eq("id", 1)
        .single();

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({
          success: true,
          total: data?.total_unique || 0,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
