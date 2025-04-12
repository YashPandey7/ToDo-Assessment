const app = require("./app");
require("./src/db/conn");
require("dotenv").config();

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});