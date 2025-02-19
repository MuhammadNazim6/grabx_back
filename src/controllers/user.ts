import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const securePassword = async (password: string) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, name, password, mobile } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(200).json({
        success: false,
        message: "User already exists",
      });
      return;
    }
    const data = {
      email,
      name,
      password: await securePassword(password),
      mobile,
    };
    const user = await User.create(data);
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.AUTH_SECRET as string,
      { expiresIn: "3h" }
    );

    const userData = user.toObject();
    const userWithToken = { ...userData, token, password: null };

    res.status(200).json({
      success: true,
      message: "Signup successfull",
      data: userWithToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error while signing up");
  }
};

export const googleSignin = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {

      const token = jwt.sign(
        {
          id: userExists._id,
          email: userExists.email,
        },
        process.env.AUTH_SECRET as string,
        { expiresIn: "3h" }
      );
  
      const userData = userExists.toObject();
      const userWithToken = { ...userData, token, password: null };

      if (userExists.isGoogle) {
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          data: userWithToken,
        });
        return;
      }

      res.status(200).json({
        success: false,
        message: "User already exists with this mail",
      });
      return;
    }

    const data = {
      email,
      name,
      password: await securePassword(password),
      isGoogle: true,
    };

    const user = await User.create(data);
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.AUTH_SECRET as string,
      { expiresIn: "3h" }
    );

    const userData = user.toObject();
    const userWithToken = { ...userData, token, password: null };
    res.status(200).json({
      success: true,
      message: "Signup successfull",
      data: userWithToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email }).select(
      "_id name email mobile password"
    );
    if (!userExists) {
      res.status(200).json({
        success: false,
        message: "User does not exist",
      });
      return;
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!passwordMatch) {
      res.status(200).json({
        success: false,
        message: "Incorrect username or password entered",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: userExists._id,
        email: userExists.email,
      },
      process.env.AUTH_SECRET as string,
      { expiresIn: "3h" }
    );

    const userData = userExists.toObject();
    const userWithToken = { ...userData, token, password: null };
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: userWithToken,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// export const googleLogin = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     const userExists = await User.findOne({ email }).select(
//       "_id name email mobile password"
//     );
//     if (!userExists) {
//       res.status(400).json({
//         success: false,
//         message: "User does not exist",
//       });
//       return;
//     }
//     if (!userExists.isGoogle) {
//       res.status(400).json({
//         success: false,
//         message: "This mail not registered with google",
//       });
//       return;
//     }
//     const token = jwt.sign(
//       {
//         id: userExists._id,
//         email: userExists.email,
//       },
//       process.env.AUTH_SECRET as string,
//       { expiresIn: "3h" }
//     );

//     const userData = userExists.toObject();
// console.log('✌️userData --->', userData);
//     const userWithToken = { ...userData, token, password: null };

//     res.status(200).json({
//       success: true,
//       message: "Logged in succesfully",
//       data: userWithToken,
//     });
//     return;
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };
