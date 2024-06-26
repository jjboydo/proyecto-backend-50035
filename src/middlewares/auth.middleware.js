const applyPolicy = (roles) => {
    return (req, res, next) => {
        if (roles[0].toUpperCase() === "PUBLIC") return next();
        if (!req.user) return res.status(401).send({ status: "error", error: "Unauthorized" });
        if (!roles.includes(req.user.role.toUpperCase())) return res.status(403).send({ status: "error", error: "No permissions" });
        next();
    }
}

export default applyPolicy;