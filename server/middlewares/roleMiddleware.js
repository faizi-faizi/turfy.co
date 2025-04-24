module.exports = (roles) => {
    return (req, res, next) => {
        console.log(req.user, "=== User Info");  // check the user object

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied, unauthorized role" })
        }

        next()
    }
}