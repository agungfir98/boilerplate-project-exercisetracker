const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { personSchema, exerciseSchema } = require("./skema");
app.use(cors());
app.use(bodyParser.urlencoded({ urlencoded: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

mongoose.connect(process.env.MONGO_DB);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

//SKEMA
const person = mongoose.model("Person", personSchema);
const exercise = mongoose.model("Exercise", exerciseSchema);

app.post("/api/users", function (req, res) {
  const userjson = {};
  const orang = new person({ username: req.body.username });
  orang.save(function (err, data) {
    if (err) {
      res.send("user already exist");
    } else {
      userjson["username"] = data.username;
      userjson["_id"] = data.id;
      res.json(userjson);
    }
  });
});

app.get("/api/users", function (req, res) {
  person.find({}, function (err, data) {
    if (err) {
      res.send(err);
    }
    if (data.length === 0) {
      res.send("there is no Data");
    } else {
      res.send(data);
    }
  });
});

app.post("/api/users/:_id/exercises", function (req, res) {
  const { description, duration, date } = req.body;
  const _id = req.params._id;

  person.findById(_id, function (err, data) {
    if (!data) {
      res.send("invalid user Id");
    } else {
      const id = data.id;
      const username = data.username;
      const olahraga = new exercise({
        id,
        username,
        description,
        duration,
        date,
      });
      olahraga.save(function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            id: data.id,
            username: username,
            description: data.description,
            duration: data.duration,
            date: data.date,
          });
        }
      });
    }
  });
});

app.get("/api/users/:_id/logs", function (req, res) {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  person.findById(id, function (err, data) {
    if (!data) {
      res.status(404).send("User not found");
    } else {
      res.send(data);
    }
  });
});
