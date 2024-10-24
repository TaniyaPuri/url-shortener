const express = require("express");
const { handleGenerateNewShortURL, handleGetAnalytics } =
  require("../controllers/url").default;

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;

export default router;

