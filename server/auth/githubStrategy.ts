import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db } from '../storage';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) {
  passport.use(new GitHubStrategy(
  {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: 'https://uuon.world/auth/github/callback',
    scope: ['user:email', 'repo'],
  },
  async (accessToken: string, _refreshToken: string, profile: any, done: any) => {
    try {
      const repoCheck = await fetch('https://api.github.com/user/repos?per_page=1', {
        headers: { Authorization: `token ${accessToken}` },
      });
      const repos = await repoCheck.json();
      if (!Array.isArray(repos) || repos.length === 0) {
        return done(null, false, { message: 'A GitHub account with at least one repository is required.' });
      }

      const githubId = String(profile.id);
      const email = profile.emails?.[0]?.value || null;

      const [existing] = await db.select().from(users).where(eq(users.github_id, githubId)).limit(1);
      if (existing) {
        return done(null, existing);
      }

      const [newUser] = await db.insert(users).values({
        username: profile.username || `gh_${githubId}`,
        password: '',
        email,
        github_id: githubId,
        github_username: profile.username,
        email_verified: !!email,
        role: 'user',
      }).returning();

      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
  ));
} else {
  console.warn('⚠️  GitHub OAuth disabled: OAUTH_CLIENT_ID/OAUTH_CLIENT_SECRET not set');
}

export default passport;
