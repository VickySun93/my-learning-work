
function body_onload() {
	var url = location.search;
	if(url===""){
		alert("Please login first");
		location.href="SignIn.html" ;
	}
	gFriends = [];
	getFriends();
	
	var res = url.split("=");
	if(res[1]=== "-1"){
		var date = new Date();
		txtDateWorked.valueAsDate = date;
	}else{	
		
		var index = parseInt(res[1]);
		txtEmployeeID.value=gFriends[index].EmployeeID;
		txtDateWorked.value=gFriends[index].DateWorked;
		txtHoursWorked.value=gFriends[index].HoursWorked;
		txtDescription.value=gFriends[index].Description;
		btnDelete.onclick = btnDelete_onclick;
	}
	btnSave.onclick = btnSave_onclick;	
}

function btnSave_onclick() {

    //Check to make sure all the inputs are valid
	var querystring = location.search;
	var res = querystring.split("=");
	
	if(res[1]==="-1"){
		if (txtEmployeeID.value === "") {
			alert("Employee ID is required.");
			txtEmployeeID.focus();
			return;
		}

		if (!validHoursWorked(txtHoursWorked.value)) {
			alert("Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.");
			txtHoursWorked.focus();
			return;
		}

		if (!validDate(txtDateWorked.value)) {
			alert("Date Worked is required.");
			txtDateWorked.focus();
			return;
		}

		if (txtDescription.value.length < 20) {
			alert("Description is required and must be at least 20 characters long.");
			txtDescription.focus();
			return;
		}	
	
    //Create a friend object using the inputs from the user
		var friend = {
			EmployeeID: txtEmployeeID.value,
			DateWorked: txtDateWorked.value,
			HoursWorked: txtHoursWorked.value,
			Description: txtDescription.value
		}

		gFriends.push(friend);
		saveFriends();
		

		//Clear input fields
		txtHoursWorked.value = "";
		txtDescription.value = "";
		chkBillable.checked = false;
		location.href="Main.html?edit=true";
		
	}else{
		if (txtEmployeeID.value === "") {
			alert("Employee ID is required.");
			txtEmployeeID.focus();
			return;
		}

		if (!validHoursWorked(txtHoursWorked.value)) {
			alert("Hours Worked must be a valid number greater than zero and less than 4.00, and only in fifteen-minute intervals.");
			txtHoursWorked.focus();
			return;
		}

		if (!validDate(txtDateWorked.value)) {
			alert("Date Worked is required.");
			txtDateWorked.focus();
			return;
		}

		if (txtDescription.value.length < 20) {
			alert("Description is required and must be at least 20 characters long.");
			txtDescription.focus();
			return;
		}	
		var index = parseInt(res[1]);
		gFriends[index].EmployeeID=txtEmployeeID.value;
		gFriends[index].DateWorked=txtDateWorked.value;
		gFriends[index].HoursWorked=txtHoursWorked.value;
		gFriends[index].Description=txtDescription.value;
		saveFriends();
		txtHoursWorked.value = "";
		txtDescription.value = "";
		chkBillable.checked = false;
		
		location.href="Main.html?edit=true";
		
	}
}

//Make sure the date is valid
function validDate(dateString) {

    var date = new Date(dateString);
	
    if (date === "Invalid Date"||dateString ==="") {
        return false;
    }

	return true;
}

//Make sure the hours are valid
function validHoursWorked(hrs) {
	var floatHrs = parseFloat(hrs);
	if(floatHrs <= 0 || hrs > 4.00) {
		return false;
	}
	if(floatHrs * 4 === parseInt(floatHrs * 4)) {
		return true;
	}
	return false;
}

function btnDelete_onclick() {
	var querystring = location.search;
	var res = querystring.split("=");
	var a = confirm("Are you sure you want to delete this item?");
    if ( a=== false) {
	
        return;
    }else{
	
		gFriends.splice(res[1], 1);
		saveFriends();
		
		location.href="Main.html?edit=true";
	
		return;
	}

}

//Save the hours array into localStorage
function saveFriends() {
	var json = JSON.stringify(gFriends); //Convert data array to a single string
	localStorage.setItem("Friends", json); //Store the string into local storage

}




