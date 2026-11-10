const db = require('../database/connect');

class User {
    constructor({ user_id, email, password_hash, security_question, security_answer_hash, role }) {
        this.user_id = user_id
        this.email = email
        this.password_hash = password_hash
        this.security_question = security_question
        this.security_answer_hash = security_answer_hash
        this.role = role
    }

    static async getAll() {
        const response = await db.query('SELECT user_id, email, role FROM users;')
        return response.rows.map(row => new User(row))
    }

    static async getByRole(role) {
        const response = await db.query('SELECT user_id, email, role FROM users WHERE role = $1;', [role])
        return response.rows.map(row => new User(row))
    }

    static async findByEmail(email) {
        const response = await db.query('SELECT * FROM users WHERE email = $1;', [email])
        if (response.rowCount === 0) {
            return null
        }
        return new User(response.rows[0])
    }

    static async create(data) {
        const { email, password_hash, security_question, security_answer_hash, role, organisation, class_name, name, teacher_id } = data
        const client = await db.connect()

        try {
            await client.query('BEGIN')

            const response = await client.query(
                `INSERT INTO users
                (email, password_hash, security_question, security_answer_hash, role)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
                [email, password_hash, security_question, security_answer_hash, role]
            )

            const user = response.rows[0]

            if (role === 'student') {
                await client.query(
                    `INSERT INTO students (student_id, name, teacher_id)
                    VALUES ($1, $2, $3);`,
                    [user.user_id, name, teacher_id]
                )
            } else if (role === 'teacher') {
                await client.query(
                    `INSERT INTO teachers (teacher_id, organisation, class_name)
                    VALUES ($1, $2, $3);`,
                    [user.user_id, organisation, class_name]
                )
            } else {
                throw new Error('Invalid role')
            }

            await client.query('COMMIT')

            return new User(user)
        }
        catch (error) {
            await client.query('ROLLBACK')
            throw error
        }
        finally {
            client.release()
        }
    }

    static async delete(id) {
        const response = await db.query('DELETE FROM users WHERE user_id = $1;', [id])
        if (response.rowCount === 0) {
            throw new Error(`User with id ${id} not found`)
        }
        return { message: `User with id ${id} deleted successfully` }
    }
    
    // static async update(id, data) {
    //     const { email, password_hash, security_question, security_answer_hash, role } = data
    //     const response = await db.query(
    //         `UPDATE users SET 
    //             email = COALESCE($1, email),
    //             password_hash = COALESCE($2, password_hash),
    //             security_question = COALESCE($3, security_question),
    //             security_answer_hash = COALESCE($4, security_answer_hash),
    //             role = COALESCE($5, role)
    //         WHERE id = $6 RETURNING *; `,
    //         [email, password_hash, security_question, security_answer_hash, role, id]
    //     )

    //     if (response.rowCount === 0) {
    //         throw new Error(`User with id ${id} not found`)
    //     }
        
    //     return new User(response.rows[0])
    // } 
}

module.exports = User