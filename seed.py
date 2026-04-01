# Database Seeder Script
# This script creates sample users for all departments

import asyncio
import sys
sys.path.append('./server/src')

from pymongo import MongoClient
import bcrypt
from datetime import datetime

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['regent_dms']

def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_users():
    """Create sample users for all departments"""
    
    users = [
        {
            'firstName': 'Registry',
            'lastName': 'Admin',
            'email': 'registry@regent.edu',
            'password': hash_password('registry123'),
            'department': 'registry',
            'role': 'admin',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'firstName': 'Accounts',
            'lastName': 'Admin',
            'email': 'accounts@regent.edu',
            'password': hash_password('accounts123'),
            'department': 'accounts',
            'role': 'admin',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'firstName': 'Quality',
            'lastName': 'Assurance',
            'email': 'qa@regent.edu',
            'password': hash_password('qa123'),
            'department': 'quality_assurance',
            'role': 'admin',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'firstName': 'President',
            'lastName': 'Office',
            'email': 'president@regent.edu',
            'password': hash_password('president123'),
            'department': 'presidency',
            'role': 'admin',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'firstName': 'VP',
            'lastName': 'Academics',
            'email': 'vpacademics@regent.edu',
            'password': hash_password('vpacademics123'),
            'department': 'vp_academics',
            'role': 'admin',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        },
        {
            'firstName': 'Super',
            'lastName': 'Admin',
            'email': 'superadmin@regent.edu',
            'password': hash_password('superadmin123'),
            'department': 'admin',
            'role': 'super_admin',
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
    ]
    
    # Clear existing users
    db.users.delete_many({})
    
    # Insert new users
    result = db.users.insert_many(users)
    
    print(f"✅ Created {len(result.inserted_ids)} users successfully!")
    print("\nLogin credentials:")
    print("-" * 50)
    for user in users:
        print(f"Department: {user['department']}")
        print(f"Email: {user['email']}")
        print(f"Password: {user['email'].split('@')[0]}123")
        print("-" * 50)

if __name__ == '__main__':
    try:
        create_users()
        print("\n✅ Database seeding completed successfully!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    finally:
        client.close()
