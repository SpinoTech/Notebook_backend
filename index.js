const connectToMOngo = require("./db");

connectToMOngo();

const express=require("express");
const cors = require('cors')
const app=express();
app.use(cors());
// it will get the port from server while deployment or use the written port
const port= process.env.PORT||5000;

// express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.

app.use(express.json());

// those are all the routes
app.use("/api/auth" , require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));

app.listen(port,()=>{
    console.log(`notebook backend is running on http://localhost:${port}`);
})