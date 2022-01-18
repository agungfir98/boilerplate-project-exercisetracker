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

  const olahraga = new exercise({
    description,
    duration,
    date,
  });

  if (olahraga.date === "") {
    olahraga.date = new Date().toString().substring(0, 10);
  }
  person.findByIdAndUpdate(
    _id,
    { $push: { log: olahraga } },
    { new: true },
    (err, data) => {
      if (err) {
        res.send(err);
      }
      let resObj = {};
      resObj["_id"] = data.id;
      resObj["username"] = data.username;
      resObj["date"] = new Date(olahraga.date).toDateString();
      resObj["description"] = olahraga.description;
      resObj["duration"] = olahraga.duration;
      res.send(resObj);
    }
  );
});

app.get("/api/users/:_id/logs", function (req, res) {
  const id = req.params._id;

  person.findById(id, function (err, data) {
    const { from, to, limit } = req.query;
    if (!err) {
      let resData = data;
      if (from || to) {
        let fromDate = new Date(0);
        let toDate = new Date();

        if (from) {
          fromDate = new Date(from);
        }
        if (to) {
          toDate = new Date(to);
        }

        fromDate = fromDate.getTime();
        toDate = toDate.getTime();

        resData.log = resData.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime();
          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }

      if (limit) {
        resData.log = resData.log.slice(0, limit);
      }
      let returnData = {};
      returnData["_id"] = data.id;
      returnData["username"] = data.username;
      returnData["count"] = data.log.length;
      returnData["log"] = data.log;
      returnData["log"].date = new Date(returnData["log"].date).toDateString();
      // console.log();
      res.send(returnData);
    }
  });
});
