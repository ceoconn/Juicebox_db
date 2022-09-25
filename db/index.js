// should contain helper functions for the rest of the app to use
const { Client } = require('pg'); //imports the pg module

const client = new Client ('postgres://localhost:5432/juicebox-dev');

async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, username
        FROM users
        `
    );

    return rows;
}


module.exports = {
    client,
    getAllUsers,
}

//allows access to the db