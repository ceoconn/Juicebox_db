const { client,
    getAllUsers,
    createUser
} = require('./index');

async function dropTables() {
    try {
        console.log('--ATTEMPTING TO DROP TABLES--');

        await client.query(`
        DROP TABLE IF EXISTS users;
        `);

        console.log('--SUCCESSFULLY DROPPED TABLES--');
    }
    catch (err) {
        console.log('dropTables FAILED:', err);
    }
};

async function createTables() {
    try {
        console.log('--ATTEMPTING TO CREATE TABLES--');

        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
          );
        `);
        console.log('--SUCCESSFULLY CREATED TABLES--');
    }
    catch (err) {
        console.log('createTables FAILED:', err);
    }
};

async function createInitUsers() {
    try {
        console.log('--ATTEMPTING TO CREATE USERS--');

        const albert = await createUser({ username: 'albert', password: 'bertie99' });
        const sandra = await createUser({ username: 'sandra', password: '2sandy4me' });
        const glamgal = await createUser({ username: 'glamgal', password: 'soglam' });
        console.log('USERS:', albert, sandra, glamgal);

        console.log('--SUCCESSFULLY CREATED USERS--');
    }
    catch (err) {
        console.log('createInitUsers FAILED:', err);
    }
};

async function rebuildDB() {
    try {
        client.connect(); //connects the client to the db

        await dropTables();
        await createTables();
        await createInitUsers();

        console.log('--SUCCESSFULLY REBUILT DB--');
    }
    catch (err) {
        console.log('rebuildDB FAILED:', err);
    }
}

async function testDB() {
    try {
        console.log('--TESTING DB--');

        const users = await getAllUsers()

        console.log('getAllUsers result:', users)

        console.log('--FINISHED DB TEST--');
    }
    catch (err) {
        console.error('testDB FAILED:', err);
    }
};

rebuildDB()
    .then(testDB)
    .catch(console.err)
    .finally(() => client.end());