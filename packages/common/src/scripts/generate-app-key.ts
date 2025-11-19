#!/usr/bin/env node

import jwt from 'jsonwebtoken';
import { AppKeyData } from '../types/app-key';

const SECRET_KEY = process.env.APP_KEY_SECRET || 'your-secret-key-change-in-production';

function generateMockAppKey(): AppKeyData  {
    const now = new Date().toISOString();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    return {
        organization: {
            id: 'org_' + Math.random().toString(36).substr(2, 9),
            name: 'TensilLabs Demo Organization',
            email: 'admin@tensillabs.com',
            phone: '+1234567890',
            address: '123 Tech Street, Silicon Valley, CA',
            country: 'US'
        },
        workspace: {
            id: 'ws_' + Math.random().toString(36).substr(2, 9),
            name: 'Main Workspace',
            slug: 'main-workspace',
            defaultMember: {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@tensillabs.com',
                password: 'admin123',
                phone: '+1234567890',
                bio: 'Default workspace administrator'
            }
        },
        license: {
            expiresAt: expiryDate,
            numberOfSeats: 2
        },
        billing: {
            amount: 500,
            paymentFrequency: 'monthly',
            gateway: 'paystack'
        },
        deployment: {
            flyApiKey: 'fly_' + Math.random().toString(36).substr(2, 20),
            appName: 'tensillabs-' + Math.random().toString(36).substr(2, 6),
            domain: 'app.tensillabs.com'
        },
        createdAt: now,
        version: '1.0.0'
    };
}

function generateAppKeyJWT(data: AppKeyData): string {
    return jwt.sign(
        { data },
        SECRET_KEY,
        {
            expiresIn: '10y',
            issuer: 'tensillabs',
            audience: 'tensillabs-app'
        }
    );
}

function main() {
    if(process.env.NODE_ENV !== 'development') return;
    console.log('🔑 Generating APP_KEY...');
    console.log('');

    const appKeyData = generateMockAppKey();
    const jwtToken = generateAppKeyJWT(appKeyData);

    console.log('📋 Generated APP_KEY Data:');
    console.log(JSON.stringify(appKeyData, null, 2));
    console.log('');

    console.log('🎫 JWT Token:');
    console.log(jwtToken);
    console.log('');

    console.log('🔧 Environment Variable:');
    console.log(`APP_KEY=${jwtToken}`);
    console.log('');

    console.log('✅ APP_KEY generated successfully!');
    console.log('');
    console.log('💡 Tips:');
    console.log('- Copy the JWT token to your .env file as APP_KEY');
    console.log('- In production, use a secure SECRET_KEY via APP_KEY_SECRET env var');
    console.log('- The token expires in 1 year from generation');
}

if (require.main === module) {
    main();
}

export { generateMockAppKey, generateAppKeyJWT };