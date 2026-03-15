import User from "../models/User.js";

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    res.json({ data: req.user });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required." });
    }
    const { name, phone, emergencyContact, emergencyAlertsEnabled } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (emergencyAlertsEnabled !== undefined) updates.emergencyAlertsEnabled = Boolean(emergencyAlertsEnabled);
    if (emergencyContact !== undefined) {
      updates.emergencyContact = emergencyContact === null || (typeof emergencyContact === "object" && !emergencyContact?.name && !emergencyContact?.phone && !emergencyContact?.email)
        ? null
        : {
            name: String(emergencyContact.name || "").trim(),
            phone: String(emergencyContact.phone || "").trim(),
            email: String(emergencyContact.email || "").trim().toLowerCase()
          };
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    if (!user) return res.status(404).json({ message: "User not found." });
    delete user.password;
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}
