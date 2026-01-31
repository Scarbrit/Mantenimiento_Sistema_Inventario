// Test email configuration script
// Run with: node scripts/test-email-config.js

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

console.log('\n=== Email Configuration Test ===\n');
console.log('Host:', emailConfig.host);
console.log('Port:', emailConfig.port);
console.log('User:', emailConfig.auth.user);
console.log('Password Length:', emailConfig.auth.pass?.length || 0);
console.log('Password (first 4 chars):', emailConfig.auth.pass?.substring(0, 4) + '...' || 'missing');

// Check for issues
if (!emailConfig.auth.pass) {
  console.error('\n❌ ERROR: EMAIL_PASS is not set in .env file');
  process.exit(1);
}

if (emailConfig.auth.pass.length !== 16) {
  console.warn(`\n⚠️  WARNING: Password length is ${emailConfig.auth.pass.length}, expected 16`);
}

if (emailConfig.auth.pass.includes(' ')) {
  console.warn('\n⚠️  WARNING: Password contains spaces!');
  console.warn('App Password should be 16 characters with NO spaces');
}

// Check for hidden characters
const hasHiddenChars = /[\n\r\t]/.test(emailConfig.auth.pass);
if (hasHiddenChars) {
  console.warn('\n⚠️  WARNING: Password contains hidden characters (newlines/tabs)');
}

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

console.log('\n=== Testing Connection ===\n');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 EAUTH Error Solutions:');
      console.error('1. Verify App Password is correct (16 chars, no spaces)');
      console.error('2. Make sure App Password was generated for:', emailConfig.auth.user);
      console.error('3. Check that 2-Step Verification is enabled');
      console.error('4. Try generating a NEW App Password');
      console.error('5. Check .env file - make sure there are no quotes around the password');
      console.error('6. Make sure EMAIL_USER matches the account that generated the App Password');
    }
    process.exit(1);
  } else {
    console.log('✅ Connection successful!');
    console.log('Email configuration is working correctly.');
    process.exit(0);
  }
});
