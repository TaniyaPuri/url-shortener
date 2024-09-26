import { v4 as uuidv4 } from "uuid";
import { create, findOne } from "../models/user";
import { setUser } from "../service/auth";

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await findOne({ email, password });

  if (!user)
    return res.render("login", {
      error: "invalid Username or Password",
    });

  const token = setUser(user);
  res.cookie("token", token);
  res.cookie("uid", token);
  return res.redirect("/");
}

export default {
  handleUserSignup,
  handleUserLogin,
};
