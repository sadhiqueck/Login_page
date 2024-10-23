const express= require("express");
const app=express();
const hbs= require("hbs")
const session=require("express-session")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','hbs');

app.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: true, 
  cookie: { secure: false }    
}));

//to prevent cache storing
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });


let usernameDB="admin";
let passwordDB="123";

app.get('/login', (req,res) =>{ 
    if(req.session.user){
        res.redirect("/")
    }
    
})


app.post("/signup", (req,res)=>{
    const{newusername,newpassword}=req.body;
    usernameDB=newusername;
    passwordDB=newpassword;
    res.redirect('/login')
 
})

app.post("/login",(req,res) =>{
    const{username, password}= req.body;
    if(username===usernameDB && password===passwordDB){
        req.session.user=username;
        req.session.pswd=password;
        console.log(req.session)
        res.redirect('/')
    }else{
        res.render("login",{msg:"Invalid Credentials!!,Try again"})
    }
});


app.get('/', (req,res) =>{
    res.set('Cache-Control', 'no-store');
    if(req.session.user){
        res.render('home')
       
    }else {
        res.render("login");  
    }
    
})

app.get('/logout', (req,res) =>{
       
    req.session.destroy((err)=>{
        if(err){
            return res.send("failed to logout")
        }   
    res.clearCookie("connect.sid");
    res.set('Cache-Control', 'no-store');  
    res.redirect('/');     
    });
  
})

const PORT=process.env.PORT || 3000; 
app.listen(PORT,()=>{
    console.log("http://localhost:3000")
});



