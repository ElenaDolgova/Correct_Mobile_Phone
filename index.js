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
            document.getElementById("submitButton").disabled=true;
            //SendRequest("success.json");
            SendRequest("success.json", function(data) {
                document.getElementById("resultContainer").innerHTML = data["status"];
            });
        }
    }
}
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
}

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
}

// function validatePhone(elems){
//     var phone = elems.phone.value;
// }

window.onload = init;

function init(){
    var input = document.getElementById("myForm").phone.onkeypress = firstNumber;
}

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
}

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
}
function getXmlHttp()
{
    var Request = false;

    if (window.XMLHttpRequest)
    {
        //Gecko-совместимые браузеры, Safari, Konqueror
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        //Internet explorer
        try
        {
             Request = new ActiveXObject("Microsoft.XMLHTTP");
        }    
        catch (CatchException)
        {
             Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
 
    if (!Request)
    {
        alert("Невозможно создать XMLHttpRequest");
    }
    
    return Request;
} 

function SendRequest(url, callback)
{
    //Создаём запрос
    var xmlhttp = getXmlHttp();
    
    //Проверяем существование запроса еще раз
    if (!xmlhttp)
    {
        return;
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
            // var statusElem = document.getElementById('resultContainer');
            // statusElem.innerHTML = data;
            // console.log("smth");
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

   // var statusElem = document.getElementById('resultContainer');

    //Назначаем пользовательский обработчик
    // Request.onreadystatechange = function()
    // {
    //     //Если обмен данными завершен
    //     if (Request.readyState == 4)
    //     {
    //         //Передаем управление обработчику пользователя
    //         //r_handler(Request);
    //        // statusElem.innerHTML = Request.statusText;// показать статус (Not Found, ОК..)
    //     }
    // }
    // Request.open('GET', '/success.json', true);
    // Request.send(null);
    //statusElem.innerHTML = 'Ожидаю ответа сервера...';
    //Проверяем, если требуется сделать GET-запрос
    // if (r_method.toLowerCase() == "get" && r_args.length > 0)
    // r_path += "?" + r_args;
    
    //Инициализируем соединение
    // Request.open(r_method, r_path, true);
    
    // if (r_method.toLowerCase() == "post")
    // {
    //     //Если это POST-запрос
        
    //     //Устанавливаем заголовок
    //     Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
    //     //Посылаем запрос
    //     Request.send(r_args);
    // }
    // else
    // {
    //     //Если это GET-запрос
        
    //     //Посылаем нуль-запрос
    //     Request.send(null);
    // }
} 
