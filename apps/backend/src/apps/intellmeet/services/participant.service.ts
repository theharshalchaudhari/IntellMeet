import { supabaseAdmin } from "@wraith/auth/server";

import type { MeetingRole } from "@/apps/intellmeet/types/meeting";

export const upsertParticipantJoin = async ({
  meetingId,
  userId,
  role,
}: {
  meetingId: string;
  userId: string;
  role: MeetingRole;
}) => {
  const now = new Date().toISOString();

  const result = await supabaseAdmin
    .from("meeting_participants")
    .upsert(
      {
        meeting_id: meetingId,
        user_id: userId,
        role,
        joined_at: now,
        left_at: null,
      },
      {
        onConflict: "meeting_id,user_id",
      },
    )
    .select();

  console.log("========== PARTICIPANT UPSERT ==========");
  console.dir(result, { depth: null });

  return result;
};

export const markParticipantLeft = async ({
  meetingId,
  userId,
}: {
  meetingId: string;
  userId: string;
}) => {
  const result = await supabaseAdmin
    .from("meeting_participants")
    .update({
      left_at: new Date().toISOString(),
    })
    .eq("meeting_id", meetingId)
    .eq("user_id", userId)
    .is("left_at", null);

  console.log("========== PARTICIPANT LEAVE ==========");
  console.dir(result, { depth: null });

  return result;
};