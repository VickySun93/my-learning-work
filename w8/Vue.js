



function body_onload() {
    new Vue({
        el: "#calculator",  

        data: {
            op1: "",  
            op2: "7.0",
            op3: "18.00",
            tip: "TipPreTax",
        },

        computed: {
            op1Message: function(){
                if(this.op1 === ""){
                    return "";	
                }
                if (tryParse(this.op1, 2) === false ) {
                    return "Check Amount is required and must be a valid number > zero."
                }
                return "";
            },
            op2Message: function(){
                if(this.op2 === ""){
                    return "";		
                }
                if (tryParse(this.op2, 2) === false ) {
                    return "Sales Tax Percent is required and must be a valid number > zero."
                }
                return "";
            },
            op3Message: function(){
                if(this.op3 === ""){
                    return "";		
                }
                if (tryParse(this.op3, 2) === false ) {
                    return "Tip Percent is required and must be a valid number > zero."
                }
                return "";
            },
            gSalesTaxAmount: function(){
                if (tryParse(this.op1, 2) === false || tryParse(this.op2, 2) === false || tryParse(this.op3, 2) === false) {
                    return "";
                }          
                return (parseFloat(this.op1) - (parseFloat(this.op1) / (1 + (parseFloat(this.op2) / 100)))).toFixed(2);   
            },
            gTipAmount: function () {
                if (tryParse(this.op1, 2) === false || tryParse(this.op2, 2) === false || tryParse(this.op3, 2) === false) {
                    return "";
                }
                if (this.tip === "TipPreTax") {
                    var gSalesTaxAmount = parseFloat(this.op1) - (parseFloat(this.op1) / (1 + (parseFloat(this.op2) / 100)));
                    return ((parseFloat(this.op1) - gSalesTaxAmount) * (parseFloat(this.op3) / 100)).toFixed(2);
                } else if (this.tip === "TipOnTotal") {
                    return (parseFloat(this.op1) * (parseFloat(this.op3) / 100)).toFixed(2);
                }
            }
        }
});

   
}



function tryParse(stringValue, maxDecimals) {
    var char;
    var dotFound = false;
    var numberDecimals = 0;

    if (parseFloat(stringValue) < 0) {
        return false;
    }
    if (stringValue === "") {
        return false;
    }

    for (var i = 0; i < stringValue.length; i++) {

        char = stringValue.charAt(i);

        if (char === ".") {
            if (dotFound === true) {
                return false;
            }
            dotFound = true;
        }
        else if (char === "-") {
            if (i === 0) {
                return false;
            }
            if (i > 0) {
                return false;
            }
        }
        else if (char < "0" || char > "9") {
            return false;
        }
        else {

            // If we get here, we must have a number character.  Make sure we haven't found
            // too many decimal positions.

            if (dotFound === true) {
                numberDecimals++;
                if (numberDecimals > maxDecimals) {
                    return false;
                }
            }
        }
    }

    // If we get here, the value is OK.

    return true;
}