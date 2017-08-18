# iTalk 

iTalk is a web Forum for netizens where ideas and views on a particular issue can be exchanged.

  - Add Post to a specific category
  - As you add, you can also edit and delete your posts
  
  

# New Features!

  - This forum greets you on your birthday!


## Creators
1. Alag, Janelle
2. Cortez, Gilbert
3. Espin, Mary Justine
4. Larin, Joseph
5. Pijan, Xander


### Tech

iTalk uses a number of open source projects to work properly:

* NodeJS -  a JavaScript runtime built on Chrome's V8 JavaScript engine.
* Bootstrap - The most popular HTML, CSS, and JS library in the world.
* [Express] - fast node.js network app framework


### Installation

1. Fork this repository. https://github.com/janellealag/iTalk
2. After forking, clone it to your local machines. Forking gives you ownership to the copy of the project, thus you'll have automatic read and write (pull and push) privileges. No need to authenticate through your professor as long as you have configured your SSH keys.
3. After cloning, open a command line (terminal) and go to the boilerplate directory. Issue an `npm install` command. This will download module dependencies of the project. **Note that this requires a working internet connection**.
4. After installing all the dependencies, open the `.env.sample` file and copy the contents of it. Create a new `.env` file and paste everything in there. The sample file has comments in it for each field present.
5.  Run the application using `node index.js` or `nodemon`.

```sh
$ npm install
$ node index.js
```

On your browser: type localhost:3009/logins (this will direct you to the login page)
If you are an admin, your email is admin@email.com and your password is admin

## Database

If you want to enable the database part of the application, then you have to check the following first:
- MySQL should be installed
- You have a usable credential to login to your MySQL database, provide them in the .env file
- You have created a database in MySQL, provide the name in the .env file
- Import the dbForum.sql to your mysql server. Two ways to import:
    1. Through your phpmyadmin on browser, just click import and choose the dbForum.sql file
    2. Or through your command line:
    
    ```sh
    $ cd xampp/mysql/bin
    $ mysql root -u root -p
    $ create database dbForum;
    $ source dbForum.sql
    ```
    note: make sure that your .sql file is pasted on the same directory (/mysql/bin)
- Once all of those are satisfied, you should be able to see your list of users in the `/index` route when you run the app.

## Table Descriptions
- post_tbl
    `ID` int(11) NOT NULL PRIMARY KEY,
  `userID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1'

- user_tbl
  `userID` int(11) NOT NULL PRIMARY KEY,
  `username` varchar(100) NOT NULL,
  `emailAddress` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `userType` tinyint(1) DEFAULT '1'

- post_category_tbl
  `categoryID` int(11) NOT NULL PRIMARY KEY,
  `categoryName` varchar(100) NOT NULL
