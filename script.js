const File = require("./models/file");
const fs = require("fs");

const connectDB = require("./config/db");
connectDB();

async function deleteData() {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); //current time - 24hrs;
  const files = await File.find({
    createdAt: {
      $lt: pastDate,
    },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`Successfully deleted ${file.filename}`);
      } catch (e) {
        console.log(`Erorr while deleting file ${e}`);
      }
    }
    console.log("Job Done!");
  } else {
    console.log("NO file exist");
  }
}

deleteData().then(() => {
  process.exit();
});
