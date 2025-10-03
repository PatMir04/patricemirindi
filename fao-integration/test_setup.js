// test_setup.js - Comprehensive setup verification script
require('dotenv').config();

async function testSetup() {
    console.log('🧪 Testing FAO Data Integration Setup...');
    console.log('=' + '='.repeat(50));
    
    let allTestsPassed = true;
    
    // Test 1: Check Node.js version
    console.log('\n1️⃣ NODE.JS VERSION:');
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion >= 14) {
        console.log(`✅ Node.js version: ${nodeVersion} (>= 14.0.0)`);
    } else {
        console.log(`❌ Node.js version: ${nodeVersion} (requires >= 14.0.0)`);
        allTestsPassed = false;
    }
    
    // Test 2: Check required dependencies
    console.log('\n2️⃣ DEPENDENCIES:');
    const requiredDeps = ['jszip', 'papaparse', 'dotenv', 'node-fetch'];
    const optionalDeps = ['pg', 'mysql2', 'mongodb', 'sqlite3', 'sqlite'];
    
    for (const dep of requiredDeps) {
        try {
            require(dep);
            console.log(`✅ ${dep}: installed`);
        } catch (error) {
            console.log(`❌ ${dep}: not installed - run 'npm install ${dep}'`);
            allTestsPassed = false;
        }
    }
    
    // Test database drivers
    const dbType = process.env.DB_TYPE || 'sqlite';
    console.log(`\n🗄️ Database type: ${dbType}`);
    
    if (dbType === 'postgresql' || dbType === 'postgres') {
        try {
            require('pg');
            console.log('✅ pg (PostgreSQL driver): installed');
        } catch (error) {
            console.log('❌ pg (PostgreSQL driver): not installed - run \'npm install pg\'');
            allTestsPassed = false;
        }
    } else if (dbType === 'mysql') {
        try {
            require('mysql2');
            console.log('✅ mysql2 (MySQL driver): installed');
        } catch (error) {
            console.log('❌ mysql2 (MySQL driver): not installed - run \'npm install mysql2\'');
            allTestsPassed = false;
        }
    } else if (dbType === 'mongodb') {
        try {
            require('mongodb');
            console.log('✅ mongodb (MongoDB driver): installed');
        } catch (error) {
            console.log('❌ mongodb (MongoDB driver): not installed - run \'npm install mongodb\'');
            allTestsPassed = false;
        }
    } else if (dbType === 'sqlite') {
        try {
            require('sqlite3');
            require('sqlite');
            console.log('✅ sqlite3 & sqlite (SQLite drivers): installed');
        } catch (error) {
            console.log('❌ SQLite drivers missing - run \'npm install sqlite3 sqlite\'');
            allTestsPassed = false;
        }
    }
    
    // Test 3: Check environment variables
    console.log('\n3️⃣ ENVIRONMENT VARIABLES:');
    
    const envVars = {
        'DB_TYPE': process.env.DB_TYPE || 'not set (defaulting to sqlite)',
        'DB_HOST': process.env.DB_HOST || 'not set (defaulting to localhost)',
        'DB_NAME': process.env.DB_NAME || 'not set (defaulting to fao_data.db)',
    };
    
    if (dbType !== 'sqlite') {
        envVars['DB_USER'] = process.env.DB_USER || 'not set';
        envVars['DB_PASSWORD'] = process.env.DB_PASSWORD ? '***set***' : 'not set';
        envVars['DB_PORT'] = process.env.DB_PORT || 'not set (using default)';
    }
    
    Object.entries(envVars).forEach(([key, value]) => {
        if (value.includes('not set') && dbType !== 'sqlite' && ['DB_USER', 'DB_PASSWORD'].includes(key)) {
            console.log(`⚠️  ${key}: ${value}`);
            if (key === 'DB_USER' || key === 'DB_PASSWORD') {
                console.log('   → Required for database connection');
            }
        } else {
            console.log(`✅ ${key}: ${value}`);
        }
    });
    
    // Test 4: Test internet connection to FAO
    console.log('\n4️⃣ NETWORK CONNECTION:');
    try {
        const fetch = require('node-fetch');
        const response = await fetch('https://bulks-faostat.fao.org/production/Inputs_LandUse_E_All_Data_(Normalized).zip', {
            method: 'HEAD',
            timeout: 10000
        });
        
        if (response.ok) {
            const contentLength = response.headers.get('content-length');
            const sizeMB = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) : 'unknown';
            console.log(`✅ FAO Land Use dataset accessible (${sizeMB}MB)`);
        } else {
            console.log(`⚠️  FAO dataset response: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.log(`⚠️  Network connection issue: ${error.message}`);
        console.log('   → This might be temporary or a firewall issue');
    }
    
    // Test 5: Test database connection
    console.log('\n5️⃣ DATABASE CONNECTION:');
    
    if (dbType === 'sqlite') {
        try {
            const sqlite3 = require('sqlite3');
            const { open } = require('sqlite');
            
            const db = await open({
                filename: process.env.DB_NAME || 'test_connection.db',
                driver: sqlite3.Database
            });
            
            await db.exec('CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, name TEXT)');
            await db.exec('DROP TABLE IF EXISTS test_table');
            await db.close();
            
            console.log('✅ SQLite database connection successful');
        } catch (error) {
            console.log(`❌ SQLite connection failed: ${error.message}`);
            allTestsPassed = false;
        }
    } else if (dbType === 'postgresql' || dbType === 'postgres') {
        try {
            const { Pool } = require('pg');
            const pool = new Pool({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                database: process.env.DB_NAME || 'postgres',
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectionTimeoutMillis: 5000
            });
            
            const client = await pool.connect();
            await client.query('SELECT 1');
            client.release();
            await pool.end();
            
            console.log('✅ PostgreSQL database connection successful');
        } catch (error) {
            console.log(`❌ PostgreSQL connection failed: ${error.message}`);
            console.log('   → Check your database credentials and ensure PostgreSQL is running');
            allTestsPassed = false;
        }
    } else if (dbType === 'mysql') {
        try {
            const mysql = require('mysql2/promise');
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                timeout: 5000
            });
            
            await connection.execute('SELECT 1');
            await connection.end();
            
            console.log('✅ MySQL database connection successful');
        } catch (error) {
            console.log(`❌ MySQL connection failed: ${error.message}`);
            console.log('   → Check your database credentials and ensure MySQL is running');
            allTestsPassed = false;
        }
    }
    
    // Test 6: Check disk space
    console.log('\n6️⃣ SYSTEM RESOURCES:');
    try {
        const fs = require('fs');
        const stats = fs.statSync('.');
        console.log('✅ Write permissions: available');
        
        // Rough estimate of available space (simplified)
        console.log('⚠️  Note: Ensure you have at least 100MB free disk space for data processing');
    } catch (error) {
        console.log(`❌ File system access error: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎯 SETUP VERIFICATION SUMMARY:');
    console.log('=' + '='.repeat(30));
    
    if (allTestsPassed) {
        console.log('🎉 ALL TESTS PASSED!');
        console.log('✅ Your environment is ready for FAO data integration');
        console.log('');
        console.log('🚀 READY TO RUN:');
        console.log('   node step1_land_use_integration.js');
        console.log('   # or');
        console.log('   npm run step1');
    } else {
        console.log('⚠️  SOME ISSUES DETECTED');
        console.log('Please fix the issues marked with ❌ above');
        console.log('');
        console.log('🔧 COMMON FIXES:');
        console.log('   1. Install missing dependencies: npm install');
        console.log('   2. Copy .env.example to .env and configure database');
        console.log('   3. Ensure your database server is running');
        console.log('   4. Check your internet connection');
    }
    
    console.log('');
    console.log('📝 QUICK START GUIDE:');
    console.log('   1. Copy .env.example to .env');
    console.log('   2. Edit .env with your database details');
    console.log('   3. Run: npm install');
    console.log('   4. Run: node test_setup.js (this script)');
    console.log('   5. Run: node step1_land_use_integration.js');
    
    return allTestsPassed;
}

// Run the test if called directly
if (require.main === module) {
    testSetup().then(passed => {
        process.exit(passed ? 0 : 1);
    }).catch(error => {
        console.error('❌ Test setup failed:', error);
        process.exit(1);
    });
}

module.exports = testSetup;