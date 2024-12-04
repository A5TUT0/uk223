const ROLES_TABLE = `
CREATE TABLE IF NOT EXISTS Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);
`;

const USER_TABLE = `
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creation_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT true,
    email VARCHAR(50) NOT NULL UNIQUE,
    role_id INT DEFAULT 1, -- Relación con Roles
    is_blocked BOOLEAN DEFAULT false,
    FOREIGN KEY (role_id) REFERENCES Roles(id)
    ON DELETE SET NULL
);
`;

const POSTS_TABLE = `
CREATE TABLE IF NOT EXISTS Posts (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Content TEXT NOT NULL,
    Creation_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(id)
    ON DELETE CASCADE
);
`;

const COMMENTS_TABLE = `
CREATE TABLE IF NOT EXISTS Comments (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Post_ID INT NOT NULL,
    Content TEXT NOT NULL,
    Creation_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES Users(id)
    ON DELETE CASCADE,
    FOREIGN KEY (Post_ID) REFERENCES Posts(ID)
    ON DELETE CASCADE
);
`;

const VOTES_TABLE = `
CREATE TABLE IF NOT EXISTS Votes (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Post_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Is_Positive BOOLEAN NOT NULL,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Post_ID) REFERENCES Posts(ID)
    ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users(ID)
    ON DELETE CASCADE,
    UNIQUE (Post_ID, User_ID)
);
`;

const PERMISSIONS_TABLE = `
CREATE TABLE IF NOT EXISTS Permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);
`;

const ROLE_PERMISSIONS_TABLE = `
CREATE TABLE IF NOT EXISTS Role_Permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES Permissions(id) ON DELETE CASCADE
);
`;
const DEFAULT_ROLE = `
 INSERT IGNORE INTO Roles (id, name, description)
    VALUES 
      (1, 'user', 'Default role for regular users'),
      (2, 'moderator', 'Can moderate content'),
      (3, 'admin', 'Full administrative access');
`;
const INSERT_USERS = `
INSERT IGNORE INTO Users (username, email, password, role_id)
VALUES 
    ('User', '123@123.com', '$2b$10$Tf6X6EUbG.uJen0XyP849.CPROrzg4QWD3d0z6JQfocO1PDeCdQxq', 1), 
    ('Moderator', 'asd@asd.com', '$2b$10$Tf6X6EUbG.uJen0XyP849.CPROrzg4QWD3d0z6JQfocO1PDeCdQxq', 2), 
    ('Admin', '222@122.com', '$2b$10$Tf6X6EUbG.uJen0XyP849.CPROrzg4QWD3d0z6JQfocO1PDeCdQxq', 3); 
`;

const DEFAULT_PERMISSIONS = `
INSERT IGNORE INTO Permissions (id, action, description)
VALUES 
    (1, 'create_post', 'Allow creating posts'),
    (2, 'edit_post', 'Allow editing posts'),
    (3, 'delete_post', 'Allow deleting posts'),
    (4, 'create_comment', 'Allow creating comments'),
    (5, 'edit_comment', 'Allow editing comments'),
    (6, 'delete_comment', 'Allow deleting comments'),
    (7, 'manage_users', 'Allow managing users'),
    (8, 'assign_roles', 'Allow assigning roles');
`;

const DEFAULT_ROLE_PERMISSIONS = `
INSERT IGNORE INTO Role_Permissions (role_id, permission_id)
VALUES 
    
    (1, 1),
    (1, 4),

    
    (2, 1), 
    (2, 2), 
    (2, 3), 
    (2, 4), 
    (2, 5), 
    (2, 6), 

    (3, 1), 
    (3, 2), 
    (3, 3), 
    (3, 4),
    (3, 5), 
    (3, 6), 
    (3, 7), 
    (3, 8); 
`;

export {
  USER_TABLE,
  POSTS_TABLE,
  COMMENTS_TABLE,
  VOTES_TABLE,
  ROLES_TABLE,
  PERMISSIONS_TABLE,
  ROLE_PERMISSIONS_TABLE,
  DEFAULT_ROLE,
  INSERT_USERS,
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
};
