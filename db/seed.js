const { client,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser
} = require('./index');

async function dropTables() {
    try {
        console.log('--ATTEMPTING TO DROP TABLES--');

        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
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
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active BOOLEAN DEFAULT true
          );
        
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
          );
        
        CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL
        );

        CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id) UNIQUE NOT NULL,
            "tagId" INTEGER REFERENCES tags(id) UNIQUE NOT NULL
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

        const albert = await createUser({
            username: 'albert',
            password: 'bertie99',
            name: 'Bert',
            location: 'Baltimore'
        });
        const sandra = await createUser({
            username: 'sandra',
            password: '2sandy4me',
            name: 'Sandy',
            location: 'New York'
        });
        const glamgal = await createUser({
            username: 'glamgal',
            password: 'soglam',
            name: 'Drab',
            location: 'Sydney'
        });

        console.log('--SUCCESSFULLY CREATED USERS--');
    }
    catch (err) {
        console.log('createInitUsers FAILED:', err);
    }
};

async function createInitPosts() {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        console.log('--ATTEMPTING TO CREATE POSTS--');

        await createPost({
            authorId: albert.id,
            title: 'First Post',
            content: 'My first post, please like it :)'
        });

        await createPost({
            authorId: sandra.id,
            title: 'Am I doing this right?',
            content: "Seriously I can't tell"
        });

        await createPost({
            authorId: glamgal.id,
            title: 'True Glam',
            content: 'Always glam all the time'
        });

        console.log('--SUCCESSFULLY CREATED POSTS--');
    }
    catch (err) {
        console.log('createInitPosts FAILED:', err);
    }
};

async function rebuildDB() {
    try {
        client.connect(); //connects the client to the db

        await dropTables();
        await createTables();
        await createInitUsers();
        await createInitPosts();

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

        console.log('GET/ALL/USERS Result:', users)

        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("UPDATE/USER Result:", updateUserResult);

        const posts = await getAllPosts();
        console.log('GET/ALL/POSTS Result:', posts);

        const updatePostResult = await updatePost(posts[0].id, {
            title: 'New Title',
            content: 'Updated Content'
        });
        console.log('UPDATE/POST Result:', updatePostResult);

        const albert = await getUserById(1);
        console.log('GET/USER/BY/ID Result:', albert);

        console.log('--FINISHED DB TESTS--');
    }
    catch (err) {
        console.error('testDB FAILED:', err);
    }
};

rebuildDB()
    .then(testDB)
    .catch(console.err)
    .finally(() => client.end());