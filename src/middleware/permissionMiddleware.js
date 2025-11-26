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

export const hasPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        // Check user-specific permissions
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
