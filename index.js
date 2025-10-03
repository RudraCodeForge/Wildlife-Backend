const express = require('express');
const USERROUTER = require('./routes/UserRouter');
const cors = require('cors');
const mongoose = require('mongoose');
const AUTHROUTER = require('./routes/AuthRouter');


const DB_URL = process.env.DB_URL;
const app = express();
const PORT = 3000;

// CORS ko pehle use karo
app.use(cors());

// Agar JSON body bhi bhejna hai to
app.use(express.json());

// Router ko mount karo
app.use('/auth', AUTHROUTER);
app.use('/', USERROUTER);

mongoose.connect(DB_URL).then(()=>{
  console.log("DATABASE CONNECTED")
  app.listen(PORT,()=>{
    console.log("SERVER IS RUNNING ON PORT",PORT)
  })
})
.catch((error)=>{
  console.log("DATABASE CONNECTION ERROR : ",error)
})