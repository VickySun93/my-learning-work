"use strict";
var gCurrentEmployeeID;
var authToken;
var gServerRootUrl = "http://localhost:8000"
var queryString;

var gCategory;
function body_onload() {
    Vue.component("friend-box", {
        template: "#friend-box-template",
        props: ["category", "dollar", "airdate", "question", "answer","id"],
        data: function() {
            return { 
                showGender: false,
                showConfirmation: false }
        },
        methods: {
            btnDelete_click: function () {
                this.showConfirmation = true;
               
                
            },
            btnYes_click: function () {
                this.$parent.friendDelete(this.id);
                this.showConfirmation = false;
            },
            btnNo_click: function () {
                this.showConfirmation = false;
            }
        }
    })
    new Vue({
        el: "#demoApp",
        data: {
            showNew: false,
            newID: "",
            newName: "",
            newGender: "",

            showSignIn: true,
            UserID: "",
            Password: "",
        
            showSearch: false,
            Searchbox: "",

            showAddNew: false,
            ShowNumber:"",
            AirDate: "",
            DollarValue:"",
            Question: "",
            Answer: "",
            CodeTitle:"",

            op1Message:"",
            showalert:false,


            friends: [],
        },
        
          

        methods: {
        
      
            btnSignIn_click: function () {
                signinEmployee(this.UserID, this.Password, signinSuccess);
                var that = this;
                function signinEmployee(a, b, successCallback) {
                   
                    var credentials = {
                        userID: a,
                        password: b
                    }
                    fetch(gServerRootUrl + "/auth/signin", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(credentials)
                    })
                        .then(checkResponse)
                        .then(parseResponse)
                        .catch(fetchError);

                    function checkResponse(response) {
                        if (response.ok !== true) {
                            if (response.status === 401) {
                                throw new Error("Invalid Employee ID and/or Password.");
                            }
                            throw new Error("An unexpected network server error occurred.");
                        }

                        return response.json();
                    }
                    function parseResponse(json) {
                        if (json.message === "success") {
                            that.showalert = false;
                            authToken = json.authToken;
                            successCallback();
                        }
                        else {
                            throw new Error(json.message);
                        }
                    }
                    function fetchError(error) {
                        that.op1Message = error.message;
                        that.showalert = true;
                    }
                }
                function signinSuccess() {               
                    // Save the Sign In state for the next time someone signs in.
                    // Save the signed in employee so we can use when querying entries.
                   // gCurrentEmployeeID = this.UserID;
                    // Close the modal.
                    that.showSignIn = false;
                    that.showSearch = true;                 
                    queryString = "?auth=" + authToken;
                    fetch(gServerRootUrl + "/category" + encodeURI(queryString))
                        .then(checkResponse)
                        .then(parseResponse)
                        .catch(fetchError);
                    return;
                    function checkResponse(response) {
                        if (response.ok !== true) {
                            throw new Error("An unexpected network server error occurred.");
                        }
                        return response.json();
                    }
                    function parseResponse(json) {
                        gCategory = json;
                        that.showalert = false;
                        var sel = document.getElementById('txtCategory');
                        for (var i = 0; i < 100; i++) {
                            var opt = document.createElement('option');
                            opt.innerHTML = gCategory[i].CategoryCode + ":"+gCategory[i].CategoryTitle;
                            opt.value = gCategory[i].CategoryCode +":" +gCategory[i].CategoryTitle;
                            sel.appendChild(opt);
                        }

                        //successCallback();
                    }
                    function fetchError(error) {
                        that.op1Message = error.message;
                        that.showalert = true;
                    }
                    //successCallback();
                }   
            },
            btnSearch_click: function () {
                var that = this;
                
                queryString = "?auth=" + authToken;
                if (this.Searchbox != "") {
                    queryString += "&questionText=" + this.Searchbox;
                } else {
                    this.friends = [];
                }
                
                fetch(gServerRootUrl + "/questions" + encodeURI(queryString))
                    .then(checkResponse)
                    .then(parseResponse)
                    .catch(fetchError);
                    return;

                function checkResponse(response) {

                    if (response.ok !== true) {
                        if (response.status === 400) {
                            throw new Error("too_many_results");
                        }
                        if (response.status === 500) {
                            throw new Error("Internal server error");
                        }
                    }

                    return response.json();
                }
               
                function parseResponse(json) {
                    that.showalert = false;
                    that.friends = json;
                    console.log(json);
                    for (var i = 0; i < that.friends.length; i++) {
                        //that.friends[i].CategoryCode = gCategory[that.friends[i].CategoryCode].CategoryTitle;
                        that.friends[i].DollarValue = "$" + that.friends[i].DollarValue;
                        that.friends[i].AirDate = "Aired " + that.friends[i].AirDate;
                    }
                    //successCallback();
                }

                function fetchError(error) {
                    that.op1Message = error.message;
                    that.showalert = true;
                }
            },
            btnAddNew_click: function () {
                this.showalert = false;
                this.showSearch = false;
                this.showAddNew = true;
            },
            btnAddNewSave_click: function () {
           
                var array = this.CodeTitle.split(":");
                console.log(array[0] + ":" + array[1]);
                var credentials = {
                    categoryCode: array[0],
                    categoryTitle: array[1],
                    airDate: this.AirDate,
                    questionText: this.Question,
                    dollarValue:this.DollarValue,
                    answerText:this.Answer,
                    showNumber: this.ShowNumber
                   
                }
                queryString = "?auth=" + authToken;
                fetch(gServerRootUrl + "/questionadd" + encodeURI(queryString), {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(credentials)
                })
                    .then(checkResponse)
                    .then(parseResponse)
                    .catch(fetchError);

                function checkResponse(response) {
                    if (response.ok !== true) {
                        if (response.status === 500) {
                            throw new Error("Internal server error");
                        }
                    }
                    return response.json();
                }
                var that = this;
                function parseResponse(json) {
                    if (json.message === "success") {
                        that.showAddNew = false;
                        that.showSearch = true;
                        that.showalert = false;
                    }
                    else {
                        throw new Error(json.message);
                    }
                }
                function fetchError(error) {
                    that.op1Message = error.message;
                    that.showalert = true;
                }

               
            },
            btnAddNewCancel_click: function () {
                this.showAddNew = false;
                this.showSearch = true;
                this.showalert = false;
            },         
            btnShowNew_click: function () {
                this.showNew = true;
            },           
            btnSave_click: function () {
                if (this.newID === "") {
                    this.showNew = false;
                    return;
                }
                var friend = { id: this.newID, name: this.newName, gender: this.newGender };
                this.friends.push(friend);
                this.newID = "";
                this.newName = "";
                this.newGender = "";
                this.showNew = false;
            },
            
            friendDelete: function (id) {
                var that = this;
                // If we had a database on the server, we'd tell the server to delete ID = id and
                // then we'd refresh the view model friends array.
                for (var i = 0; i < this.friends.length; i++) {
                    if (this.friends[i].QuestionID === id) {
                        this.friends.splice(i, 1);
                        break;
                    }
                }
                var credentials = {
                    QuestionID: id
                    
                }
                queryString = "?auth=" + authToken;
                fetch(gServerRootUrl + "/delete" + encodeURI(queryString), {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(credentials)
                })
                    .then(checkResponse)
                    .then(parseResponse)
                    .catch(fetchError);

                function checkResponse(response) {
                    if (response.ok !== true) {
                        if (response.status === 500) {
                            throw new Error("Internal server error");
                        }
                    }
                    return response.json();
                }
                function parseResponse(json) {
                    if (json.message === "success") {
                        that.showalert = false;
                    }
                    else {
                        throw new Error(json.message);
                    }
                }
                function fetchError(error) {
                    that.op1Message = error.message;
                    that.showalert = true;
                }

            }
        },
    })
}







