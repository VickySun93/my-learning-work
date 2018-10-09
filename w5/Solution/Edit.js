"use strict";

function showEdit(mode, index, successCallback) {
    var entry;

    divEdit.style.display = "flex";

   
    spanEditX.onclick = btnEditCancel_onclick;
    btnEditCancel.onclick = btnEditCancel_onclick;
   

    if (mode === "edit") {

        spanEditTitle.innerHTML = "Edit";

        entry = gEntries[index];

        txtEmployeeID.value = entry.EmployeeID;
        txtHoursWorked.value = entry.HoursWorked;
        var date = new Date(entry.DateWorked);

        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();

        if (parseInt(month) < 10) {
            month = "0" + month;
        }
        if (parseInt(day) < 10) {
            day = "0" + day;
        }
        txtDateWorked.value = year + "-" + month + "-" + day;
       // txtDateWorked.value = entry.DateWorked;
        chkBillable.checked = entry.Billable;
        txtDescription.value = entry.Description;

       
    }
    else {
        spanEditTitle.innerHTML = "Add";

        txtEmployeeID.value = gCurrentEmployeeID
        txtHoursWorked.value = "";
        var date = new Date();
        txtDateWorked.valueAsDate = date;
        txtDescription.value = "";
      
    }
    return;

    function btnEditSave_onclick() {

        // Check to make sure all the inputs are valid

        if (txtEmployeeID.value === "") {
            showAlert("Employee ID is required.");
            txtEmployeeID.focus();
            return;
        }

        if (!validHoursWorked(txtHoursWorked.value)) {
            showAlert("Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.");
            txtHoursWorked.focus();
            return;
        }

        if (!validDate(txtDateWorked.value)) {
        	showAlert("Date Worked is required.");
        	txtDateWorked.focus();
        	return;
        }

        if (txtDescription.value.length < 20) {
        	showAlert("Description is required and must be at least 20 characters long.");
        	txtDescription.focus();
        	return;
        }

        // Create a new entry object using the inputs from the user and either add it to the list,
        // or replace the exsiting entry in the list.

        var entry = {
        	EmployeeID: txtEmployeeID.value,
        	DateWorked: txtDateWorked.value,
        	HoursWorked: txtHoursWorked.value,
        	Billable: chkBillable.checked,
        	Description: txtDescription.value
        }

        if (mode === "add") {
        	gEntries.push(entry);
        }
        else {
        	gEntries[index] = entry;
        }

       
        divEdit.style.display = "none";
        successCallback();
    }

    function btnEditCancel_onclick() {
        divEdit.style.display = "none";
    }


	
    function validHoursWorked(hrs) {
	    var floatHrs = parseFloat(hrs);
	    if (floatHrs <= 0 || hrs > 4.00) {
		    return false;
	    }
	    if (floatHrs * 4 === parseInt(floatHrs * 4)) {
		    return true;
	    }
	    return false;
    }
}
