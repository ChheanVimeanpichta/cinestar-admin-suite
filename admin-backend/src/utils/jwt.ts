import jwt from 'jsonwebtoken';

export const signAdminToken = (payload: object) => {
  return jwt.sign(payload, process.env.ADMIN_JWT_SECRET ?? 'dev-secret');
};

export const verifyAdminToken = (token: string) => {
  return jwt.verify(token, process.env.ADMIN_JWT_SECRET ?? 'dev-secret');
};
