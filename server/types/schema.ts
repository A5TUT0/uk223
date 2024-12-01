const USER_TABLE = `
CREATE TABLE IF NOT EXISTS Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creation_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT true,
    email VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);
`;

// const TWEET_TABLE = `
// CREATE TABLE IF NOT EXISTS tweets (
//     id INT NOT NULL AUTO_INCREMENT,
//     user_id INT NOT NULL,
//     content VARCHAR(255) NOT NULL,
//     PRIMARY KEY (id),
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );
// `;

export { USER_TABLE };
