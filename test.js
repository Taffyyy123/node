const http = require("http");
const fs = require("node:fs");
const domain = require("domain");
const myDomain = domain.create();

const data = [
  {
    id: 1,
    name: "Bold",
    age: 20,
  },
  {
    id: 2,
    name: "Bat",
    age: 18,
  },
];

const server = http.createServer((req, res, error) => {
  const url = req.url;
  const splitedUrl = url.split("?");
  const filteredData = data.filter((item) => {
    return Number(splitedUrl[1]) == item.id;
  });
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
});

server.listen("8080", () => {
  console.log("server is running on http:localhost:8080");
});
