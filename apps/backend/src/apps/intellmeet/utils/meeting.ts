import crypto from "node:crypto";

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const SLUG_PART_LENGTH = 4;
const SLUG_PARTS = 3;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 64) || "meeting";

const generateSlugPart = () =>
  Array.from({ length: SLUG_PART_LENGTH }, () =>
    SLUG_ALPHABET[crypto.randomInt(SLUG_ALPHABET.length)],
  ).join("");

export const createMeetingSlug = () =>
  Array.from({ length: SLUG_PARTS }, generateSlugPart).join("-");

export const createChannelSlug = (name: string) =>
  slugify(name);

export const createRoomName = (meetingSlug: string) =>
  `lk-${meetingSlug}`;