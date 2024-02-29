const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv= require("dotenv");
const helmet= require("helmet");
const morgan= require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const port = process.env.PORT || 8000;

// app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/images", express.static(path.join(__dirname,"public/images")));


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
 
const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/images");
      },
      filename: (req, file, cb) => {
        cb(null, req.body.name);
      //   cb(null, file.originalname);
      },
    });

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req,res)=>{
      try{
             return res.status(200).json("FILE UPLOADED SUCCESSFULY!")
      }catch(err){
            console.log(err);
      }
});

app.use(
      cors({
            origin: "*"
      }),
);


app.use("/api/users" , userRoute);
app.use("/api/auth" , authRoute);
app.use("/api/posts" , postRoute);
app.use("/api/conversations" , conversationRoute);
app.use("/api/messages" , messageRoute);

app.listen(port,()=>{
      console.log("Backend server is running!")
})