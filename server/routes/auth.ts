import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../storage';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();
const SALT_ROUNDS = 12;

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    if (email) {
      const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingEmail.length > 0) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [newUser] = await db.insert(users).values({
      username,
      email: email || null,
      password: hashedPassword,
      role: 'user',
    }).returning({ id: users.id, username: users.username, role: users.role });

    (req.session as any).user = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };

    res.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    (req.session as any).user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/logout', (req: any, res) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  } else {
    res.json({ success: true });
  }
});

router.get('/me', (req, res) => {
  const user = (req.session as any).user;
  if (!user) {
    return res.json({ success: true, user: null });
  }
  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

router.get('/check-admin', (req, res) => {
  const user = (req.session as any).user;
  res.json({
    success: true,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  });
});

export default router;
