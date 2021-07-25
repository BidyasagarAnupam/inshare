const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const connectDB = require("./config/db");
connectDB();

// Template engile
app.set('Views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// Routes
app.use("/api/files", require("./routes/files"));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
