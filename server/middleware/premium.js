const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        if (user.isPremium) {
            // Check expiry
            if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) > new Date()) {
                req.isPremium = true;
                next();
            } else {
                // Expired
                user.isPremium = false;
                user.planType = null;
                user.subscriptionExpiry = null;
                await user.save();
                return res.status(403).json({ msg: 'Premium subscription expired', isPremium: false });
            }
        } else {
            return res.status(403).json({ msg: 'Premium subscription required', isPremium: false });
        }
    } catch (err) {
        console.error('Premium Middleware Error:', err);
        res.status(500).send('Server Error');
    }
};
