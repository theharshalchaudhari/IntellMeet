import express from "express";

const router = express.Router();

router.get("/check-username", async (req, res) => {
  const username = req.query.u;

  res.json({ available: true });
});

export default router;