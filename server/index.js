const app = require("./app");
require("./src/db/conn");

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});