import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { sequelize } from './dbConfig.js';

/**
 * Seeds the database with a default admin user if it doesn't exist
 * Also assigns all permissions (1-15) to the admin user
 */
export const seedDefaultAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';

        // Check if admin user already exists
        const existingAdmin = await User.findOne({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('✓ Default admin user already exists, skipping seed');
            return;
        }

        // Admin user doesn't exist, create it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test@123', salt);

        const adminUser = await User.create({
            name: 'Prashant Sachan',
            email: adminEmail,
            password: hashedPassword,
            phone: '8546040002',
            roleId: 2  // Default role ID
        });

        // Assign all permissions (1-15) to admin user using raw query to avoid circular dependency
        const permissionIds = Array.from({ length: 15 }, (_, i) => i + 1);
        const values = permissionIds.map(permissionId =>
            `(${adminUser.id}, ${permissionId}, NOW(), NOW())`
        ).join(', ');

        await sequelize.query(
            `INSERT INTO UserPermissions (userId, permissionId, createdAt, updatedAt) VALUES ${values}`
        );

        console.log('✓ Default admin user created successfully');
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: test@123`);
        console.log(`  Role ID: 2`);
        console.log(`  Permissions: 1-15 (${permissionIds.length} permissions assigned)`);
    } catch (error) {
        console.error('✗ Error seeding default admin user:', error.message);
    }
};
