var gFriends;


function body_onload() {
	
	gFriends = [];
	create();
	var input1 = localStorage.getItem("checkbox"); 

	if(input1 != "") {
		txtEmployeeID.value = input1;
		txtPassword.focus();
	}
	btnSignIn.onclick = btnSignIn_onclick;
	
	

}
 //Create five hard coded employees information
function create(){
	var friend1 = {
	    EmployeeID: "jun",
	    Password:"123" 
	
	}
	gFriends.push(friend1);
	
	var friend2 = {
	    EmployeeID: "ran",
	    Password:"234"
	
	}
	gFriends.push(friend2);
	
	var friend3 = {
	    EmployeeID: "dede",
	    Password:"345"
	
	}
	gFriends.push(friend3);
	
	var friend4 = {
	    EmployeeID: "zhu",
	    Password:"456" 
	
	}
	gFriends.push(friend4);
	
	var friend5 = {
	    EmployeeID: "wewe",
	    Password:"789" 
	
	}
	gFriends.push(friend5);
	
	
}
function btnSignIn_onclick() {

    //Check to make sure all the inputs are valid

    if (txtEmployeeID.value === "") {
        alert("Employee ID is required.");
        txtEmployeeID.focus();
        return;
    }
	 if (txtPassword.value === "") {
        alert("Password is required.");
        txtPassword.focus();
        return;
    }
	for(i=0; i<5; i++){
		if(txtEmployeeID.value=== gFriends[i].EmployeeID){
			if(txtPassword.value===gFriends[i].Password){
				localStorage.setItem("InputtedEmployeeID", txtEmployeeID.value);
				if(chkBillable.checked === true){
					 //Also store the employee ID
					localStorage.setItem("checkbox", txtEmployeeID.value); 
				}else{
					localStorage.setItem("checkbox", ""); 
				}
				location.href="Main.html?sign=true";
				return;
			}else{
				alert("Password is incorrect.");
				return;
			}
		}

	}


}







