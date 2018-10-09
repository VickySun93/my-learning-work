var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('Jeopardy.db');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	return res.send("Hello World");
});

app.get('/ping', function(req, res) {
	var name = req.query.myname;
	if(name) {
		return res.send("Hello " + name);
	}
	else {
		return res.send("Hello CS390!");
	}
});


app.post('/auth/signin', function(req, res) {
    var {userID, password} = req.body;
    console.log(req.body);
    var params = [];
    var currentQuery = "SELECT * FROM Users ORDER BY UserID ASC";
    var count =0;
    userID = userID.toLowerCase();
    db.all(currentQuery, params, function(err, rows) {
        if(userID ==="" || password ===""){
            return res.status(400).json(
				{message: "invalid_data"});
        }
      
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if(userID === row.UserID.toLowerCase()){
                count =1;
                if(password === row.UserPassword){
                    return res.status(200).json({message: "success"});
                }else{
                    return res.status(401).json({message: "invalid_credentials"});
                }
            }
        }
        if(count===0){
            return res.status(401).json({message: "invalid_credentials"});
        }
    });
});



app.get('/questions', function(req, res) {
   
    var myQuery = "SELECT CategoryTitle, AirDate, QuestionText, DollarValue, AnswerText, ShowNumber"+
        " FROM Questions JOIN Categories"+
        " ON Questions.CategoryCode = Categories.CategoryCode"+
        " WHERE";
    var params = [];
    if(req.query.categoryTitle) {
       
        myQuery += "  UPPER(CategoryTitle) = UPPER('" + req.query.categoryTitle + "') AND";
    } 
 
    if(req.query.airDate) {
        var date = req.query.airDate.split("-");
        if(date.length <3){
            return res.status(400).json(
                    {message: "invalid_data"});
        }
        var year = date[0].charAt(2) + date[0].charAt(3);
        
        if(parseInt(date[1]) < 10 ){
            var month = date[1].charAt(1);
        }else{
            var month = date[1];
        }
        if(parseInt(date[2]) < 10 ){
            var day = date[2].charAt(1);
        }else{
            var day = date[2];
        }
        var check = new Date(req.query.airDate);
        if (check === "Invalid Date") {
            return res.status(400).json(
                    {message: "invalid_data"});
        }else{
            if(date[0].length < 4 || date[1].length < 2 || date[2].length < 2 ){
                return res.status(400).json(
                    {message: "invalid_data"});
            }

        }
        var newdate = month + "/" + day + "/" + year;
        myQuery += " AirDate = '" + newdate + "' AND";
    }
    if(req.query.questionText) {
        myQuery += "  UPPER(QuestionText) LIKE UPPER('%" + req.query.questionText  + "%') AND";
    }
    if(req.query.dollarValue) {
        if(isNaN(req.query.dollarValue)){
            return res.status(400).json(
                    {message: "invalid_data"});
        }
        if(!Number.isInteger(parseFloat(req.query.dollarValue))){
            return res.status(400).json(
                    {message: "invalid_data"});
        }
        var dollar = parseFloat(req.query.dollarValue).toLocaleString();

        myQuery = myQuery +" DollarValue = '$" + dollar + "'" +" AND";
        
    }
    if(req.query.answerText) {
        myQuery += "  UPPER(AnswerText) LIKE UPPER('%" + req.query.answerText  + "%') AND";
    }
    if(req.query.showNumber) {
        if(isNaN(req.query.showNumber)){
            return res.status(400).json(
                    {message: "invalid_data"});
        }
        if(!Number.isInteger(parseFloat(req.query.showNumber))){
            return res.status(400).json(
                    {message: "invalid_data"});
        }
        myQuery = myQuery + " ShowNumber = " + req.query.showNumber +" AND"; 
    }
    myQuery = myQuery + " 1=1"
    myQuery += " ORDER BY AirDate DESC;"

    db.all(myQuery, params, function(err, rows) {
        //console.log(myQuery);
        //console.log(rows.length);
        if(rows.length >5000){
            return res.status(400).json(
               {message: "too_many_results"});
        }else{
            if(err) {
                return res.status(400).json(
                    {message: "invalid_data"});
            }
            else {
                return res.status(200).json(rows);
            }
        }
    });
});



var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
	console.log(`App listening on port ${port}`);
});




