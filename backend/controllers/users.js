const User = require("../models/user");

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
        }
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            const { _id, username: regUsername, email: regEmail } = registeredUser;
            res.status(201).json({
                success: true,
                message: "User registered and logged in successfully!",
                user: { _id, username: regUsername, email: regEmail }
            });
        });
    } catch (err) {
        if (err.name === 'UserExistsError') {
             return res.status(400).json({ success: false, message: err.message });
        }
        next(err);
    }
};

module.exports.loginUser = (req, res) => {
    const { _id, username, email } = req.user;
     res.status(200).json({
        success: true,
        message: "Login successful!",
        user: { _id, username, email }
    });
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ success: true, message: "Logged out successfully!" });
    });
};