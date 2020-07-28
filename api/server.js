const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const contactRouter = require("./contacts/contact.router");

require("dotenv").config();

module.exports = class MyServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRouters();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(morgan("dev"));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  initRouters() {
    this.server.use("/api/contacts", contactRouter);
  }

  async initDatabase() {
    await mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) process.exit(1);

        console.log("Database connection successful");
      }
    );
  }

  startListening() {
    const PORT = process.env.PORT;

    this.server.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  }
};
