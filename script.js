"use strict";

window.addEventListener("DOMContentLoaded", init);


function init() {
  console.log("init");
  get();
}

// getJson
function get() {
  console.log("get");

  fetch("https://todolist-f2b2.restdb.io/rest/todoitems", {
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5c813fa1cac6621685acbc7f",
        "cache-control": "no-cache"
      }
    })
    // Get data - format as jason
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
}