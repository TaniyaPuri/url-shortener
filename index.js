import express, { json, urlencoded } from "express";
import { resolve } from "path";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./connect.js";
import { checkForAuthentication, restrictTo } from "./middlewares/auth.js";

import {URL} from "./models/url.js";

//routes
import {urlRoute} from "./routes/url.js";
import {router} from "./routes/staticRouter.js";
import {userRoute} from "./routes/user.js";

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("connected to MongoDB")
);

app.set("view engine", "ejs");
app.set("views", resolve("./views"));

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", router);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true } // Return the updated document
  );

  if (!entry) {
    return res.status(404).json({ error: "URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`SERVER started on PORT: ${PORT}`));
