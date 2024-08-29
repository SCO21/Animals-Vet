require("rootpath")();
require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const validator  = require("./_middleware/validator");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({ origin: "*", credentials: true, optionsSuccessStatus: 200 }));
app.disable("x-powered-by");

app.use(function (req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  });
// SERVICIOS
app.use("/db", require("./_helpers/db"));

app.use("/users", require("./users/routes"));

app.use("/appointments", validator ,require("./appointments/routes"));



const port = process.env.NODE_ENV === "dev" ? process.env.PORT || 4000 : 80;
app.listen(port, () => console.log("Servidor escuchando en el puerto " + port));

module.exports= app