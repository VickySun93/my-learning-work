var gEmployees;

function body_onload() {
    btnAdd1.onclick = btnSave_onclick;
    getEmployees();
    refreshEmployees();

}

function isValidHours(a) {
    var b = parseFloat(a);
    if (b === 0) {
        return false;
    }
    var remain = b % 0.25;
    if (remain === 0) {
        if (0.00 > b || b >=4.00 ) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function btnSave_onclick() {
    if (txtOp1.value != "") {
        if (txtOp3.value != "" ) {
            if (isValidHours(txtOp2.value)) {
                if (txt_comments.value.length >= 20) {
                    var employee = new Object();
                    var today = new Date(txtOp3.value);
                    var date 
                    if (today.getMonth() + 1 < 10) {
                        date = '0' + (today.getMonth() + 1) + '/' + (today.getDate()+1) + '/' + today.getFullYear();
                    } else {
                        date = (today.getMonth() + 1) + '/' + (today.getDate()+1) + '/' + today.getFullYear();
                    }
                    employee.Name = txtOp1.value;
                    employee.Date = date;
                    employee.Hours = txtOp2.value;
                    employee.Description = txt_comments.value;
                    var employee = {
                        Name: txtOp1.value,
                        Date: date,
                        Hours: txtOp2.value,
                        Description: txt_comments.value
                    };
                    gEmployees.push(employee);
                   
                    saveEmployees();
                    refreshEmployees();
                    txtOp1.value = "";
                    txtOp3.value = "";
                    txtOp2.value = "";
                    txt_comments.value = "";
                } else {
                    alert("Description contains text of at least 20 characters.");
                    document.getElementById("txt_comments").focus();
                }
            } else {
                alert("Hours Worked is a valid number greater than zero and less than 4.00, and only in fifteen-minuteintervals. ");
                document.getElementById("txtOp2").focus();
            }
        } else {
            alert("Date is not empty and is a valid date.");
            document.getElementById("txtOp3").focus();
        }
    } else {
        alert("Employee ID is not empty ");
        document.getElementById("txtOp1").focus();
    }
}
function saveEmployees() {
    var jsonEmployees = JSON.stringify(gEmployees);
    localStorage.setItem("Employees", jsonEmployees);
}
function getEmployees() {
    gEmployees = new Array();
    var jsonEmployees = localStorage.getItem("Employees");
    if (jsonEmployees == null) {
        return;
    }
    gEmployees = JSON.parse(jsonEmployees);
}
var total = document.createElement("div");
total.className = "divTotal";
function refreshEmployees(){ 
    divEmployeesList.innerHTML = "";
    total.innerHTML = "";
 
    var count = parseFloat("0");
   
    if (gEmployees!=null) {
        for (var i = 0; i < gEmployees.length; i++) {

            var Employee = gEmployees[i];
            
            var row = document.createElement("div");
            var col1 = document.createElement("div");
            var col2 = document.createElement("div");
            var col3 = document.createElement("div");
            var col4 = document.createElement("div");
            var col5 = document.createElement("div");

            row.classNmae = "divEmployeesRow";
            col1.className = "divEmployeesRowCol1";
            col2.className = "divEmployeesRowCol2";
            col3.className = "divEmployeesRowCol3";
            col4.className = "divEmployeesRowCol4";
            col5.className = "divEmployeesRowCol5";
         

            col1.innerHTML = gEmployees[i].Name;
            col2.innerHTML = gEmployees[i].Date;
            col3.innerHTML = gEmployees[i].Hours;
            col4.innerHTML = gEmployees[i].Description;
            col5.innerHTML = "Delete";

            count = count + parseFloat(gEmployees[i].Hours);
            total.innerHTML = count.toString();

            col5.onclick = col5_onclick;
            col5.Index = i;

            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);
            row.appendChild(col5);
            divEmployeesList.appendChild(row);
        }
    }
    document.body.appendChild(total);

}
function col5_onclick() {
    if (confirm("Are you sure you want to delete this entry?")) {
        var index = this.Index;
        var count = parseFloat(total.innerHTML) - parseFloat(gEmployees[index].Hours);
        total.innerHTML = count.toString();
        gEmployees.splice(this.Index, 1);
        saveEmployees();
        refreshEmployees();
    }
}
