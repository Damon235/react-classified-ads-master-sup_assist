require("dotenv").config();
const express = require("express");
const http = require("http");
// const socketio = require('socket.io');
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const auth = require("./middleware/auth");
// const { createProxyMiddleware } = require('http-proxy-middleware');

//
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.id === userId) && users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (newUserId) => {
//   return users.find((user) => user.userId === newUserId);
// };
//
io.on("connection", (socket) => {
  socket.on("addUser", (newUserId) => {
    if (!users.some((user) => user.userId === newUserId)) {
      users.push({ userId: newUserId, socketId: socket.id });
    }
    console.log("a user connected.", users);
    io.emit("getUsers", users);
  });

  // send message
  socket.on("sendMessage", (data) => {
    const { receiverId } = data;
    const user = users.find((user) => user.userId === receiverId);
    console.log("Sending from socket to: ", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("receiveMessage", data);
      console.log("Message sent to: ", receiverId);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log("a user disconnected");
    // removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

//
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Proxy middleware
// const options = {
//   target: 'http://127.0.0.1:8800', // target host
//   changeOrigin: true, // needed for virtual hosted sites
//   ws: true, // proxy websockets
// };

// const proxy = createProxyMiddleware(options);
// app.use('/api', proxy);

//Routes
app.use("/user", require("./routes/user.route"));
app.use("/chat", require("./routes/chatRoute"));
app.use("/message", require("./routes/messageRoute"));
app.use("/api", require("./routes/category.route"));
app.use("/api", require("./routes/upload.route"));
app.use("/api", require("./routes/product.route"));
app.use("/api", require("./routes/ad.route"));
// app.use('/cchh', proxy);

//
app.get("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesn't exist",
  });
});
//
const URI = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

//
mongoose
  .connect(URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to db successfully"))
  .catch((e) => console.log(e));

//
app.get("/", (req, res) => {
  res.json({ msg: "welcome" });
});

//
server.listen(PORT, () => {
  console.log("server is listening at", PORT);
});
