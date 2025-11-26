import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import { Role } from "../models/roleModel.js";
import { Permission } from "../models/permissionModel.js";
import { sequelize } from "./dbConfig.js";

/**
 * Seeds the database with a default admin user if it doesn't exist
 * Also assigns all permissions to the admin user
 */
export const seedDefaultAdmin = async () => {
    try {
        // 1. Ensure Role exists
        let adminRole = await Role.findOne({ where: { name: 'super-admin' } });
        if (!adminRole) {
            adminRole = await Role.create({
                name: 'super-admin',
                description: 'Super administrator with all permissions'
            });
            console.log("✓ Created super-admin role");
        }

        // 2. Ensure Permissions exist
        const permissionsList = [
            "users.read", "users.create", "users.update", "users.delete",
            "roles.read", "roles.create", "roles.update", "roles.delete",
            "permissions.read", "permissions.create", "permissions.update", "permissions.delete",
            "posts.read", "posts.create", "posts.update"
        ];

        const createdPermissions = [];
        for (const permName of permissionsList) {
            const [perm] = await Permission.findOrCreate({
                where: { name: permName },
                defaults: { description: `Permission to ${permName}` }
            });
            createdPermissions.push(perm);
        }

        const adminEmail = "admin@gmail.com";

        // 3. Check if admin user already exists
        const existingAdmin = await User.findOne({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log("✓ Default admin user already exists, skipping seed");
            return;
        }

        // 4. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("test@123", salt);

        const adminUser = await User.create({
            name: "Prashant Sachan",
            email: adminEmail,
            password: hashedPassword,
            phone: "8546040002",
            roleId: adminRole.id
        });

        // 5. Assign all permissions to admin user
        const values = createdPermissions
            .map(
                (perm) =>
                    `(${adminUser.id}, ${perm.id}, NOW(), NOW())`
            )
            .join(", ");

        if (values.length > 0) {
            await sequelize.query(
                `INSERT INTO UserPermissions (userId, permissionId, createdAt, updatedAt)
                 VALUES ${values};`
            );
        }

        console.log("✓ Default admin created & all permissions assigned");
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
};
