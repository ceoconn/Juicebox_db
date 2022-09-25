// should contain helper functions for the rest of the app to use
const { Client } = require('pg'); //imports the pg module

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers() {
    const { rows } = await client.query(`SELECT id, username, name, location, active FROM users`);

    return rows;
};

async function createUser({ username, password, name, location }) {
    try {
        const { rows: user } = await client.query(`
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, password, name, location]);

        return user;
    }
    catch (err) {
        console.log('createUser-index.js FAILED:', err);
    }
};

async function updateUser(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // returns if the fields object is empty (no values)
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [ user ]} = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        return user;
    }
    catch (err) {
        console.log('updateUser FAILED:', err)
    }
};


module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser
}

//allows access to the db