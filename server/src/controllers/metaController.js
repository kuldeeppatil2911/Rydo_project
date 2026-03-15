import { getMetaPayload } from "../services/tripService.js";

export async function getMeta(req, res, next) {
  try {
    const data = await getMetaPayload();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
