export const errorResponse = (res, message, status = 500) => {
  return res.status(status).json({ error: true, message }).end();
};

export const successResponse = (res, data, status = 200) => {
  return res.status(status).json({ error: false, data }).end();
};
