const express = require("express");

const app = express();
const PORT = 8000;

app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});