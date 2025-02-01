import User from '../models/User';
import validateEmail from '../functions/validateEmail';
import express from 'express';
import bcrypt from 'bcryptjs';
import withAuth, { withAdminAuth } from '../functions/withAuth';
import { v4 as uuidv4 } from 'uuid';
import Token from '../models/Token';

const user = express.Router({ mergeParams: true });

user.get('/', withAuth, async (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        admin: req.user.admin,
        createdAt: req.user.createdAt,
    });
});

user.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ message: 'Missing required information' });
        return;
    } else if (!validateEmail(email)) {
        res.status(400).json({ message: 'Invalid email' });
        return;
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
        res.status(400).json({ message: 'Account with this email already exists' });
        return;
    }

    const isUsername = await User.findOne({ username });
    if (isUsername) {
        res.status(400).json({ message: 'Username already in use' });
        return;
    }

    await User.create({ username, password: bcrypt.hashSync(password), email });
    res.json({ message: 'Account created' });
});

user.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Missing required information' });
        return;
    }

    const user = await User.findOne({ email });
    if (!user || !user.email || !user.password) {
        res.status(403).json({ message: 'Email or password isn\'t valid' });
        return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        res.status(403).json({ message: 'Email or password isn\'t valid' });
        return;
    }

    const token = uuidv4();
    await Token.create({ token, user: user._id });

    res.json({ token });
});

user.delete('/logout', withAuth, async (req, res) => {
    const token = req.token?.token;
    await Token.findOneAndDelete({ token });

    res.sendStatus(204);
});

export default user;