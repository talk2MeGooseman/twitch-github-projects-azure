const jwt = require('jsonwebtoken');
import { DecodedTwitchToken, ServerTwitchToken } from './types';
import { EXTENSION } from '../constants';

export function decodeToken(token: string, secret: string | undefined) : DecodedTwitchToken {
  if (secret === undefined) {
    throw new Error('Not secret provided')
  }

  const secret_decoded = new Buffer(secret, 'base64')
  return <DecodedTwitchToken> jwt.verify(token, secret_decoded)
}

export function verifyToken(token: any, secret: any) {
  const decoded = decodeToken(token, secret);

  if (decoded.role !== 'broadcaster') throw Error('Must be broadcaster role.')

  return decoded;
}

export function signToken(secret: string) {
  const secret_decoded = new Buffer(secret, 'base64');
  const tokenObj : ServerTwitchToken = {
    "user_id": EXTENSION.USER_ID,
    "role": "external"
  };

  return jwt.sign(tokenObj, secret_decoded, {
    expiresIn: '1h'
  });
}

export function signChannelMessageToken(channel_id: string, secret: string) {
  const secret_decoded = new Buffer(secret, 'base64');
  const tokenObj : ServerTwitchToken = {
    "user_id": EXTENSION.USER_ID,
    "role": "external",
    "channel_id": channel_id,
    "pubsub_perms": {
      "send": [
        "broadcast"
      ]
    }
  };

  return jwt.sign(tokenObj, secret_decoded, {
    expiresIn: '1h'
  });
}
