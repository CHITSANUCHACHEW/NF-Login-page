import express, { json } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Account from "./model/profile.js";
import cors from "cors";
import bodyParser from "body-parser";

//Setting port
const app = express();
const port = 3000;

//Secret Token
const secret = "Project-test-Login--AES_encryption";

//set user pass mongoDb
const password = "1234";

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Create function encrypt and decrypt
const algorithm = "aes-256-cbc";
const key = "ProjecttestLogin--AES_encryption";
const iv = crypto.randomBytes(16);

function encryptPassword(pass) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypt = cipher.update(pass, "utf8");
  encrypt = Buffer.concat([encrypt, cipher.final()]);
  return { iv: iv.toString("hex"), encryptData: encrypt.toString("hex") };
}

function decryptPassPassword(pass) {
  if (!pass || !pass.iv || !pass.encryptData) {
    throw new Error("Invalid pass object");
  }
  const { iv, encryptData } = pass;
  const getiv = Buffer.from(iv, "hex");
  const encrypt = Buffer.from(encryptData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, getiv);
  let decrypt = decipher.update(Buffer.from(encrypt, "hex"));
  decrypt = Buffer.concat([decrypt, decipher.final()]);

  return decrypt.toString("utf8");
}

//send data after Login
app.get("/page", async (req, res) => {
  try {
    const response = await Account.findOne({});
    res.status(200).json({ response: response });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Checking Password when Login
app.post("/login", async (req, res) => {
  try {
    const { Email, Phone, Password } = req.body.userData;
    const findUser = await Account.findOne({
      $or: [{ Email: Email }, { Phone: Phone }],
    });
    if (findUser) {
      const pass = {
        iv: findUser.Password.iv.toString("hex"),
        encryptData: findUser.Password.encrpyText,
      };
      let decryptPass = decryptPassPassword(pass);
      if (decryptPass === Password) {
        var token = jwt.sign({ email: findUser.Email }, secret, {
          expiresIn: "1h",
        });
        res.status(200).json({ message: "Login successful", token: token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//Register use postman for create userAccount
// {
//   "Email":"Email",
//   "Phone":"Phone number 10 digits",
//   "Password":"Password"
// }
app.post("/Register", async (req, res) => {
  try {
    const { Email, Phone, Password } = req.body;
    const textPass = Password;
    const passtoByteArray = Buffer.from(textPass);
    const findUser = await Account.findOne({
      $or: [{ Email: Email }, { Phone: Phone }],
    });
    if (findUser) {
      res.status(501).json({ message: err.message });
    } else {
      var encrpyPass = encryptPassword(passtoByteArray);
      const creatUser = {
        Email: Email,
        Phone: Phone,
        Password: {
          iv: encrpyPass.iv,
          encrpyText: encrpyPass.encryptData,
        },
      };
      const creatUsertodb = await Account.create(creatUser);
      res.status(201).json(creatUsertodb);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check token
app.post("/authen", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.status(200).json({ message: "Success", decoded });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Connect mongodb and start server
try {
  mongoose.connect(
    `mongodb+srv://admin:${password}@cluster0.rpfnk5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  app.listen(port, () => {
    console.log(`Server connect port ${port}`);
  });
  console.log("connect");
} catch (err) {
  console.log(err);
}
