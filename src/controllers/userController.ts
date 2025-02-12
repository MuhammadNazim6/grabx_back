import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import { User } from '../models/userModel';

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
    const body = req.body;
    const userExists = await User.findOne({ email: body.email });
    if (userExists) {
      res.status(200).json({
        success: false,
        message: 'User already exists'
      });
      return
    }
    const data = {
      email: body.email,
      name: body.name,
      password: await securePassword(body.password)
    }
    const user = await User.create(data)
    res.status(200).json({
      success: true,
      message: 'Signup successfull',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const googleSignin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userExists = await User.findOne({ email: body.email });
    if (userExists) {
      if (userExists.isGoogle) {
        res.status(200).json({
          success: true,
          message: 'Logged in successfully',
          data:userExists
        });
        return
      }
      
      res.status(200).json({
        success: false,
        message: 'User already exists with this mail'
      });
      return
    }

    const data = {
      email: body.email,
      name: body.name,
      password: await securePassword(body.password),
      isGoogle: true
    }
    const user = await User.create(data)
    res.status(200).json({
      success: true,
      message: 'Signup successfull',
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');  
  }
};


export const login = async (req: Request, res: Response) => {
  try {

    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
      res.status(200).json({
        success: false,
        message: 'User does not exist',
      });
      return
    }
    const passwordMatch = await bcrypt.compare(req.body.password, userExists.password);
    if (!passwordMatch) {
      res.status(200).json({
        success: false,
        message: 'Incorrect username or password entered',
      });
      return
    }

    res.status(200).json({
      success: true,
      message: 'Logged in succesfully',
      data: userExists
    });
    return
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


export const googleLogin = async (req: Request, res: Response) => {
  try {

    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) {
      res.status(400).json({
        success: false,
        message: 'User does not exist',
      });
      return
    }
    if (!userExists.isGoogle) {
      res.status(400).json({
        success: false,
        message: 'This mail not registered with google',
      });
      return
    }

    res.status(200).json({
      success: true,
      message: 'Logged in succesfully',
      data: userExists
    });
    return
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

