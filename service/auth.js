import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const secret = "taniya!@#$";

function setUser(user) {
  return sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return verify(token, secret);
  } catch (error) {
    return null;
  }
}

export {
  setUser,
  getUser,
};
