import { EXTENSION, TWITCH_BASE_EXTENSION_URL } from "../constants"
import { signToken } from "../TokenUtils"
import axios from "axios"

export async function setExtensionConfigured(
  channel_id: string,
) {
  const token = signToken(process.env['twitch_secret'] || '')

  let response = await axios({
    method: "PUT",
    url: `${TWITCH_BASE_EXTENSION_URL}/required_configuration?broadcaster_id=${channel_id}`,
    data: {
      required_configuration: EXTENSION.CONFIG_KEY,
      extension_id: EXTENSION.ID,
      extension_version: EXTENSION.VERSION
    },
    headers: {
      "Content-Type": "application/json",
      "Client-id": EXTENSION.ID,
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function setConfigurationService(channel_id: string, content: string) {
  const token = signToken(process.env['twitch_secret'] || '')

  let response = await axios({
    method: "PUT",
    url: `${TWITCH_BASE_EXTENSION_URL}/configurations`,
    data: {
      extension_id: EXTENSION.ID,
      segment: 'broadcaster',
      version: EXTENSION.VERSION,
      broadcaster_id: channel_id,
      content: content,
    },
    headers: {
      "Content-Type": "application/json",
      "Client-id": EXTENSION.ID,
      Authorization: `Bearer ${token}`,
    },
  })

  return response
}
