
function body_onload() {
    txtOp2.value = "7.0";
    txtOp3.value = "18.00";
    btnAdd1.onclick = btnAdd1_onclick;
    btnAdd2.onclick = btnAdd2_onclick;

}
function isDigit(c) {
    var char = c.charCodeAt(0);
    if ((char > 47) && (char < 58)) {
        return true;
    }
    return false;
}
function tryParse(a, b) {
    for (var i = 0; i<a.length; i++) {
        var c = a.charAt(i);
        if (c === '-' && i === 0) {
           alert("Negative number is not valid. Enter a positive number.");
           return false;
        } 
        if (c === '-'&& i!=0) {
            alert("hyphen character must be present in a sensible position.");
            return false;
        }
        if (c === '.') {
            var d = a.length - 1 - i;
            if ( d> 2) {
                alert(" Only two decimal positions are allowed.");
                return false;
            }
            for (var j = i+1; j < d+i+1 ; j++) {
                var e = a.charAt(j);
                if (isDigit(e) ===false ) {
                    alert("Character is not digit! ");
                    return false;
                }
            } 
            return true;
            
        }
        if (isDigit(c)===false ) {
            alert("Character is not digit. ");
            return false;
        }      
    }
    return true;
}
function btnAdd1_onclick() {
    var a = tryParse(txtOp1.value, 2);
    var b = tryParse(txtOp2.value, 2);
    var c = tryParse(txtOp3.value, 2);
    if (a === true && b === true & c === true) {
        var check = parseFloat(txtOp1.value);
        var taxpercent = parseFloat(txtOp2.value);
        var tippercent = parseFloat(txtOp3.value);
        tax = check -check/ (1+taxpercent / 100);
        txtOp4.value = tax.toFixed(2);
        tip = (check-tax) * tippercent / 100;
        txtOp5.value = tip.toFixed(2);
    } else {
        
        if (a === false) {
            document.getElementById("txtOp1").focus();
        }
        if (b === false) {
            document.getElementById("txtOp2").focus();
        }
        if (c === false) {
            document.getElementById("txtOp3").focus();
        }
   
    }
  
}
function btnAdd2_onclick() {
    var a = tryParse(txtOp1.value, 2);
    var b = tryParse(txtOp2.value, 2);
    var c = tryParse(txtOp3.value, 2);
    if (a === true && b === true & c === true) {
         var check = parseFloat(txtOp1.value);
        var taxpercent = parseFloat(txtOp2.value);
        var tippercent = parseFloat(txtOp3.value);
        tax = check - check / (1 + taxpercent / 100);
        txtOp4.value = tax.toFixed(2);
        tip = check  * tippercent / 100;
        txtOp5.value = tip.toFixed(2);
    } else {
        if (a === false) {
            document.getElementById("txtOp1").focus();
        }
        if (b === false) {
            document.getElementById("txtOp2").focus();
        }
        if (c === false) {
            document.getElementById("txtOp3").focus();
        }
      
    }
    

}