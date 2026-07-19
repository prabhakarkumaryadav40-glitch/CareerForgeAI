import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json(
        {
          error: "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("job_matcher_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return Response.json(data);
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        error: error.message || "Failed to fetch history.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        {
          error: "Report ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabaseAdmin
      .from("job_matcher_results")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
    });
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        error: error.message || "Failed to delete report.",
      },
      {
        status: 500,
      }
    );
  }
}