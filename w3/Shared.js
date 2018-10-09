var gFriends;
function getFriends() {
	var json = localStorage.getItem("Friends"); //Load the string we saved earlier
	
	if(json !== null) {
		gFriends = JSON.parse(json); //Convert the string we loaded into an array
	}
}
function reset() {
	for(var i = 0; i < gFriends.length; i++) {
		var divDoc = document.getElementById("divFriendsRow" + (i));
		divFriendsList.removeChild(divDoc);
	}
}