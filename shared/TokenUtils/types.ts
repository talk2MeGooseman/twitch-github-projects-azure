export interface DecodedTwitchToken {
  "exp": number,
  "user_id": string,
  "opaque_user_id"?: string,
  "channel_id": string,
  "role": "broadcaster" | "moderator" | "viewer" | "external",
  "is_unlinked"?: "true" | "false",
  "pubsub_perms"?: {
    "listen"?: Array<string>,
    "send"?: Array<string>
  }
}

export interface ServerTwitchToken {
  "exp"?: number,
  "user_id": string,
  "opaque_user_id"?: string,
  "channel_id"?: string,
  "role": "broadcaster" | "moderator" | "viewer" | "external",
  "is_unlinked"?: "true" | "false",
  "pubsub_perms"?: {
    "listen"?: Array<string>,
    "send"?: Array<string>
  }
}
