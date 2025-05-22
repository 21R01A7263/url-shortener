import { nanoid } from "nanoid";

export const generateNanoId = (length) => {
    return nanoid(length);
}

export function sendBadRequest(res, error) {
  return res.status(400).json({ error });
}

export function sendServerError(res, error) {
  return res.status(500).json({ error });
}