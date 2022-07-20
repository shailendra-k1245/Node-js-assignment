const http = require("http");
const data = require("./data.json");
const fs = require("fs");
const { formatWithOptions } = require("util");
// console.log(data.isAuth,data)

const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET,DELETE",
    "Access-Control-Max-Age": 2592000, // 30 days
    /** add other headers as per requirement */
  };
  let url = req.url;
  url = url.split("/");
  // console.log(url);

  if (req.url == "/users" && req.method == "GET") {
    //-------------------------GET ALL USERS-------------------------
    res.writeHead(200, headers);
    res.write(JSON.stringify({ data: data.users }));
    res.end();
  } else if (url[1] == "users" && url[2] && req.method == "POST" && !url[3]) {
    //--------------------GET A SINGLE USER BY ID----------------
    // such that /users/1
    let id = url[2];
    let user;
    res.writeHead(200, headers);
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].id == id) {
        user = data.users[i];
      }
    }
    // console.log(data);
    res.write(JSON.stringify({ data: user }));
    res.end();
  } else if (req.url === "/users" && req.method == "POST") {
    //-----------------POST A USER---------------------------
    let reqData = "";
    req.on("data", (chunk) => {
      reqData += chunk;
    });

    req.on("end", () => {
      // console.log(JSON.parse(reqData));
      reqData = JSON.parse(reqData);
      if (validateNum(reqData)) {
        data.users.push(reqData);
        fs.writeFile("./data.json", JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.write(JSON.stringify({ message: "User added" }));
        res.end();
      } else {
        res.write("Please enter a valid phone number");
        res.end();
      }
    });
  } else if (url[1] == "users" && url[2] && req.method == "DELETE" && !url[3]) {
    //------------------DELETE A USER ----------------
    // such that /users/userid
    let id = url[2];
    res.writeHead(200, headers);
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].id == id) {
        data.users.splice(i, 1);
      }
    }
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.write(JSON.stringify({ message: "User Deleted" }));
    res.end();
  } else if (
    url[1] == "users" &&
    url[2] &&
    url[3] == "tasks" &&
    !url[4] &&
    req.method == "GET"
  ) {
    //--------GET ALL TASKS FOR A USER
    //such that /users/1/tasks
    let id = url[2];
    let tasks;
    res.writeHead(200, headers);
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].id == id) {
        tasks = data.users[i].tasks;
      }
    }
    res.write(JSON.stringify({ data: tasks }));
    res.end();
  } else if (
    url[1] == "users" &&
    url[2] &&
    url[3] == "tasks" &&
    url[4] &&
    req.method == "GET"
  ) {
    //GET A TASK BY ID
    //such that /users/userid/tasks/id
    let id = url[2];
    let taskId = url[4];
    let task;

    res.writeHead(200, headers);
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].id == id) {
        for (let j = 0; j < data.users[i].tasks.length; j++) {
          if (data.users[i].tasks[j].id == taskId) {
            task = data.users[i].tasks[j];
            break;
            // console.log(task)
          }
        }
      }
    }
    res.write(JSON.stringify({ task }));
    res.end();
  } else if (
    url[1] == "users" &&
    url[2] &&
    url[3] == "tasks" &&
    req.method == "POST"
  ) {
    //ADD A TASK TO A USER
    // /users/userid/tasks/
    let id = url[2];
    let reqData = "";
    req.on("data", (chunk) => {
      reqData += chunk;
    });
    req.on("end", () => {
      reqData = JSON.parse(reqData);
      console.log(reqData);
      for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].id == id) {
          data.users[i].tasks.push(reqData);
        }
      }
      fs.writeFile("./data.json", JSON.stringify(data), (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.write(JSON.stringify({ message: "Task added" }));
      res.end();
    });
  } else if (
    url[1] == "users" &&
    url[2] &&
    url[3] == "tasks" &&
    url[4] &&
    req.method == "DELETE"
  ) {
    //----DELETE A TASK-------
    // such that /users/userid/tasks/taskid
    let id = url[2];
    let taskid = url[4];
    res.writeHead(200, headers);
    for (let i = 0; i < data.users.length; i++) {
      let tasks = data.users[i].tasks;

      if (data.users[i].id == id) {
        for (let j = 0; j < tasks.length; j++) {
          if (tasks[j].id == taskid) {
            tasks.splice(j, 1);
            data.users[i].tasks = tasks;
          }
        }
      }
    }
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
      if (err) {
        res.write(JSON.stringify({ error: err }));
      } else {
        res.write("Task deleted");
        res.end();
      }
    });
  } else if (req.url == "/login" && req.method == "POST") {
    //-------AUTH HANDLER-------
    // such that /login
    let reqData = "";
    req.on("data", (chunk) => {
      reqData += chunk;
    });
    req.on("end", () => {
      reqData = JSON.parse(reqData);
      if (authUser(reqData)) {
        data.isAuth = true;
        fs.writeFile("./data.json", JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
          }
        });
        res.write(JSON.stringify({ message: "Login success" }));
        res.end();
      } else {
        res.write(
          JSON.stringify({ message: "Please enter valid credentials" })
        );
        res.end();
      }
    });
  } else if (req.url == "/logout" && req.method == "POST") {
    //------AUTH HANDLER-----
    // such that /logout
    data.isAuth = false;
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.write(JSON.stringify({ message: "Logout success" }));
    res.end();
  }
});

function validateNum(reqData) {
  let flag = true;
  for (let i = 0; i < data.users.length; i++) {
    if (data.users[i].contact == reqData.contact) {
      flag = false;
      break;
    }
  }
  return flag;
}

function authUser(reqData) {
  let flag = false;
  for (let i = 0; i < data.users.length; i++) {
    if (
      data.users[i].password == reqData.password &&
      data.users[i].email == reqData.email
    ) {
      flag = true;
      break;
    }
  }
  return flag;
}

server.listen(3000, "localhost", () => {
  console.log("listening on port 3000");
});
