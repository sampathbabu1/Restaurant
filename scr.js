var tablename;
var generatedTable = false;
var db;
function drag(event, thisp) {
    var parse = new DOMParser();
    var doc = parse.parseFromString(thisp.innerHTML, 'text/html');
    console.log(doc.getElementById('price'));
    var price = doc.getElementById("price").textContent;
    var name = doc.getElementById("title").textContent.trim();
    var pr = price.split(' ');
    price = pr[pr.length - 1];
    event.dataTransfer.setData("price", price);
    event.dataTransfer.setData("name", name);
}


function searchCuisine(thi) {
    var x = document.getElementsByClassName("receipecard");
    for (let i in x) {
        let title = x[i].querySelector('#title').textContent.toLowerCase();
        if (title.includes(thi.toLowerCase()) || db['items'][i]['type'].toLowerCase().includes(thi.toLowerCase())) {
            console.log(x[i].querySelector('#title').textContent);
            x[i].style.display = "";
        }
        else {
            x[i].style.display = 'none';
        }
    }

}



function searchTable(thi) {
    var x = document.getElementsByClassName('table');
    for (let i in x) {
        if (x[i].querySelector('.tablename').textContent.toLowerCase().includes(thi.toLowerCase())) {
            x[i].style.display = '';
        }
        else {
            x[i].style.display = 'none';
        }
    }

}

async function initial() {
    console.log('hi');
    await fetch('./Database.json').then(response => {
        return response.json();
    }).then(data => {
        db = data;
    });
    for (let i = 0; i < db['tables']; i++) {
        var temp = document.createElement('div');
        temp.setAttribute('class', 'table-' + (i + 1) + ' table');
        temp.setAttribute('ondragover', 'onover(event)');
        temp.setAttribute('ondrop', 'drop(event,this)');
        let x = document.createElement('div');
        x.setAttribute('class', 'table-' + (i + 1) + ' tablename');
        x.setAttribute('onclick', 'generatetable(this)');
        x.innerHTML = 'Table-' + (i + 1);
        temp.appendChild(x);
        x = document.createElement('div');
        x.setAttribute('class', 'tabledetails');
        let y = document.createElement('div');
        y.setAttribute('class', 'table-' + (i + 1) + ' itemname');
        y.innerHTML = "Rs : 0";
        x.appendChild(y);
        y = document.createElement('div');
        y.setAttribute('class', 'table-' + (i + 1) + ' price');
        y.innerHTML = "| Total Items : 0";
        x.appendChild(y);
        temp.appendChild(x);
        document.querySelector('.tables').appendChild(temp);
    }

    for (let i = 0; i < db['items'].length; i++) {
        console.log(db['items'])
        temp = document.createElement('div');
        //div class="receipecard" draggable="true" ondragstart="drag(event,this)"
        temp.setAttribute('class', 'receipecard');
        temp.setAttribute('draggable', 'true');
        temp.setAttribute('ondragstart', 'drag(event,this)');
        let x = document.createElement('p');
        x.setAttribute('id', 'title');
        x.innerHTML = "<Strong>" + db['items'][i]['name'] + "</Strong>";
        temp.appendChild(x);
        x = document.createElement('p');
        x.setAttribute('id', 'price');
        x.innerHTML = "Rs : " + db['items'][i]['price'];
        temp.appendChild(x);
        document.querySelector('#cuisines').appendChild(temp);
    }
    for (let i = 0; i < 3; i++) {
        if (localStorage.getItem('table-' + (i + 1))) {
            var items = JSON.parse(localStorage.getItem('table-' + (i + 1)));
            var x = document.getElementsByClassName('table-' + (i + 1) + ' itemname');
            var total_price = 0;
            for (let pr in items['price']) {
                total_price += items['quantity'][pr] * parseFloat(items['price'][pr]);
            }
            x[0].innerHTML = 'Rs : ' + total_price;
            x = document.getElementsByClassName('table-' + (i + 1) + ' price');
            x[0].innerHTML = '| Total Items : ' + items['price'].length;
        }
    }
}

function generatetable(thisvalue) {
    tablename = thisvalue.innerText.toLowerCase();
    console.log(tablename);
    document.querySelector('.popup').style.display = 'flex';
    if (localStorage.getItem(tablename)) {
        var items = JSON.parse(localStorage.getItem(tablename));
        var doc = document.getElementById('generate');
        let i;
        for (i = 0; i < items['name'].length; i++) {
            var row = doc.insertRow(i + 1);
            var cell = row.insertCell(0);
            cell.innerHTML = i + 1;
            cell = row.insertCell(1);
            cell.innerHTML = items['name'][i];
            cell = row.insertCell(2);
            var x = document.createElement('input');
            x.setAttribute('id', i + 1);
            x.setAttribute('type', 'number');
            x.setAttribute('value', items['quantity'][i]);
            var t = 'pop';
            x.setAttribute('oninput', 'test(this)');
            x.setAttribute('min', 1);
            x.setAttribute('step', 1);
            cell.innerHTML = x.outerHTML;
            cell = row.insertCell(3);
            x = document.createElement('div');
            x.setAttribute('id', 'amt' + (i + 1));
            x.innerHTML = items['quantity'][i] * items['price'][i];
            cell.innerHTML = x.outerHTML;

        }
        var row = doc.insertRow(i + 1);
        var cell = row.insertCell(0);
        cell.innerHTML = '';
        cell = row.insertCell(1);
        cell.innerHTML = "<strong>Total Value </strong>";
        cell = row.insertCell(2);
        x = document.createElement('div');
        x.setAttribute('id', 'totalamt');
        let total = 0;
        for (let i = 0; i < items['price'].length; i++) {
            total += items['quantity'][i] * items['price'][i];
        }
        x.innerHTML = total;
        cell.innerHTML = x.outerHTML;
        generatedTable = true;
    }

}

function deletetable(tablename, n) {
    var x = document.getElementById('generate');
    // console.log(n);
    // console.log("table"+tablename);
    for (let i = 1; i < n; i++) {
        x.deleteRow(1);
    }
    x.deleteRow(-1);
    x.deleteRow(-1);
}
function sessionclose() {
    let total = 0;
    let items = JSON.parse(localStorage.getItem(tablename));
    for (let i = 0; i < items['name'].length; i++) {
        total += parseInt(items['quantity'][i]) * parseFloat(items['price'][i]);
    }
    alert("Bill Generated : " + total);
    localStorage.removeItem(tablename);
    closepopup();
    x = document.getElementsByClassName(tablename + ' itemname');
    x[0].innerHTML = "Rs : 0";
    x = document.getElementsByClassName(tablename + ' price');
    x[0].innerHTML = "| Total Items : 0";
    window.location.reload();
}
function test(thisvalue) {
    console.log(tablename);
    console.log(thisvalue.attributes[0].nodeValue);
    var id = thisvalue.attributes[0].nodeValue;
    var x = document.getElementById(id);
    var amtid = document.getElementById('amt' + parseInt(id));
    console.log(amtid.innerHTML);
    console.log(thisvalue);
    let items = JSON.parse(localStorage.getItem(tablename));
    amtid.innerHTML = parseInt(thisvalue.value) * parseFloat(items['price'][id - 1]);
    items['quantity'][id - 1] = parseInt(thisvalue.value);
    localStorage.setItem(tablename, JSON.stringify(items));
    console.log(items['quantity']);
    console.log(amtid.innerHTML);
    let total = 0;
    for (let i = 0; i < items['price'].length; i++) {
        total += items['quantity'][i] * items['price'][i];
    }
    x = document.getElementById('totalamt');
    x.innerHTML = total;
    x = document.getElementsByClassName(tablename + ' itemname')[0];
    x.innerHTML = 'Rs : ' + total;
    x = document.getElementsByClassName(tablename + ' price')[0];
    x.innerHTML = '| Total Items : ' + items['name'].length;
}

function closepopup() {
    console.log('pres');
    // console.log(items);
    if (localStorage.getItem(tablename)) {
        let items = JSON.parse(localStorage.getItem(tablename));
        deletetable(tablename, items['name'].length);
    }
    document.querySelector('.popup').style.display = 'none';
}

function drop(event, thisp) {
    var items = {}
    var tablename = thisp.className.split(' ')[0];
    if (!localStorage.getItem(tablename)) {
        items['name'] = [event.dataTransfer.getData('name')];
        items['price'] = [event.dataTransfer.getData('price')];
        items['quantity'] = [1];
    }
    else {
        console.log(localStorage.getItem(tablename) + "in storage");
        items = JSON.parse(localStorage.getItem(tablename));
        var name = event.dataTransfer.getData('name');
        var price = event.dataTransfer.getData('price');
        var temp = items['name'];
        var result = temp.indexOf(name);
        console.log("result : " + result);;
        console.log(price);
        console.log(name);
        console.log(temp);
        if (result == -1) {
            items['name'].push(name);
            items['price'].push(price);
            items['quantity'].push(1);
        } else {
            items['quantity'][result] += 1;
        }
        console.log(items);
    }
    console.log(items);
    var x = document.getElementsByClassName(tablename + ' itemname');
    var total_price = 0;
    for (let pr in items['price']) {
        total_price += items['quantity'][pr] * parseFloat(items['price'][pr]);
    }
    x[0].innerHTML = 'Rs : ' + total_price;
    localStorage.setItem(tablename, JSON.stringify(items));
    x = document.getElementsByClassName(tablename + ' price');
    x[0].innerHTML = '| Total Items : ' + items.name.length;
}



function onover(event) {
    event.preventDefault();
}