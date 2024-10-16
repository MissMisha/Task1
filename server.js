var express=require("express");
let app=express();
let mysql2=require("mysql2");

let config={
    host:"127.0.0.1",
    user:"root",
    password:"Misha@26",
    database:"Task",
    dateStrings:true
}

app.use(express.urlencoded("true"));
app.use(express.static("public"));

var mysql=mysql2.createConnection(config);
mysql.connect(function(err){
    if(err==null){
        console.log("Connected to Database successfully");
    }
    else
    console.log(err.message);
})

app.listen(2024,function(req,resp){
    console.log("Your server started :)");
})

app.get("/",function(req,resp){
    let path=__dirname+"/public/login.html";
    resp.sendFile(path);
})
app.get("/signup-process",function(req,resp){
    console.log(req.query);
    console.log("signup");

    let email=req.query.txtEmail;
    let pwd=req.query.txtPwd;

    mysql.query("insert into Userlogin values(?,?,?)",[email,pwd,1],function(err){
        if(err==null)
        {
            resp.send("Signup Successfully")
        }
        else
        resp.send(err.message)
    })
})
app.get("/login-process",function(req,resp){
    console.log(req.query);

    let logEmail=req.query.logEmail;
    let logPwd=req.query.logPwd;

   mysql.query("select * from Userlogin where uid=? and pwd=?",[logEmail,logPwd],function(err,result){
    if(err!=null){
        resp.send(err.message);
        return;
    }
    if(result.length==0)
    {
        resp.send("invalid email or password");
    }
    else{
        resp.send("logged in successfully");
    }
    
   })
})
app.get("/fetch-all-users",function(req,resp){
    mysql.query("select * from Userlogin",function(err,jsonArray){
        if(err)
            {
                console.log(err.message);
            }
            else
            {
                resp.send(jsonArray);
                //console.log(jsonArray)
    
            }
    })
})
app.get("/del-users",function(req,resp){
    let uid=req.query.uid
    //console.log(req.query.uid)
    mysql.query("delete from Userlogin where uid=?",[uid],function(err){
        if(err)
        {
            console.log(err.message);
        }
        else{
            resp.send("Deleted successfully");
        }
    })
})

app.get("/block-users",function(req,resp){
    console.log(req.query.uid);
    mysql.query("update Userlogin set status=0 where uid=?",[req.query.uid],function(err,result){
        if(err)
        {
            resp.send(err.message);

        }
        else
        {
            //resp.send("blocked successfully");
            console.log("blocked successfully");
        }
            })
})

app.get("/unblock-users",function(req,resp){
    console.log(req.query.uid);
    mysql.query("update Userlogin set status=1 where uid=?",[req.query.uid],function(err,result){
        if(err)
        {
            resp.send(err.message);

        }
        else
        {
            //resp.send("blocked successfully");
            console.log("unblocked successfully");
        }
            })
})


