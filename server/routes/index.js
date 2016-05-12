var express = require('express');
var router  = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.resolve(path.join(__dirname, '../dist'), 'index.html'));
    //res.render('index', {title: 'Express'});
});

module.exports.index = router;
