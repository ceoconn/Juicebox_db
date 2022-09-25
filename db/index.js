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
    };

    try {
        const { rows: [user] } = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        return user;
    }
    catch (err) {
        console.log('updateUser-index.js FAILED:', err)
    }
};

async function getUserById(userId) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT id, username, name, location, active
        FROM users
        WHERE id=${userId}
      `);

        if (!user) {
            return null;
        };

        user.posts = await getPostsByUser(userId);

        return user;
    }
    catch (err) {
        console.log('getUserById-index.js FAILED:', err);
    }
};

async function createPost({ authorId, title, content }) {
    try {
        const { rows: post } = await client.query(`
        INSERT INTO posts("authorId", title, content)
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [authorId, title, content]);

        return post;
    }
    catch (err) {
        console.log('createPost-index.js FAILED:', err);
    }
};

async function updatePost(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows: [post] } = await client.query(`
            UPDATE posts
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
          `, Object.values(fields));

        return post;
    }
    catch (err) {
        console.log('updatePost-index.js FAILED:', err);
    }
};

async function getAllPosts() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM posts;
      `);

        return rows;
    }
    catch (err) {
        console.log('getAllPosts-index.js FAILED:', err);
    }
};

async function getPostsByUser(userId) {
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM posts
        WHERE "authorId"=${userId};
      `);

        return rows;
    }
    catch (err) {
        console.log('getPostsByUser-index.js FAILED:', err);
    }
};

// async function createTags(tagList) {
//     if (tagList.length === 0) {
//         return;
//     };

//     const insertValues = tagList.map(
//         (_, index) => `$${index + 1}`
//     ).join('), (');

//     const selectValues = tagList.map(
//         (_, index) => `$${index + 1}`
//     ).join(', ');

//     try {
//         const { rows } = await client.query(`
//         INSERT INTO tags(name)
//         VALUES($1), ($2), ($3)
//         ON CONFLICT(name) DO NOTHING;

//         SELECT * FROM tags
//         WHERE name
//         IN ($1, $2, $3);
//     `);

//         return rows;
//     }
//     catch (err) {
//         console.log('createTags-index.js FAILED:', err);
//     };
// };


module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
}
//allows access to the db
