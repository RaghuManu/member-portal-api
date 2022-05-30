import app from "./app";
const PORT = 4000;

app.listen(PORT || process.env.PORT, () => {
  console.log("express server started with a port " + PORT);
});
