MyForm = {
    elems: document.getElementById("myForm"),
    fio: document.getElementById("myForm").fio.value,
    email: document.getElementById("myForm").email.value,
    phone: document.getElementById("myForm").phone.value,
    validate: function(){
        var fioA = validateFIO(this.elems);
        var emailA = validateEmail(this.elems);
        var phoneA = validatePhone(this.elems);
        var String =new Array();
        if(!fioA){
            String.push("ФИО");            
        }
        if(!emailA){
            String.push("Электронный адрес");
        }
        if(!phoneA){
            String.push("Телефонный номер");
        }
        return{isValid: fioA&&emailA&&phoneA, 
            errorField: String};
    },
    getData: function(){
        return{
            fio: this.fio, 
            email: this.email, 
            phone: this.phone};
    },
    setData: function(object){
        this.fio = object.fio;
        this.phone = object.email;
        this.phone = object.phone;
    },
    submit: function(){
        var validateResult = this.validate();
        if(validateResult.isValid){
            var arrayOfJson = ["success.json", "error.json", "progress.json"]; 
            document.getElementById("submitButton").disabled=true;
            sendRequest(arrayOfJson[Math.floor(Math.random()*arrayOfJson.length)], function(data) {
                var container = document.getElementById("resultContainer");
                if (data["status"]=="Success"){
                    container.innerHTML = data["status"];
                    container.className = data["status"].toLowerCase();
                }else if(data["status"]=="Error"){
                    container.innerHTML = data["status"]+", Reason: "+data["reason"];
                    container.className = data["status"].toLowerCase();
                }else if(data["status"]=="Progress"){
                    container.innerHTML = data["status"];
                    setTimeout('MyForm.submit()', data["timeout"]);  
                    container.className = data["status"].toLowerCase();                  
                }
            });
        }
    }
};
function validateFIO(elems){
    var fioArray = elems.fio.value.match(/\s[a-zA-Z0-9А-Яа-я]/g);
    var beginFio = elems.fio.value.match(/^\s/);
        var sum = 0;    
        if(beginFio!=null){
            sum=-1;
        }    
        if(fioArray!=null ){
    
        if(fioArray.length+sum!=2){
            elems.fio.className = "error";
            return false;
        }else{
            elems.fio.className = "";
            return true;
        }
        }else{
        elems.fio.className = "error";
        return false;
        }
};

function validateEmail(elems){
    var myPattern = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(ya.ru|yandex.ru|yandex.ua|yandex.ua|yandex.kz|yandex.com)$/;
    var myString = elems.email.value.trim();
    if(myPattern.test(myString)){
        elems.email.className="";
        return true;
    }else{
        elems.email.className="error";
        return false;
    }
};

window.onload = init;

function init(){
    var input = document.getElementById("myForm").phone.onkeypress = firstNumber;
};

function firstNumber(e){
    e = e || window.event;
    var input = document.getElementById("myForm").phone;
    if((input.value.length<=15)&&e.keyCode<=57&&e.keyCode>=48){
    if(input.value==""){
        if ((e.keyCode === 55)||(e.keyCode === 56)) {
            input.value = "+7(";
            return false;
        }else if(e.keyCode<=57&&e.keyCode>=48){
            input.value = "+7(";
        }
    }else if(input.value.length==6){
        input.value = input.value +")";
    }else if(input.value.length==10){
        input.value = input.value +"-";
    }else if(input.value.length==13){
        input.value = input.value +"-";
    }
}else{
    return false;
}
};

function validatePhone(elems){
    var input = elems.phone.value;
    var myPattern=/^\+7\([0-9]{3}\)[0-9]{3}-?[0-9]{2}-?[0-9]{2}$/;
    var myString = input.replace(/-/g,"");
    myString=myString.replace(/\(/g,"");	
    myString=myString.replace(/\)/g,"");
    myString=myString.replace(/\+/g,"");
    var sum=0;
    for(var i=0;i<myString.length;i++){
        sum=sum+Number(myString[i]);
    }	
    if (!myPattern.test(input)||sum>=30){
        elems.phone.className="error";
        return false;
    }else{
        elems.phone.className="";
        return true;
    }
};

function getXmlHttp(){
    var request = false;

    if (window.XMLHttpRequest){
        request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject){
        try{
             request = new ActiveXObject("Microsoft.XMLHTTP");
        }    
        catch (CatchException)
        {
             request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
 
    if (!request){
        alert("Невозможно создать XMLHttpRequest");
    }
    
    return request;
};

function sendRequest(url, callback){
    var xmlhttp = getXmlHttp();

    if (!xmlhttp){
        return;
    }
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            //console.log('responseText:' + xmlhttp.responseText);
            try{
                var data = JSON.parse(xmlhttp.responseText);}
                catch(err){
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}; 
