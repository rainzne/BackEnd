let User = require('../model/user');

// Login
function login(req, res) {
    const { username, password } = req.body;
    
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                role: user.role
            }
        });
    });
}

// Register
function register(req, res) {
    const { username, password, role } = req.body;
    
    let user = new User();
    user.username = username;
    user.password = password;
    user.role = role || 'user';
    
    user.save((err) => {
        if (err) {
            return res.status(400).send(err);
        }
        res.json({ message: 'User created successfully' });
    });
}

module.exports = { login, register };