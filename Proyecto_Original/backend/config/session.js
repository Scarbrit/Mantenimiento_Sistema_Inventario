import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pool from './database.js';

const PgSession = connectPgSimple(session);

export default session({
  store: new PgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true, // Creates user_sessions table if it doesn't exist
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: process.env.NODE_ENV === 'production'? 'none': 'lax',
  },
});
