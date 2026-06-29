import { AccessToken } from "livekit-server-sdk";

import { env } from "@/config/env";

type LiveKitTokenOptions = {
  roomName: string;
  identity: string;
  participantName: string;
  metadata: Record<string, unknown>;
  canPublish?: boolean;
  canSubscribe?: boolean;
  canPublishData?: boolean;
  canUpdateOwnMetadata?: boolean;
};

export const createLiveKitAccessToken = async ({
  roomName,
  identity,
  participantName,
  metadata,
  canPublish = true,
  canSubscribe = true,
  canPublishData = true,
  canUpdateOwnMetadata = true,
}: LiveKitTokenOptions) => {
  console.log("========== LIVEKIT SERVICE ==========");

  console.log({
    LIVEKIT_URL: env.LIVEKIT_URL,
    LIVEKIT_API_KEY: env.LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET_LENGTH: env.LIVEKIT_API_SECRET.length,
    roomName,
    identity,
  });

  const token = new AccessToken(
    env.LIVEKIT_API_KEY,
    env.LIVEKIT_API_SECRET,
    {
      identity,
      name: participantName,
      metadata: JSON.stringify(metadata),
    },
  );

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish,
    canSubscribe,
    canPublishData,
    canUpdateOwnMetadata,
  });

  const jwt = await token.toJwt();

  console.log("JWT generated:", jwt.substring(0, 60) + "...");
  

  return jwt;
};