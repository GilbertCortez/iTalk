var express = require('express');
var router = express.Router();
var authMiddleware = require('../middleware/auth');

router.use(authMiddleware.hasAuth);

router.get('/', (req,res) =>{
    res.render('admin/views/index');
});

exports.admin = router;