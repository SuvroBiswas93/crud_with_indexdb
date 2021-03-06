import productdb, { bulkcreate,getData,createEle } from './Module.js'

let db = productdb("Productdb",{

    products:`++id,name,seller,price`
});

//Input Tags
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const seller = document.getElementById("seller");
const price = document.getElementById("price");

//Button Tags
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

//Not found
const notfound = document.getElementById("notfound");

function isNumber(value) {
  if(isNaN(value)) return false;
  else if (value !=0 && !Number(value)) return false;
  else return true;
}
function formValidation() {
  let insertmsg = document.querySelector(".insertmsg");
  if(!proname.value || !seller.value || !price.value ) {
    insertmsg.classList.replace("btn-success","btn-danger");
    insertmsg.innerHTML = "Opps!!Sorry, all the input fields are required...";
    getMsg(true,insertmsg);
    return false;
  }

  else if(!isNumber(price.value)) {
    insertmsg.classList.replace("btn-success","btn-danger");
    insertmsg.innerHTML = "Opps!!Sorry, price must be a valid number";
    getMsg(true,insertmsg);
   
    return false;
  }
  else return true;
}
//Insert Value using create button
btncreate.onclick =  event =>
{
  let insertmsg = document.querySelector(".insertmsg");
  insertmsg.classList.replace("btn-danger","btn-success");
  insertmsg.innerHTML = "Data Inserted Successfully .....";
  
  let isValid = formValidation();
  if(!isValid) return;
    // insert values
    let flag = bulkcreate(db.products, 
    {
      name: proname.value,
      seller: seller.value,
      price: price.value
    });
    //console.log(flag);
    
    /*proname.value = "";
    seller.value = "";
    price.value = "";*/

    proname.value = seller.value = price.value = "";
    getData(db.products,(data)=>
    {
      userid.value = data.id + 1 || 1;
    });

    table();

    getMsg(flag,insertmsg);
}


// Create Event on btnread button
btnread.onclick = table;


// Update event
btnupdate.onclick = () =>
{
  const id  = parseInt(userid.value || 0);
  if(id)
  {
    let isValid = formValidation();
    if(!isValid) return;
    db.products.update(id,
      {
        name:proname.value,
        seller:seller.value,
        price:price.value
      }).then((updated) =>
      {
        //let get = updated ? `Data Updated`: `Couldn't Update data`;
        let get = updated ? true : false;
        let updatemsg = document.querySelector(".updatemsg");
        table();
        getMsg(get,updatemsg);

        proname.value = seller.value = price.value = "";

      })
      
  }
}

//Delete records
btndelete.onclick = () =>
{
  db.delete();
  db = productdb("Productdb",{

    products:`++id,name,seller,price`
  });
  db.open();
  table();
  textID(userid);

  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true,deletemsg);
}


//Window Onload event
window.onload = () =>
{
  textID(userid);
}


function textID(textboxid)
{
  getData(db.products, data =>
    {
      textboxid.value = data.id + 1 || 1;
    })
}


function table()
{
  const tbody =  document.getElementById("tbody");
  notfound.textContent = "";
  while(tbody.hasChildNodes())
  {
    tbody.removeChild(tbody.firstChild);
  }
  
  getData(db.products,(data)=>
  {
    if(data)
    {
      createEle("tr",tbody,tr =>
      {
        for (const value in data) 
        {
          createEle("td",tr,td =>
          {
            td.textContent = data.price === data[value]?`$ ${data[value]}`:data[value];
          })
        }
        
        createEle("td",tr,td =>
        {
          createEle("i",td,i =>
          {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`,data.id);
            i.onclick = editbtn;
          })
        })
        createEle("td",tr,td =>
        {
          createEle("i",td,i =>
          {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`,data.id);
            i.onclick = deletebtn;
          })
        })

      })
    }
    else
    {
      notfound.textContent = "No record found in the database...";
    }
  })
  
}

function editbtn(event)
{
  let id = parseInt(event.target.dataset.id);
  db.products.get(id,data =>
    {
      userid.value = data.id || 0;
      proname.value = data.name || "";
      seller.value = data.seller || "";
      price.value = data.price || "";
    })
}


function deletebtn(event)
{
  let id = parseInt(event.target.dataset.id);
  db.products.delete(id);
  table();
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true,deletemsg);
}

function getMsg(flag,element)
{
  if(flag)
  {
    element.className += " movedown";

    setTimeout(() =>
    {
      element.classList.forEach(classname => {
       classname =="movedown"?undefined : element.classList.remove("movedown");
      });
    },4000);
  }
}
