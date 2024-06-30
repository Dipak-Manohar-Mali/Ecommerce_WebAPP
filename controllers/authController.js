import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import  JWT  from "jsonwebtoken";

export const registerController = async(req,res) =>{
    try {

        const {name,email,password,phone,address,role="0",question} = req.body
        console.log("Req is comming",req.body);

        if(!name)
        {
            res.send({message:'name is Required'})
        }
        if(!email)
        {
            res.send({message:'email is Required'})
        }
        if(!password)
        {
            res.send({message:'password is Required'})
        }

        if(!phone)
        {
            res.send({error:'phone is Required'})
        }

        if(!address)
        {
            res.send({error:'address is Required'})
        }

        if(!question)
        {
            res.send({error:'question is Required'})
        }
        

        //check user
        const existingUser = await userModel.findOne({email})

        //existing user
        if(existingUser)
        {
            return res.status(200).send({
                success:false,
                message:'User Already Register, Please login'
            })
        }

        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword,role,question}).save()
        
        if(user){
            const userWithoutPass = await userModel.findById(user._id).select("-password")
            res.status(201).send({
                success:true,
                message:"user Register Successfuly",
                userWithoutPass,
            })
        }
        

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"Error in While registering the User",
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            
            return res.status(400).send({
                success: false,
                message: 'Invalid Username or password'
            });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "You are Not Registered!!!, Please Register First"
            });
        }

        const match = await comparePassword(password, user.password); // Assuming comparePassword is defined and working correctly
        if (!match) {
            console.log("checking")
            return res.status(401).send({
                success: false,
                message: "Invalid Credential"
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role:user.role,
            },
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
    }

    
};

//forgotPasswordController

export const forgotPasswordController = async(req,res) =>{

    try {
        const {email,newPassword,question} = req.body;
        console.log(req.body)

        if(!email)
        {
            res.status(400).send({message:"Email is Required"})
        }

        if(!question)
        {
            res.status(400).send({message:"Question is Required"})
        }

        if(!newPassword)
        {
            res.status(400).send({message:"newP assword is Required"})
        }

        //check

        const user  = await userModel.findOne({email,question})

        

        if(!user)
        {
            res.status(404).send({
                success:false,
                message:"Wrong Email Or Answer"
            })
        }

        const hashed = await hashPassword(newPassword)
        await  userModel.findByIdAndUpdate(user._id,{password:hashed})

        res.status(200).send({
            success:true,
            message:"PassWord is Reset Successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went Wrong",
            error
        })
        
    }

}

export const testController = (req,res)=>{
    res.send('protect Route')
}


//update profile

export const updateProfileController = async(req,res)=>{
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
          return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
          req.user._id,
          { 
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
          },
          { new: true }
        );
        res.status(200).send({
          success: true,
          message: "Profile Updated SUccessfully",
          updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "Error WHile Update profile",
          error,
        });
      }
}


//orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

//orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

//order status
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };
