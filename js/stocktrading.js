let stock = document.getElementById("stock")

function updateStock(){
    stock.innerHTML ="";
    db.transaction(
        function(tx){
        tx.executeSql("SELECT * FROM items;",null,function(tx,results){

            var len = results.rows.length, i;

            for (i = 0; i < len; i++) {
                stock.innerHTML += `
                <div class="item" id="${results.rows.item(i).id} ${results.rows.item(i).name }">
                <div>
                   <img src="${results.rows.item(i).drugimg}">
                   </div>
                   <div style=" height: 150px;">
                    <h2> ${results.rows.item(i).name}</h2>
                   <span>Price: ${results.rows.item(i).price}$</span>
                   <br>
                   <span>Amount available: ${results.rows.item(i).amount} unit</span>
                   <br>
                   <input type="number">
                   <br>
                   <button onclick="buyDrug(this)">Buy</button>
                   <button onclick="sellDrug(this)">Sell</button>
                   </div>
             </div>
                
                `;


            }
            
        },
        function(tx,error){
            console.log(error);
        });
    ;

    });
}

updateStock();

function buyDrug(b){
   let order = b.parentElement;
   let amount = order.getElementsByTagName("input")
   let date = new Date();
   let drug = order.getElementsByTagName("h2")[0].innerText
let name = prompt("please enter your name to complete your order")
if (name) {
    
    db.transaction(function(tx){
        tx.executeSql("select * from invoices",null
        ,function (tx,data) {
         tx.executeSql("insert into invoices (id,name,date,order_amount,transaction_type,drug_type) values(?,?,?,?,?,?)",
         [(data.rows.length+1),name, date.toDateString(),amount[0].value,"buying",drug],function () {},
         function(tx,error){
        console.log(error);
         }
         );

        }
        ,function (tx,error) {
            console.log(error)
        }
        );
});

} else {
    alert("you didn't submit your name,your order is not complete ")
}

}

function sellDrug(b){
    let order = b.parentElement;
    let amount = order.getElementsByTagName("input")
    let date = new Date();
    let drug = order.getElementsByTagName("h2")[0].innerText
 let name = prompt("please enter your name to complete your order")
 if (name) {
     
     db.transaction(function(tx){
         tx.executeSql("select * from invoices",null
         ,function (tx,data) {
            tx.executeSql("insert into invoices (id,name,date,order_amount,transaction_type,drug_type) values(?,?,?,?,?,?)",
            [(data.rows.length+1),name, date.toDateString(),amount[0].value,"selling",drug],function () {},
          function(tx,error){
         console.log(error);
          }
          );
 
         }
         ,function (tx,error) {
             console.log(error)
         }
         );
 });
 
 } else {
     alert("you didn't submit your name,your order is not complete ")
 }
 
 }
 



