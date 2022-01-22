
/// database init \\\

let db = openDatabase("pharmcy.io","1.1","pharmacy.io database",24*1024*1024);


db.transaction(
    function(tx){
    tx.executeSql("create table if not exists users (id int primary key,name varchar(50),password varchar(50) )",null,function(tx,result){
        tx.executeSql("insert into users (id,name,password) values (?,?,?)",[1,"admin","admin"]);
    },
    function(tx,error){
        console.log(error);
    });


});
db.transaction(
    function(tx){
        tx.executeSql("create table if not exists items (id int primary key,name varchar(50) ,drugimg varchar, price int, amount int)",null,
        function(tx,result){
            tx.executeSql("insert into items (id,name,drugimg,price,amount) values (?,?,?,?,?)",
            [1,"Morphine","../img/premade/morphine.jpg",72,186],function(){
                tx.executeSql("insert into items (id,name,drugimg,price,amount) values (?,?,?,?,?)",
                [2,"Crystal Meth","../img/premade/crystalmeth.jpg",123,444],function(){

                    tx.executeSql("insert into items (id,name,drugimg,price,amount) values (?,?,?,?,?)",
                    [3,"Heroin","../img/premade/Heroin.jpg",331,67]);
                    
                }
                );
            }
            
            );
           
        }
        ,function(tx,error){
            console.log(error);
        });
    });

    db.transaction(
        function(tx){
            tx.executeSql("create table if not exists invoices (id int primary key,name varchar(50) ,date varchar(50), order_amount int , transaction_type varchar(30),drug_type varchar(50))",null,
            function(tx,result){
                
            }
            ,function(tx,error){
                console.log(error);
            });
        });







function gotologin(button){
  
    location.pathname="html/login.html"


}


function gotostock(button){
  
    location.pathname="html/stock.html"


}