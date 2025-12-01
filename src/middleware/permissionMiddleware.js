export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.Role || !roles.includes(req.user.Role.name)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }
        next();
    };
};

// Check for a single permission
export const hasPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        // Check user-specific permissions from database
        if (req.user.Permissions && req.user.Permissions.length > 0) {
            const userSpecificPermissions = req.user.Permissions.map(p => p.name);
            if (userSpecificPermissions.includes(requiredPermission)) {
                return next();
            }
        }

        return res.status(403).json({
            success: false,
            message: `You need the '${requiredPermission}' permission to perform this action`,
        });
    };
};

// Check if user has ALL of the specified permissions (AND logic)
export const hasAllPermissions = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        // Check user-specific permissions from database
        if (req.user.Permissions && req.user.Permissions.length > 0) {
            const userPermissions = req.user.Permissions.map(p => p.name);

            // Check if user has ALL required permissions
            const hasAll = requiredPermissions.every(perm =>
                userPermissions.includes(perm)
            );

            if (hasAll) {
                return next();
            }
        }

        return res.status(403).json({
            success: false,
            message: `You need all of these permissions: ${requiredPermissions.join(', ')}`,
        });
    };
};

// Check if user has ANY of the specified permissions (OR logic)
export const hasAnyPermission = (...requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        // Check user-specific permissions from database
        if (req.user.Permissions && req.user.Permissions.length > 0) {
            const userPermissions = req.user.Permissions.map(p => p.name);

            // Check if user has ANY of the required permissions
            const hasAny = requiredPermissions.some(perm =>
                userPermissions.includes(perm)
            );

            if (hasAny) {
                return next();
            }
        }

        return res.status(403).json({
            success: false,
            message: `You need at least one of these permissions: ${requiredPermissions.join(', ')}`,
        });
    };
};
