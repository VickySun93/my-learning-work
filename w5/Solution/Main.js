"use strict";
var globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
function body_onload() {
    window.onclick = window_onclick;
    //getEntries();
    sortEntries();
    showSignIn(signInSuccess);
    return;

    function signInSuccess() {
       
        // Init the UI.

      
        btnRefresh.onclick = btnRefresh_onclick;

        divEntriesHead1.onclick = divEntriesHead1_onclick;
        divEntriesHead2.onclick = divEntriesHead2_onclick;
        divEntriesHead3.onclick = divEntriesHead3_onclick;
        divEntriesHead4.onclick = divEntriesHead4_onclick;

        //checkentries();
        
        displayEntries();
       
        
    }
   
   

    function btnRefresh_onclick() {
        //getEntries();
        globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
        checkentries();
        sortEntries();
        setTimeout(function () {
            displayEntries();
        }, 1000);
      
    }

    function divEntriesHead1_onclick() {
        setSortOrder("1");
        globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
        checkentries();
        sortEntries();
        setTimeout(function () {
            displayEntries();
        }, 1000);
        
    }

    function divEntriesHead2_onclick() {
        setSortOrder("2");
        globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
        checkentries();
        sortEntries();
        setTimeout(function () {
            displayEntries();
        }, 1000);
        
    }

    function divEntriesHead3_onclick() {
        setSortOrder("3");
        globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
        checkentries();
        sortEntries();
        setTimeout(function () {
            displayEntries();
        }, 1000);
      
    }

    function divEntriesHead4_onclick() {
        setSortOrder("4");
        globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
        checkentries();
        sortEntries();
        setTimeout(function () {
            displayEntries();
        }, 1000);
        
    }

    function row_ondblclick() {
        showEdit("edit", this.Index, editSuccess);
        return;

        function editSuccess() {
            globalurl = "https://cs390-hw5.herokuapp.com/timelogs?";
            //getEntries();
            checkentries();
            sortEntries();
            displayEntries();
        }
    }

    function setSortOrder(column) {

        var sortColumn = localStorageGet("sortColumn", "1");
        var sortAscDesc = localStorageGet("sortAscDesc", "a");

        // If we are now sorting on the same column as last time, toggle between ascending/descending.
        // Otherwise just set the new sort column.
     
        if (column === sortColumn) {
            if (sortAscDesc === "a") {
                localStorageSet("sortAscDesc", "d");
            }
            else {
                localStorageSet("sortAscDesc", "a");
            }
        }
        else {
            localStorageSet("sortColumn", column);
        }
    }

    function sortEntries() {
        gEntries = new Array();
        var sortColumn = localStorageGet("sortColumn", "1");
        var sortAscDesc = localStorageGet("sortAscDesc", "a");

        if (sortColumn === "1") {
            if (sortAscDesc == "a") {
                globalurl = globalurl + "&sortBy=EmployeeID&orderBy=asc";
            } else {
                globalurl = globalurl + "&sortBy=EmployeeID&orderBy=desc";
            }
        } else if (sortColumn === "2") {
            if (sortAscDesc == "a") {
                globalurl = globalurl + "&sortBy=DateWorked&orderBy=asc";
            } else {
                globalurl = globalurl + "&sortBy=DateWorked&orderBy=desc";
            }
        } else if (sortColumn === "3") {
            if (sortAscDesc == "a") {
                globalurl = globalurl + "&sortBy=HoursWorked&orderBy=asc";
            } else {
                globalurl = globalurl + "&sortBy=HoursWorked&orderBy=desc";
            }
        } else if (sortColumn === "4") {
            if (sortAscDesc == "a") {
                globalurl = globalurl + "&sortBy=Description&orderBy=asc";
            } else {
                globalurl = globalurl + "&sortBy=Description&orderBy=desc";
            }
        }
        fetch(globalurl, {
            method: 'GET',
        })
        .then(function (response) {
            if (response.ok != true) {
                throw new Error("network error");
            }
            return response.json();
        })
        .then(function (json) {
            gEntries = json.slice();
            console.log(json);
        })
        .catch(function (err) {
            showAlert("sort error");
            return;
        })

        sortSetHeadings();
        displayEntries();

        return;

        function sortSetHeadings() {
            var arrow;

            divEntriesHead1.innerHTML = "Employee ID";
            divEntriesHead2.innerHTML = "Date";
            divEntriesHead3.innerHTML = "Hours";
            divEntriesHead4.innerHTML = "Description";

            if (sortAscDesc == "a") {
                arrow = " &uarr;"
            }
            else {
                arrow = " &darr;"
            }

            if (sortColumn === "1") {
                divEntriesHead1.innerHTML += arrow;
            }
            else if (sortColumn === "2") {
                divEntriesHead2.innerHTML += arrow;
            }
            else if (sortColumn === "3") {
                divEntriesHead3.innerHTML += arrow;
            }
            else if (sortColumn === "4") {
                divEntriesHead4.innerHTML += arrow;
            }
        }
    }
       
    function checkentries() {
        if (txtDescContains.value === "") {    
        } else {
            var searchFor = txtDescContains.value.toLowerCase();
            globalurl = globalurl + "&descContains=" + searchFor;
        }
        if (chkShowCurrEmp.checked === true) {
            globalurl = globalurl +"&forEmployeeID=" + gCurrentEmployeeID;  
        }
        if (validDate(txtDateFrom.value)) {
            globalurl = globalurl + "&dateFrom=" + txtDateFrom.value;
        }

        if (validDate(txtDateThrough.value)) {
            globalurl = globalurl + "&dateTo=" + txtDateThrough.value;
        }
        /*fetch(globalurl, {
            method: 'GET',
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            gEntries = json.slice();
         })
        .catch(function (err) {
            showAlert("can't checkentries.");
            return;
        })*/
    }

    function displayEntries() {
        
       
        var totalHoursWorked = 0;

        divEntriesList.innerHTML = "";

        for (var i = 0; i < gEntries.length; i++) {
          
            var entry = gEntries[i];

                var row = document.createElement("div");
                var col1 = document.createElement("div");
                var col2 = document.createElement("div");
                var col3 = document.createElement("div");
                var col4 = document.createElement("div");

                row.className = "divEntriesRow";
                row.Index = i;

                col1.className = "divEntriesCol1";
                col2.className = "divEntriesCol2";
                col3.className = "divEntriesCol3";
                col4.className = "divEntriesCol4";

                col1.innerHTML = entry.EmployeeID;
            
                var date = new Date(entry.DateWorked);
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();

                if (parseInt(month) < 10) {
                    month = "0" + month;
                }
                if (parseInt(day) < 10) {
                    day = "0" + day;
                }
                col2.innerHTML = year + "-" + month + "-" + day;

                //col2.innerHTML = entry.DateWorked;
                col3.innerHTML = parseFloat(entry.HoursWorked).toFixed(2);
                col4.innerHTML = entry.Description;

                row.ondblclick = row_ondblclick;

                row.appendChild(col1);
                row.appendChild(col2);
                row.appendChild(col3);
                row.appendChild(col4);

                divEntriesList.appendChild(row);

                totalHoursWorked += parseFloat(entry.HoursWorked);
          
        }

        lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
       
    }


}
