import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Browser sends this before the real POST request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Represents the logged-in user calling the function
    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Privileged client — only exists inside Edge Function
    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError) {
      console.error("CREATE USER ERROR:", {
        message: userError.message,
        status: userError.status,
        code: userError.code,
      });

      return new Response(
        JSON.stringify({
          error: userError.message,
          status: userError.status,
          code: userError.code,
        }),
        {
          status: userError.status ?? 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Make sure person calling function is an Admin
    const { data: callerStaff, error: staffError } = await serviceClient
      .from("staff")
      .select("role")
      .eq("id", user.id)
      .single();

    if (staffError || callerStaff?.role !== "Admin") {
      return new Response(
        JSON.stringify({
          error: "Admin access required",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const body = await req.json();

    const {
      email,
      password,
      first_name,
      last_name,
      role,
      department_id,
      phone,
      salary,
      hire_date,
      status,
    } = body;

    // Create auth.users account
    const { data: authData, error: authError } =
      await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("AUTH CREATE ERROR:", authError);

      return new Response(
        JSON.stringify({
          error: authError.message,
        }),
        {
          status: authError.status ?? 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({
          error: "Auth user was not created.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const newUserId = authData.user.id;
    console.log("ATTEMPTING STAFF INSERT:", {
      id: newUserId,
      first_name,
      last_name,
      role,
      department_id,
      phone,
      email,
      salary,
      hire_date,
      status,
    });
    // Create matching staff row
    const { data: staffData, error: insertError } = await serviceClient
      .from("staff")
      .insert({
        id: newUserId,
        first_name,
        last_name,
        role,
        department_id: department_id || null,
        phone: phone || null,
        email,
        salary,
        hire_date,
        status,
      })
      .select()
      .single();

    if (insertError) {
      console.error("STAFF INSERT FAILED:");
      console.error(insertError);

      await serviceClient.auth.admin.deleteUser(newUserId);

      throw new Error(insertError.message);
    }

    return new Response(
      JSON.stringify({
        staff: staffData,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("create-staff error:", message);

    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
