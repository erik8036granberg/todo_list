"use strict";

let newItem;
let click;
let items = [];

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("init");
  getItems();
  document.querySelector("body").addEventListener("click", mouseClick);
}

function getItems() {
  console.log("getItems");

  fetch("https://todolist-f2b2.restdb.io/rest/todoitems?metafields=true", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5c813fa1cac6621685acbc7f",
      "cache-control": "no-cache"
    }
  })
    //   format as jason & send to sort
    .then(res => res.json())
    .then(data => {
      items = data;
      sortItems(items);
    });
}

function postItem(newItem) {
  console.log("postItem");

  fetch("https://todolist-f2b2.restdb.io/rest/todoitems", {
    method: "post",
    body: JSON.stringify(newItem),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5c813fa1cac6621685acbc7f",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      items.push(data);
      sortItems(items);
    });
}

function deleteItem(id) {
  console.log("deleteItem");

  fetch("https://todolist-f2b2.restdb.io/rest/todoitems/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5c813fa1cac6621685acbc7f",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {});
}

function sortItems(data) {
  console.log("sortItems");

  // sort by _created meta tag
  data.sort(function(a, z) {
    if (a._created < z._created) {
      return 1;
    } else {
      return -1;
    }
  });
  // clear content from DOM
  document.querySelector("[data-container]").innerHTML = "";
  data.forEach(showItems);
}

function showItems(item) {
  console.log("showItems");
  const template = document.querySelector("[data-template]").content;
  const clone = template.cloneNode(true);
  clone.querySelector("[data-title]").textContent = item.title;
  clone.querySelector("[data-details]").textContent = item.details;
  clone.querySelector("[data-id]").dataset.id = item._id;
  clone.querySelector("[data-delete]").addEventListener("click", e => {
    // mouseevnt on click
    console.log(e);
    // finds mouse target (button) and delete its parent element (article)
    e.target.parentElement.remove();
    deleteItem(item._id);
  });
  document.querySelector("[data-container]").appendChild(clone);
}

document.querySelector("#itemForm").addEventListener("submit", e => {
  console.log("submit");
  e.preventDefault();
  itemForm.elements.submit.disabled = true;

  const newTitle = itemForm.elements.title.value;
  const newDetails = itemForm.elements.details.value;
  newItem = {
    title: newTitle,
    details: newDetails
  };
  postItem(newItem);
  document.querySelector("#itemForm").reset();
});

// document.querySelector("#itemForm").addEventListener("submit", e => {
//   console.log("add Item button");
//   e.preventDefault();
// });

function mouseClick(event) {
  click = event.target.dataset.click;

  if (click === "addItem") {
    event.preventDefault();
    alert("hoooo");
  }
}
