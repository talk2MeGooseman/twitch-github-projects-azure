import { EXTENSION, TWITCH_BASE_EXTENSION_URL } from "../constants"
import { signToken } from "../TokenUtils"
import axios from "axios"

export async function setExtensionConfigured(
  channel_id: string,
) {
  const token = signToken(process.env['twitch-secret'] || '')

  let response = await axios({
    method: "PUT",
    url: `${TWITCH_BASE_EXTENSION_URL}/${EXTENSION.ID}/${EXTENSION.VERSION}/required_configuration?channel_id=${channel_id}`,
    data: {
      required_configuration: EXTENSION.CONFIG_KEY,
    },
    headers: {
      "Content-Type": "application/json",
      "Client-id": EXTENSION.ID,
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function setConfigurationService(channel_id: string, content: string) {
  const token = signToken(process.env['twitch-secret'] || '')

  let response = await axios({
    method: "PUT",
    url: `https://api.twitch.tv/extensions/${EXTENSION.ID}/configurations`,
    data: {
      segment: 'broadcaster',
      channel_id,
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
