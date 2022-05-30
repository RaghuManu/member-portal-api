import mongoose from "mongoose";

//const mongoUrl: string = "mongodb://localhost/alpha-member?replicaSet=rs0";
const mongoUrl: string = "mongodb://localhost/alpha-member";
mongoose.Promise =
  global.Promise; /* 
mongoose.set('useFindAndModify', false); */

const mongooseConnection = mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection
  .once("open", function () {
    console.log("mongodb connection success");
  })
  .on("error", function (err) {
    console.log("Connection Error", err);
  });
export default mongooseConnection;
