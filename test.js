const http = require("http");
const fs = require("node:fs");

const JSONdata = fs.readFileSync("data.json");
let data = JSON.parse(JSONdata);
const server = http.createServer((req, res, error) => {
  let method = req.method;
  const url = req.url;
  const splitedUrl = url.split("?");
  const filteredData = data.filter((item) => {
    return Number(splitedUrl[1]) == item.id;
  });
  if (method == "GET") {
    res.setHeader("Content-Type", "application/json");
    if (url.startsWith("/users")) {
      if (url.startsWith(`/users?`)) {
        if (filteredData.length == 0) {
          res.write(JSON.stringify({ message: "not found" }));
        } else {
          res.write(JSON.stringify(filteredData));
        }
      } else {
        res.write(JSON.stringify(data));
      }
    } else {
      res.write(JSON.stringify({ message: "not found" }));
    }
    res.end();
  }
  if (method == "POST") {
    let body = "";
    req.on("data", (puffer) => {
      body += puffer;
    });

    req.on("end", () => {
      const parsedData = JSON.parse(body);
      const newUser = {
        id: JSON.stringify(data.length + 1),
        ...parsedData,
      };
      if (parsedData.age == Number(parsedData.age)) {
        data.push(newUser);
        fs.writeFileSync("data.json", JSON.stringify(data), (err) => {
          console.log(err);
        });
        res.write(JSON.stringify(newUser));
      } else {
        res.write("error");
      }

      res.end();
      console.log(parsedData.age);
    });
  }
  if (method == "DELETE") {
    let body = "";
    req.on("data", (puffer) => {
      body += puffer;
    });
    req.on("end", () => {
      const parsedData = JSON.parse(body);
      const deletingData = data.filter((item) => {
        return item.id !== parsedData.id;
      });
      fs.writeFileSync("data.json", JSON.stringify(deletingData), (err) => {
        console.log(err);
      });
      res.write(JSON.stringify(deletingData));
    });
    res.end();
  }
});

server.listen("8080", () => {
  console.log("server is running on http:localhost:8080");
});
