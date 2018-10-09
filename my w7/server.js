/*
	"categoryCode": "1",
	"categoryTitle": "History",
	"airDate": "2004-12-31",
	"questionText": "'In the title of an Aesop fable, this insect shared billing with a grasshopper'",
	"dollarValue": 200,
	"answerText": "the ant",
	"showNumber": 4680


     "userID":"user3",
     "password":"pass3"
*/
var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('Jeopardy(4).db');
var cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
app.post('/auth/signin', function(req, res) {
    var userID = req.body.userID;
    var password = req.body.password;
    //console.log(req.body);
    if(userID == null || password == null) {
        return res.status(401).json({message: "invalid_credentials"});
    }

    var dbQuery = "SELECT * FROM Users WHERE UserID = ? AND UserPassword = ?";
    var requestParams = [userID, password];

    db.get(dbQuery, requestParams, function(err, user) {
        if(err) {
            return res.status(500).json({message: "Internal server error"});
        }

        if(user == null) {
            return res.status(401).json({message: "invalid_credentials"});
        }
        //generate token
        const uuidv1 = require('uuid/v1');
        var uuid = uuidv1();

        var today = new Date();
        var date = today.getFullYear() + " " + (today.getMonth() + 1) + " " + today.getDate();
        var time = today.getHours() + " " + today.getMinutes() + " " + today.getSeconds() + " " + today.getMilliseconds();
        var dateTime = date + ' ' + time;

        var sql = "UPDATE Users SET"
        + " AuthToken = ?,"
        + " AuthTokenIssued = ?"
        + " WHERE UserID = ?";
       
        db.run(sql, [uuid, dateTime, userID]);
        return res.status(200).json({ message: "success", authToken: uuid });
    });
});

app.post("/questionadd", function (req, res) {
    var auth = req.query.auth;
    if (auth === undefined) {
        return res.status(400).json(
                  { message: "unauthorized access" });
    } else {
        var Query = "SELECT * FROM Users WHERE AuthToken = ?";
        var requestParams = [auth];
        db.get(Query, requestParams, function (err, row) {
            //console.log(row);
            if (row === undefined) {
                return res.status(400).json({ message: "unauthorized access" });
            } else {

                var time = row.AuthTokenIssued;
                var time = time.split(" ");
                var year = parseInt(time[0]);
                var month = parseInt(time[1]) - 1;
                var day = parseInt(time[2]);
                var hours = parseInt(time[3]);
                var minutes = parseInt(time[4]);
                var seconds = parseInt(time[5]);
                var milliseconds = parseInt(time[6]);

                var authtime = new Date(year, month, day, hours, minutes, seconds, milliseconds);
                var today = new Date();
                var hourdiff = parseFloat((today - authtime) / (1000 * 60 * 60)   );
                console.log(hourdiff);
                if (hourdiff > 1) {
                    return res.status(400).json({ message: "auth token expired" });
                }
                //--------------------------------------------------------------------------
                var categoryTitle = req.body.categoryTitle;
                var dollarValue = req.body.dollarValue;
                var questionText = req.body.questionText;
                var answerText = req.body.answerText;
                var showNumber = req.body.showNumber;
                var airDate = req.body.airDate;
                var categoryCode = req.body.categoryCode;
                if (airDate === null || showNumber === null || dollarValue === null || questionText === null || answerText === null || categoryCode === null || categoryTitle === null) {
                    return res.status(400).json(
                              { message: "invalid request body" });
                }
                if (airDate === "" || showNumber === "" || dollarValue === "" || questionText === "" || answerText === "" || categoryCode === "" || categoryTitle === "") {
                    return res.status(400).json(
                              { message: "invalid request body" });
                }
                if (showNumber) {
                    if (isNaN(showNumber)) {
                        return res.status(400).json(
                                { message: "invalid showNumber" });
                    }
                    if (!Number.isInteger(parseFloat(showNumber))) {
                        return res.status(400).json(
                                { message: "invalid showNumber" });
                    }
                    if (parseFloat(showNumber) < 0) {
                        return res.status(400).json(
                               { message: "invalid showNumber" });
                    }
                }
                if (dollarValue) {
                    if (isNaN(dollarValue)) {
                        return res.status(400).json(
                                { message: "invalid dollarValue" });
                    }
                    if (!Number.isInteger(parseFloat(dollarValue))) {
                        return res.status(400).json(
                                { message: "invalid dollarValue" });
                    }
                    if (parseInt(dollarValue) < 100 || parseInt(dollarValue) > 2000 || parseInt(dollarValue) % 200 !== 0) {
                        return res.status(400).json(
                               { message: "invalid dollarValue" });
                    }

                }

                var dbQuery2 = "SELECT * FROM Categories WHERE CategoryCode = ?";
                var requestParams2 = [categoryCode.toUpperCase()];

                db.get(dbQuery2, requestParams2, function (err, category) {
                    var sql2 = "INSERT INTO Questions (ShowNumber, AirDate, CategoryCode, DollarValue, QuestionText, AnswerText) VALUES (?, ?, ?, ?, ?, ?)";
                    if (err) {
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    if (category !== undefined) {
                        if (category.CategoryTitle.toLowerCase() !== categoryTitle.toLowerCase()) {
                            return res.status(400).json({ message: "Invalid Category Title" });
                        } else {
                            db.run(sql2, [showNumber, airDate, categoryCode, dollarValue, questionText, answerText]);
                            console.log("record inserted to questions1");
                            return res.status(200).json({ message: "success" });
                        }
                    } else {
                        var dbQuery3 = "SELECT * FROM Categories WHERE CategoryTitle = ?";
                        var requestParams3 = [categoryTitle.toUpperCase()];
                        db.get(dbQuery3, requestParams3, function (err, category2) {
                            if (err) {
                                return res.status(500).json({ message: "Internal server error" });
                            }
                            if (category2 !== undefined) {
                                return res.status(400).json({ message: "Invalid Category Code" });
                            } else {
                                var sql = "INSERT INTO Categories (CategoryCode, CategoryTitle) VALUES (?, ?)";

                                db.run(sql, [categoryCode, categoryTitle]);
                                console.log("record inserted to category3");
                                

                                db.run(sql2, [showNumber, airDate, categoryCode, dollarValue, questionText, answerText]);
                                console.log("record inserted to questions2");
                                return res.status(200).json({ message: "success" });
                            }
                        });
                    }
                   

                });
             

            }
        });
    }
});
app.get('/questions', function (req, res) {
 
    var auth = req.query.auth;
    if (auth === undefined) {
        return res.status(400).json(
                  { message: "unauthorized access" });
    } else {
        var Query = "SELECT * FROM Users WHERE AuthToken = ?";
        var requestParams = [auth];

        db.get(Query, requestParams, function (err, row) {
            if (row == undefined) {
                return res.status(400).json({ message: "unauthorized access" });
            } else {

                var time = row.AuthTokenIssued;
                var time = time.split(" ");
                var year = parseInt(time[0]);
                var month = parseInt(time[1])-1;
                var day = parseInt(time[2]);
                var hours = parseInt(time[3]);
                var minutes = parseInt(time[4]);
                var seconds = parseInt(time[5]);
                var milliseconds = parseInt(time[6]);

                var authtime = new Date(year, month, day, hours, minutes, seconds, milliseconds);
                var today = new Date();
                var hourdiff = parseFloat((today - authtime) / (1000 * 60 * 60));
                //console.log(hours);
               // console.log(authtime);
               // console.log(hourdiff);
                if (hourdiff > 1) {
                    return res.status(400).json({ message: "auth token expired" });
                }
                var categoryTitle = req.query.categoryTitle;
                var dollarValue = req.query.dollarValue;
                var questionText = req.query.questionText;
                var answerText = req.query.answerText;
                var showNumber = req.query.showNumber;
                var airDate = req.query.airDate;
                var dbQuery = "SELECT * FROM Questions JOIN Categories ON Questions.CategoryCode = Categories.CategoryCode WHERE ";
                var paramCount = 0;
                var params = [];
               // console.log("aaa");
                if (categoryTitle != null) {

                    if (paramCount > 0) {
                        dbQuery = dbQuery + 'AND ';
                    }

                    paramCount++;
                    dbQuery = dbQuery + 'CategoryTitle = ? ';
                    params.push(categoryTitle.toUpperCase());
                }

                if (dollarValue != null) {

                    if (paramCount > 0) {
                        dbQuery = dbQuery + 'AND ';
                    }

                    paramCount++;
                    dbQuery = dbQuery + 'DollarValue = ? ';
                    // dollarValue =  dollarValue;
                    params.push(dollarValue);
                }

                if (questionText) {

                    if (paramCount > 0) {
                        dbQuery = dbQuery + 'AND ';
                    }

                    paramCount++;
                    dbQuery = dbQuery + 'QuestionText like ? ';
                    questionText = '%' + questionText + '%';
                    params.push(questionText);
                }

                if (answerText) {

                    if (paramCount > 0) {
                        dbQuery = dbQuery + 'AND ';
                    }

                    paramCount++;
                    dbQuery = dbQuery + 'AnswerText = ? ';
                    params.push(answerText);
                }

                if (showNumber) {

                    if (paramCount > 0) {
                        dbQuery = dbQuery + 'AND ';
                    }

                    paramCount++;
                    dbQuery = dbQuery + 'ShowNumber = ? ';
                    params.push(showNumber);
                }

                if (airDate) {

                    if (paramCount > 0) {
                        dbQuery = dbQuery + 'AND ';
                    }

                    paramCount++;
                    dbQuery = dbQuery + 'AirDate = ? ';
                    params.push(airDate);
                }

                dbQuery = dbQuery + 'ORDER BY AirDate DESC';

                if (paramCount == 0) {
                    dbQuery = "SELECT * FROM Questions ORDER BY AirDate DESC";
                }

                db.all(dbQuery, params, (err, questions) => {

                    if (questions.length > 5000) {
                        return res.status(400).json({ message: "too_many_results" });
                    }

                    if (err) {
                        //console.log(err);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    return res.status(200).json(questions);
                });
            }
        });
    }
    
});



var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
	console.log(`App listening on port ${port}`);
});




