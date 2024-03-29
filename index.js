const express=require("express")
const {connection}=require("./config/db")
require("dotenv").config
const{userrouter}=require("./routees/userrouter")
const{adminproduct}=require("./routees/adminproduct.router")
const {userrender}=require("./routees/userrenderrouter")
const {userCartrouter}=require("./routees/usercartrouter")
const {userwishlistrouter}=require("./routees/userwishlistrouter")
const {adminRouter}=require("./routees/admin.router")
const{authentication}=require("./middlewares/authenticationmiddleware")
const cors = require('cors')
const jwt = require("jsonwebtoken")

const app=express()
app.use(cors({
    origin:"*"
}))
app.use(express.json())

app.get("/",(req,res)=>
{
    res.send({"message":"welcome to HOME PAGE"})
})
app.use("/admin",adminRouter)

app.use("/usersrender", userrender)
app.use("/adminproducts",adminproduct)

// app.use("user")

app.use("/users",userrouter)

// google Oauth
const passport = require("./config/google-Oauth")
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'https://jewels-frontend-4s.vercel.app/html/login_signup.html',
        session: false
    }),
    function (req, res) {
        // Successful authentication, redirect home.

        const token = jwt.sign({ userID: req.user._id, name: req.user.name }, process.env.key)

        res.redirect(`https://jewels-frontend-4s.vercel.app?name=${req.user.name}&token=${token}`)
    });

app.use(authentication)
app.use("/cart",userCartrouter)
app.use("/wishlist",userwishlistrouter)









app.listen(process.env.port, async()=>
{
    try {
        await connection
        console.log("connected to data base")
    } catch (error) {
        console.log(error)
    }
console.log(`server is running at port ${process.env.port}`)
})