export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export const isSuperAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'superadmin') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Superadmin only.' });
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Admin access required.' });
};

export const isStaff = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Authentication required.' });
};
