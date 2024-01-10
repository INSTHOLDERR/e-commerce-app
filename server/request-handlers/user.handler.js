import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import productsModel from "../models/products.model.js";

const { sign } = jwt;

export async function register(req, res) {
    try {
        let { image, username, phone, email, password } = req.body;
        if (!(username && phone && email && password)) {
            return res.status(400).json({
                msg: "Input fields cannot be empty!"
            })
        }
        let userExists = await userModel.findOne({ $or: [{ username }, { phone }] });
        if (userExists) {
            return res.status(400).json({
                msg: `${username == userExists.username ? "Username" : "Phone number"} already exists!`
            })
        }
        let hashedPass = await bcrypt.hash(password, 12);
        await userModel.create({
            image,
            username,
            phone,
            email,
            password: hashedPass
        });
        return res.status(201).json({
            msg: "Registration successful!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error occured!"
        })
    }
}

export async function login(req, res) {
    try {
        let { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({
                msg: "Username or password cannot be empty!"
            })
        }
        let user = await userModel.findOne({ username });
        if(!user) {
            return res.status(400).json({
                msg: "Invalid username or password!"
            })
        }
        let isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            let token = sign({
                username: user.username,
                userId: user._id
            }, process.env.SECRET_KEY,{
                expiresIn: "48h"
            });
            return res.status(200).json({
                msg: "Login successful!",
                token
            })
        }
        return res.status(400).json({
            msg: "Invalid username or password!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error occured!"
        })
    }
}

// export async function profile(req, res) {
//     try {
//         let { userId } = req.user;
//         console.log(userId);
//         let user = await userModel.findOne({ _id: userId },{ password: 0 });
//         if(user) {
//             return res.status(200).json({
//                 msg: "User data",
//                 user
//             })
//         }
//         return res.status(404).json({
//             msg: "Unknown user!"
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ msg: "Error occured!" })
//     }
// }




export async function getProfile(req, res) {
    try {
      const { userId } = req.user;
      
  
      const user = await userModel.findOne({ _id: userId }, { password: 0 });
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const products = await productsModel.find({ userId: user._id });
  
      return res.status(200).json({
        msg: 'User profile found',
        user,
        products,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'An error occurred!',
        error: error.message,
      });
    }
  }
  