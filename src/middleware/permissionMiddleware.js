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
        if (!req.user || !req.user.Role || !req.user.Role.Permissions) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }

        const userPermissions = req.user.Role.Permissions.map(p => p.name);

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: `You need the '${requiredPermission}' permission to perform this action`,
            });
        }

        next();
    };
};
