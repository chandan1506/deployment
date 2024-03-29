const express=require("express")
const {Createproductmodel}=require("../models/product.model")
const{Createwishlistmodel}=require("../models/wishlist.model")

userwishlistrouter=express.Router()

userwishlistrouter.get("/", async(req,res)=>
{
    const ID = req.body.userID;
    console.log(req.body.userID)
    try {
         let cart=await Createwishlistmodel.find({userID:ID})
         res.send(cart)
    } catch (error) {
        res.send({message:"cannot get wishlist items"})
    }

    
})


userwishlistrouter.post("/createwihslist", async(req,res)=>
 {
    let payload=req.body
    
    console.log(payload)
    // res.send("creating wishlist")
    try {
        let cart=await Createwishlistmodel.findOne(payload)
        if(cart){
         return  res.send({message:"This product is already in Wishlist"})
        }
        let newcart=new Createwishlistmodel(payload)
        await newcart.save()
        res.send({message:"Added to Wishlist"})
    } catch (error) {
        res.send({message:"something went wrong"})
    }
    
 })



 userwishlistrouter.delete("/delete/:id", async (req, res) => {
    const ID = req.params.id;
    const wishlistitem=await Createwishlistmodel.findOne({_id:ID})
    
    const wishlist_userID=wishlistitem.userID;
    const userID_jwt=req.body.userID
    try {
      if(userID_jwt===wishlist_userID){
          await Createwishlistmodel.findByIdAndDelete({ _id: ID });
          res.send( {message: "Wishlist Item is Deleted"});
      }

      else{
          res.send({"message":"you are not authorized to delete"})
      }
      
    } catch (error) {
      res.send({message:"cannot delete the wishlist item"});
    }
  });

module.exports={
    userwishlistrouter
}