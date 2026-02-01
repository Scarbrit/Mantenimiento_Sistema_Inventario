// Función factory centralizada para verificación de roles
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Si no se especifican roles, solo verificar autenticación
    if (allowedRoles.length === 0) {
      return next();
    }

    // Superadmin tiene acceso a todo
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    res.status(403).json({ message: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
  };
};

// Mantener compatibilidad con código existente
export const isAuthenticated = requireRole();
export const isSuperAdmin = requireRole('superadmin');
export const isAdmin = requireRole('admin', 'superadmin');
export const isStaff = requireRole(); // Equivalente a isAuthenticated
