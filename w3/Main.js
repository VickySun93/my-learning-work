

function body_onload() {
	
	var url = location.search;
	if(url===""){
		alert("Please login");
		location.href="SignIn.html" ;
	}
	var res = url.split("=");
	var id = res[1];
	if(id!="true"){location.href="SignIn.html" ;}
	
	gFriends = [];
	getFriends();
//navigating from edit.html 
	if(res[0]==="?edit"){
		
		var input1 = localStorage.getItem("DescriptionContains"); 
		var input2 = localStorage.getItem("DateFrom"); 
		var input3 = localStorage.getItem("Through"); 
		var input4 = localStorage.getItem("check"); 
		if(input1 != null) {
			txtDescriptionContains.value = input1;
		}
		if(input2 != null) {
			txtDateFrom.value = input2;
		}
		if(input3 != null) {
			txtThrough.value = input3;
		}
		if(input4==="true") {
			chkShowCurrent.checked  = true;
		}else{
			chkShowCurrent.checked  = false;
		}
	}
	btnAddNew.onclick = btnAddNew_onclick;
	btnRefresh.onclick = btnRefresh_onclick;
	displayFriends(0, gFriends.length);
	}
function btnAddNew_onclick(){
	if(chkShowCurrent.checked===true){
		localStorage.setItem("check", "true");
	}else{
		localStorage.setItem("check", "false");
	}
	
	localStorage.setItem("DescriptionContains", txtDescriptionContains.value);
	localStorage.setItem("DateFrom", txtDateFrom.value);
	localStorage.setItem("Through", txtThrough.value);
	location.href="Edit.html?index=-1" ;
}
var id;
var inputID = localStorage.getItem("InputtedEmployeeID"); //Load the employee ID we saved earlier
if(inputID !== null) {
		id = inputID;
}

function btnRefresh_onclick(){
	divFriendsList.innerHTML = "";
    lblTotalHoursWorked.innerHTML = "";
	getFriends();
	displayFriends(0, gFriends.length);	
}
function displayFriends(start, end) {
	divFriendsList.innerHTML = "";
    lblTotalHoursWorked.innerHTML = "";
    var i;
	var totalHoursWorked = 0;
    for (i = start; i < end; i++) {
		var friend = gFriends[i];
		var dworked = new Date(friend.DateWorked);
//filter
		if(chkShowCurrent.checked === true){
			
			if(friend.EmployeeID !=id){
				continue;
			}
		}
		if(txtDescriptionContains.value!=""){
			var str = friend.Description.toLowerCase();
			var res = txtDescriptionContains.value.toLowerCase();
			if(!str.includes(res)){
				continue;
			}		
		}
		if(txtDateFrom.value !=undefined){
			
			var dfrom = new Date(txtDateFrom.value);
			if(dworked< dfrom){	
			
				continue;
			}
		}
		if(txtThrough.value !=undefined){
			
			var dthrough = new Date(txtThrough.value);
			if(dworked> dthrough){	
		
				continue;
			}
		}	
		var row = document.createElement("div");
		var col1 = document.createElement("div");
		var col2 = document.createElement("div");
		var col3 = document.createElement("div");
		var col4 = document.createElement("div");

		row.className = "divFriendsRow";
		row.id = "divFriendsRow" + (i);

		col1.className = "divFriendsColl1";
		col2.className = "divFriendsColl2";
		col3.className = "divFriendsColl3";
		col4.className = "divFriendsColl4";

		
		row.ondblclick = edit_onclick;
		
		row.Index = i;

		col1.innerHTML = friend.EmployeeID;
		col2.innerHTML = friend.DateWorked;
		col3.innerHTML = friend.HoursWorked;
		col4.innerHTML = friend.Description;

		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		row.appendChild(col4);

		divFriendsList.appendChild(row);
		totalHoursWorked += parseFloat(gFriends[i].HoursWorked);
	}

    // Calculate total hours worked.
	lblTotalHoursWorked.innerHTML = "Total Hours Worked: " + totalHoursWorked.toFixed(2).toString();
}

function edit_onclick(){
	if(chkShowCurrent.checked===true){
		localStorage.setItem("check", "true");
	}else{
		localStorage.setItem("check", "false");
	}
	localStorage.setItem("DescriptionContains", txtDescriptionContains.value);
	localStorage.setItem("DateFrom", txtDateFrom.value);
	localStorage.setItem("Through", txtThrough.value);
	var selectedindex = this.Index;
	location.href="Edit.html?index="+selectedindex;
	
}