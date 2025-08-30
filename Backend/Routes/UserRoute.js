const express = require('express');
const router = express.Router();
const prisma = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { nanoid } = require('nanoid');
const TokenVerification = require('../middleware/TokenVerification.js');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id }, jwtSecret);
        return res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/signup', async (req, res) => {
    const { email, name, password, inviteToken } = req.body;
    try {
        // checking for invite token valid or not
        const invite = await prisma.invite.findUnique({ where: { token: inviteToken } });

        if (!invite) return res.status(400).json({ error: 'Invalid invite token' });
        if (invite.used) return res.status(400).json({ error: 'Invite token already used' });
        if (invite.expiresAt < new Date()) return res.status(400).json({ error: 'Invite token expired' });
        if (invite.email !== email) return res.status(400).json({ error: 'Invite email mismatch' });


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hash
            }
        })
        const token = jwt.sign({ id: newUser.id }, jwtSecret);
        return res.status(200).json({ token });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json(err);
    }
})


//  send invite link

router.post('/send-invite', TokenVerification, async (req, res) => {
    const { email } = req.body;
    const adminId = req.user.id;
    // generate unique token
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry

    try {
        const admin = await prisma.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const invite = await prisma.invite.create({
            data: { email, token, expiresAt }
        });

        // TODO: send email to candidate with invite.token or link
        console.log(`Invite link: http://localhost:5173/signup/${token}`);

        return res.status(200).json({
            message: 'Invite created', inviteId: invite.id, inviteLink: `http://localhost:5173/signup/${token}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create invite' });
    }
})

router.get('/me', TokenVerification, async (req, res) => {

    try {
        const id = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: { id: true, email: true, name: true, CL: true, SL: true, EL: true, ML: true, role: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
})

router.get('/all', TokenVerification, async (req, res) => {
    try {
        const adminId = req.user.id;
        // Optional: allow only admins to access
        const requestingUser = await prisma.user.findUnique({ where: { id: adminId } });
        if (!requestingUser || requestingUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                CL: true,
                SL: true,
                EL: true,
                ML: true,
                createdAt: true,
                updatedAt: true,
              
            },
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.put('/update-leaves/:id', TokenVerification, async (req, res) => {
    const { id } = req.params; // user ID to update
    const { CL, SL, EL, ML } = req.body; // new leave balances

    try {
        // Only admin can update
        const admin = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!admin || admin.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update leave balances
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                CL: CL !== undefined ? CL : user.CL,
                SL: SL !== undefined ? SL : user.SL,
                EL: EL !== undefined ? EL : user.EL,
                ML: ML !== undefined ? ML : user.ML,
            },
        });

        res.status(200).json({ message: 'Leave balances updated', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



module.exports = router;