let logininfo =location.search.split("?")[1].split("&");

let video = document.querySelector("#videoElement");
let numofusers =0;
let inputs = document.getElementsByTagName("input");


logincheck();
function logincheck(){
    db.transaction(
        function(tx){
        tx.executeSql("SELECT name,password FROM users where name = ?;",[logininfo[0].split("=")[1]],function(tx,results){
          console.log(  results.rows.length); 
            if(results.rows.length > 0){
            
            if ( results.rows.item(0).password == logininfo[1].split("=")[1]) {
          
            } 

            else {
            location.assign("login.html?logedin=false")
               

            }
       
             
        }
        else{
         location.assign("login.html?logedin=false") 
        } 
  
        },
        function(tx,error){
            console.log(error);
        });
    ;
    });

}

async function startCamera(){
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio:false },)
        video.srcObject = stream;
    }
}
function stopCamera(e) {
      
    var stream = video.srcObject;
    var tracks = stream.getTracks();

    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }

    video.srcObject = null;
  }


let userlist = document.getElementById("userlist")

///ADD USER\\\

function updateUserlist(){
    userlist.innerHTML ="";
    db.transaction(
        function(tx){
        tx.executeSql("SELECT * FROM users;",null,function(tx,results){

            var len = results.rows.length, i;
            numofusers =len;
            for (i = 0; i < len; i++) {
                userlist.innerHTML += `<li id ="${results.rows.item(i).id} ${results.rows.item(i).name}" onclick="deleteUser(this)" >
                 Username: ${results.rows.item(i).name} Password: ${results.rows.item(i).password}</li> <br>`
    
            }
            
        },
        function(tx,error){
            console.log(error);
        });
    ;
    });
   
}
updateUserlist();

function addUser(){
    
    db.transaction(function(tx){
    tx.executeSql("insert into users (id,name,password) values (?,?,?)",[(numofusers+1),inputs[0].value,inputs[1].value]
    ,function () {
        updateUserlist();
        
    }
    ,function (tx,error) {
      alert("couldn't add user")
        console.log(error)
    }
    );
});


}

function deleteUser(li){
    let sure = confirm(`are you sure you want to delete ${li.id.split(" ")[1]} `)

if (sure) {
    
    db.transaction(function(tx){
        tx.executeSql("delete from users where id = ?",[li.id.split(" ")[0]]
        ,function () {
            updateUserlist();
            
        }
        ,function (tx,error) {
          alert("couldn't delete user")
            console.log(error)
        }
        );
});

}
}
/// ADD Drug\\\
let camerison = false;
function toggleCamera(){

    if (!camerison) {
        startCamera();
        camerison =true;
    } else {
        stopCamera();
        camerison = false;
    }
}
video.addEventListener("click",toggleCamera)


function takescreenshot () {
    document.createElement
    let canvas =   document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
    imgAsURL = canvas.toDataURL("image/webp");
    return imgAsURL;
};

function addDrug(){
   let imgAsURL = takescreenshot();

    db.transaction(
        function(tx){
        tx.executeSql("select * from items",null
        ,function (tx,result) {
          let drugid = result.rows.length +1;
          
            tx.executeSql("insert into items (id,name,amount,price,drugimg) values (?,?,?,?,?)"
            ,[drugid,inputs[2].value,inputs[3].value,inputs[4].value,imgAsURL],function () {  }
            ,function (tx,error) {
              alert("couldn't add Drug")
                console.log(error)
            }
            ); 
        }
        ,function (tx,error) {
            console.log(error)  
        }
        );
    });
}


///invoices\\\
let Invoices = document.getElementById("Invoices")

function updateInvoiceslist(){
    Invoices.innerHTML ="";
    db.transaction(
        function(tx){
        tx.executeSql("SELECT * FROM invoices;",null,function(tx,results){

            var len = results.rows.length, i;
            numofusers =len;
            for (i = 0; i < len; i++) {
                Invoices.innerHTML += `<li id ="${results.rows.item(i).id},${results.rows.item(i).drug_type},${results.rows.item(i).transaction_type},${results.rows.item(i).order_amount}" onclick="acceptInvoice(this)" >
                (${results.rows.item(i).transaction_type}) ${results.rows.item(i).date}  Customer: ${results.rows.item(i).name}
                 amount: ${results.rows.item(i).order_amount} of:${results.rows.item(i).drug_type}</li> <br>`
    
            }
            
        },
        function(tx,error){
            console.log(error);
        });
    ;
    });
   
}
updateInvoiceslist();
function acceptInvoice(inv){
let invoiceinfo = inv.id.split(",");

    let sure = confirm(`are you sure you want to Accept this Order `)

if (sure) {
    
    db.transaction(function(tx){
        tx.executeSql("select * from items where name = ?",[invoiceinfo[1]]
        ,function (tx,data) {
         if (invoiceinfo[2] =="buying") {

            if (data.rows.item(0).amount > parseInt(invoiceinfo[3]))
             {
                 let newval = data.rows.item(0).amount - parseInt(invoiceinfo[3]);

                tx.executeSql("update  items set amount = ? where name =? ",[newval,invoiceinfo[1]]
                ,function (tx) {
                    tx.executeSql("delete from  invoices where id = ?",[invoiceinfo[0]]
                    ,function (tx) {
                        alert("you completed the order successfully,check your stock.")
                        updateInvoiceslist();
                        
                    }
                    ); 

                    
                }
                );   
            } else {
                alert("you are out of stock, you can't accept the order")
            }

             
         }
        else{
            let newval =data.rows.item(0).amount + parseInt(invoiceinfo[3]);
        
            tx.executeSql("update  items set amount = ? where name =? ",[newval,invoiceinfo[1]]
            ,function (tx) {
                tx.executeSql("delete from  invoices where id = ?",[invoiceinfo[0]]
                ,function (tx) {
                    alert("you completed the order successfully,check your stock.")
                    updateInvoiceslist();
                    
                }
                ); 

                
            }
            );   
             }
            
        }
        ,function (tx,error) {
            console.log(error)
        }
        );


});

}
}