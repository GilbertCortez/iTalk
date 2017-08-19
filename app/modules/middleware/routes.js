var express = require('express');
var loginRouter = express.Router();
var logoutRouter = express.Router();
var db = require('../../lib/database')();
var authMiddleware = require('./auth');
var tableUser = "user_tbl";


loginRouter.get('/', authMiddleware.noAuthed, (req,res) =>{
    res.render('../modules/home/views/login', req.query);
});

loginRouter.post('/',  (req,res) =>{
    db.query(`SELECT * FROM \`${tableUser}\` WHERE emailAddress = "${req.body.email}" `, (err, results, fields) => {
            if (err) throw err;
            if (results.length === 0) return res.render('../modules/home/views/login', {alert: 0});
          
            var user = results[0];
            
            if (user.password !== req.body.password) return res.render('../modules/home/views/login', {alert: 0});

            req.session.user = user;
          
            return res.redirect('/index/mainpage');
            
           
        });
});

logoutRouter.get('/', (req,res)=>{
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/logins');
    });
});



exports.logins = loginRouter;
exports.logout = logoutRouter;