const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
connectDB();

// Cors
// TODO...... time -> 2:33:23
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};
app.use(cors(corsOptions));

//
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Template engile
app.set("Views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
// app.use("/", require("./routes/staticFile"));
app.get("", (req, res) => {
  //   res.send("ok");
    res.sendFile("index.html", { root: __dirname + "/public" });
//   res.render("index");
});
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
