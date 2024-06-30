import express, { Router } from "express";
import {forgotPasswordController, getAllOrdersController, getOrdersController, loginController, orderStatusController, registerController,testController, updateProfileController} from "../controllers/authController.js";
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";

//router object

const router = express.Router()

//routing
//Register || method post

router.post('/register',registerController)

//login ||post
router.post("/login",loginController)

//forgot password || POST

router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignIn,isAdmin,testController)

//protected User route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    })
})

//protected Admin route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    })
})

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//update profile

router.put('/profile',requireSignIn,updateProfileController)

// order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
  );

export default router;