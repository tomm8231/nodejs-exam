import bcrypt from "bcrypt";

export async function hashPassword(plainTextPassword) {
    const saltRounds = 14
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds)
    
    return hashedPassword
}
