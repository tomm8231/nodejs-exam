export const userCheck = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'USER') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};

export const adminCheck = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).send({ data: 'Access denied' });
  }
};

export const checkAuth = (req, res, next) => {
  if (req.path === '/auth/login') {
    return next();
  }

  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).send({ data: 'Unauthorised' });
};
