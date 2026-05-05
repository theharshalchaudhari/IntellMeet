import express from "express";

const router = express.Router();

router.get("/check-username", async (req, res) => {
  const username = req.query.u;

  // TODO: query DB
  res.json({ available: true });
});

export default router;