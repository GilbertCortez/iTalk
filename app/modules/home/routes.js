
var express = require('express');

var router = express.Router();

var signUprouter = express.Router();

var db = require('../../lib/database')();

var authMiddleware = require('../middleware/auth');

var tablePost = "post_tbl";

var tableCategory = "post_category_tbl";

var currentPost = 0;

router.use(authMiddleware.hasAuth);

var categg = "";

var postresults = "";



// ---------- WALANG KWENTA -------------
signUprouter.get('/', (req,res) =>{
    res.render('home/views/login');
});

signUprouter.post('/login', (req,res) =>{
 db.query(`SELECT * from user_tbl where email="${req.body.email}" AND password='${req.body.password}' `, (err, results, fields) =>{
           
        
        if (err) {console.log(err); res.render('home/views/login');}
        console.log(results);
        rend(results);
        
        });
    
    function rend(cate){
        db.query(`SELECT * from \`${tablePost}\` where \`status\` = 1 Order By id desc `,(err, results, fields) =>{
           
        
            if (err) console.log(err);
            
            db.query(`Select username from user_tbl where username = "yukify" and username in (select userName from user_tbl where  DAY(birthdate) = DAY(CURDATE()) and MONTH(birthdate) = MONTH(CURDATE())) `, (err, birthday, fields) =>{
            console.log("try");
            console.log(birthday);
			if(birthday==""){
                res.render('home/views/mainPage', {bday:"",post: results, category: cate});
            }
			else{
                res.render('home/views/mainPage', {bday: birthday[0].username ,post: results, category: cate});
            }
				   
				   
            });

                
        });
        
    };
    
});



// ---------- WALANG KWENTA -------------
signUprouter.get('/signUp', (req,res) =>{
    res.render('home/views/signUp');
    });

signUprouter.post('/signUp', (req,res) =>{
    
    var username = `${req.body.name}`.trim();
    var email = `${req.body.email}`.trim();
    var password = `${req.body.password}`.trim();
    
    db.query(`Select * from user_tbl where username = "${username}" || emailaddress = "${email}" `, (err,results,fields) =>{
        if (results == null || results == ""){
            //console.log("DB");
            db.query(`INSERT INTO user_tbl (username,emailAddress,password,birthdate) VALUES ("${username}","${email}","${password}","${req.body.bday}")`, (err, results, fields) => {
            if (err) console.log(err);
                 return res.redirect('/logins');
            });
     
               
        }
        else{
            //console.log("ERROR");
                res.render('home/views/signUp', {alert: 0});
        }
    
     
     });
});



// ---------- MAINPAGE -------------
router.get('/mainpage', (req, res) => {
    
    
    db.query(`SELECT * from \`${tableCategory}\` `, (err, results, fields) =>{
           
        
        if (err) console.log(err);
        categg = results;
        rend(results);
        
        });
    
    function rend(cate){
        db.query(`SELECT * from post_tbl JOIN user_tbl ON post_tbl.userID = user_tbl.userID JOIN post_category_tbl ON post_category_tbl.categoryID = post_tbl.categoryID  where post_tbl.status = 1 Order By post_tbl.id desc `,(err, results, fields) =>{
           
        
            if (err) console.log(err);
           db.query(`Select username from user_tbl where username = "${req.session.user.username}" and username in (select userName from user_tbl where  DAY(birthdate) = DAY(CURDATE()) and MONTH(birthdate) = MONTH(CURDATE())) `, (err, birthday, fields) =>{

			if(birthday==""){
                res.render('home/views/mainPage', {n: `${req.session.user.username}`, bday:"", post: results, category: cate});
            }
			else{
                res.render('home/views/mainPage', {n: `${req.session.user.username}`, bday: birthday[0].username , post: results, category: cate});
            }
				   
				   
            });

                
        });
        
    };
    
    
    
});

router.post('/create', (req,res) =>{
    
    var categoryNum = 0;
    var title = `${req.body.title}`.trim();
    
    
    
    db.query(`SELECT \`categoryID\` FROM \`${tableCategory}\` WHERE \`categoryName\` = "${req.body.selectCateg}" `, (err,results,field) => {
           if (err)  console.log(err);
            categoryNum = results[0].categoryID;
        
        db.query(`SELECT \`title\` FROM \`${tablePost}\` WHERE \`userID\` = ${req.session.user.userID} AND \`title\` = "${title}" AND \`status\` = 1 `, (err, results1, field) =>{
           
            if (results1 == null || results1 == ""){
                rend(categoryNum);
            }
            else{
                 db.query(`SELECT * from post_tbl JOIN user_tbl ON post_tbl.userID = user_tbl.userID JOIN post_category_tbl ON post_category_tbl.categoryID = post_tbl.categoryID  where post_tbl.status = 1 Order By post_tbl.id desc `,(err, results2, fields) =>{
                     res.render('home/views/mainPage', {alert: 0, n: `${req.session.user.username}`, bday:"", post: results2, category: categg});
                 });
                
                
            }
        });
            
    });
    
    function rend(number){
        db.query(`INSERT INTO \`${tablePost}\` (\`userID\`, \`categoryID\`, \`title\`, \`content\`) VALUES (${req.session.user.userID}, ${number}, "${req.body.title}", "${req.body.post}") `, (err, results, fields) => {
            if (err) console.log(err);
            
            db.query(`SELECT * from post_tbl JOIN user_tbl ON post_tbl.userID = user_tbl.userID JOIN post_category_tbl ON post_category_tbl.categoryID = post_tbl.categoryID  where post_tbl.status = 1 Order By post_tbl.id desc `,(err, results2, fields) =>{
                 res.render('home/views/mainPage', {alert: 1, n: `${req.session.user.username}`, bday:"", post: results2, category: categg});
        
            });
           
               
            
            
        });
    }
    
});



// --------- EDIT THE POST ------------

var titles;

router.get('/edit', (req,res) =>{
    db.query(`SELECT * from \`${tablePost}\` where \`userID\` = ${req.session.user.userID} AND status = 1`,(err, results, fields) =>{
           
            
        if (err) console.log(err);
        console.log(results);
        titles = results;
        
        res.render('home/views/editSearch', {titles: results});
                
        });
});

router.post('/editPost', (req,res) => {
    
    if (`${req.body.selectTitle}` == null || `${req.body.selectTitle}` ){
        res.redirect('/index/yourPost');
    } 
    else{
    
        db.query(`SELECT * from \`${tableCategory}\` `, (err, results, fields) =>{


            if (err) console.log(err);
            var categ = results;
            rend(categ);       
            });

        function rend(categ){
            db.query(`SELECT * from post_tbl JOIN post_category_tbl ON post_tbl.categoryID = post_category_tbl.categoryID where title =  "${req.body.selectTitle}"`,(err, results, fields) =>{


            if (err) console.log(err);
            //console.log(results[0].ID);
            currentPost = results[0].ID;

            res.render('home/views/editPost', {title: results[0].title, post: results[0].content, category: categ, selected: results[0].categoryName, titles: titles});

            });
        }
        
    }
    
});

router.post('/edit', (req,res) =>{
    var categoryNum = 0;
    
    
    db.query(`SELECT \`categoryID\` FROM \`${tableCategory}\` WHERE \`categoryName\` = "${req.body.selectCateg}" `, (err,results,field) => {
           if (err)  console.log(err);
            
            categoryNum = results[0].categoryID;
        db.query(`SELECT * from post_tbl where \`title\` = "${req.body.title}" AND \`status\` = 1 `, (err,results1,fields) => {
            if (results1 == null || results1 == ""){
                rend(categoryNum);
            }
            else{
                res.redirect('/index/edit');
            }
        });
            
    });
    
    function rend(number){
        db.query(`UPDATE \`${tablePost}\` SET  \`categoryID\` = ${number}, \`title\` = "${req.body.title}", \`content\` = "${req.body.post}", \`date\` = "2017-08-10" WHERE \`ID\` = ${currentPost} `, (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/index/mainpage');
        });
    }
});



// --------- DELETE THE POST --------------

router.get('/delete', (req,res) =>{
    db.query(`SELECT * from \`${tablePost}\` where \`userID\` = ${req.session.user.userID}  AND status =1 `,(err, results, fields) =>{
           
        
        if (err) console.log(err);
        //console.log(results);
        
        res.render('home/views/deletePost', {title: results});
                
        });
    
});

router.post('/delete', (req,res) => {
    
    if (`${req.body.selectTitle}` == null || `${req.body.selectTitle}` == "") {
        res.redirect('/index/yourPost');
    }
    else{
        db.query(`UPDATE \`${tablePost}\` SET  \`status\` = 0 WHERE \`title\` = "${req.body.selectTitle}" `, (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/index/yourPost');
        });
    }
    
    
});



// ---------- SHOW YOUR POSTS ONLY -------------

router.get('/yourPost', (req,res) =>{
    db.query(`SELECT * from \`${tablePost}\` where status = 1 AND userID = ${req.session.user.userID} `,(err, results, fields) =>{
           
        console.log(req.session.user.userID);
        if (err) console.log(err);
        //console.log(results);
        
        res.render('home/views/userPost', {post: results, userPost: req.session.user.userID});
                
        });
});


// ---------- SHOW POST PER CATEGORY -----------

router.get('/category', (req,res) =>{
    db.query(`SELECT * from \`${tableCategory}\` `, (err,results,fields) =>{
        if (err) console.log(err);
        console.log(req.session.user.userType);
        
        res.render('home/views/categoriesPage', {category: results, type: req.session.user.userType});
    });
});

router.post('/category', (req,res) =>{
    db.query(`SELECT * from \`${tableCategory}\` where categoryName = "${req.body.category}" `, (err,results,fields) =>{
        if (err) console.log(err);
        
        rend(results[0].categoryID);
    });
    
    function rend(val){
        db.query(`SELECT * from \`${tablePost}\` where categoryID = ${val} AND status = 1`, (err,results,fields) =>{
            if (err) console.log(err);
            res.render('home/views/postPerCategory', {post: results, cat: `${req.body.category}`, type: req.session.user.userType});
        });
        
    }
    
});

// ---------- ADD CATEGORY -------------------

router.get('/addCategory', (req, res) => {
    res.render('home/views/addCategory', {type: req.session.user.userType});
});

router.post('/addCategory', (req, res) => {
    
    db.query(`SELECT * from \`post_category_tbl\` where \`categoryName\` = "${req.body.categoryname}" `, (err,results,fields) =>{
        if (results == null || results == ""){
               db.query(`INSERT INTO \`post_category_tbl\` (\`categoryName\`)  VALUES ("${req.body.categoryname}")`, (err, results, fields) => {
                    if (err) console.log(err);
                    res.redirect('/index/mainpage');
                }); 
        }
        else{
            res.render('home/views/addCategory', {alert: 0, type: req.session.user.userType});
        }
    });
    
    
});

// ----------- EDIT CATEGORY ------------------

var categ;
var categoryNum = 0;
var value = "";
var categoryTrim;

router.get('/editCategory', (req, res) => {
    db.query(`SELECT \`categoryName\` from \`post_category_tbl\``,(err, results, fields) =>{
        
     if (err) console.log(err);
     //console.log(results);
     res.render('home/views/editCategorySearch', {category: results, type: req.session.user.userType});
     });
     
});


router.post('/editCategoryName', (req, res) => {
    db.query(`SELECT * from \`post_category_tbl\` `, (err, results, fields) => { 
        
        if (err) console.log(err);
        categ = results;
        rend(categ);
        value = `${req.body.category}`;
        });

function rend(categ){
         db.query(`SELECT * FROM \`post_category_tbl\` WHERE \`categoryName\` = "${req.body.category}"`,(err, results, fields) => {
            if (err) console.log(err);
            var names = results;
            categoryNum = results[0].categoryID;
            res.render('home/views/editCategory', {category: categ, names: results, catValue: `${req.body.category}`});
        });
}
});


router.post('/editCategory', (req,res) => {
    categoryTrim = `${req.body.categoryname}`.trim();
    db.query(`SELECT * FROM \`post_category_tbl\` WHERE \`categoryName\` = "${categoryTrim}" `, (err,results,field) => {
           if(results == null || results == ""){
               rend(categoryNum);
           }
            else{
                res.render('home/views/editCategory', {alert: 0, category: categ, names: results, catValue: value});
            }
            
            
            
    });
    
    function rend(number){
        db.query(`UPDATE \`post_category_tbl\` SET  \`categoryName\` = "${req.body.categoryname}" where \`categoryID\` = ${categoryNum} `, (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/index/mainpage');
        });
    }
});



exports.signup = signUprouter;
exports.index = router;