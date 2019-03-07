"use strict";

let newItem;
let items = [];

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("init");
  getItems();
}

function getItems() {
  console.log("delete");

  fetch("https://todolist-f2b2.restdb.io/rest/todoitems", {
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5c813fa1cac6621685acbc7f",
        "cache-control": "no-cache"
      }
    })
    //   format as jason
    .then(res => res.json())
    .then(data => {
      items = data;
      sortItems(items);
    });
}

function postItem(newItem) {
  console.log("delete");

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
  console.log("delete");

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
  console.log(data);
  data.sort(function (a, z) {
    if (a.idcount < z.idcount) {
      return 1;
    } else {
      return -1;
    }
  });
  // clear albums from DOM
  document.querySelector("[data-container]").innerHTML = "";
  data.forEach(showItems);
}

function showItems(item) {
  console.log("todoItems");
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
  itemForm.elements.submit.disabled = true;
  e.preventDefault();
  console.log("submit");

  const NewTitle = itemForm.elements.title.value;
  const newDetails = itemForm.elements.details.value;

  newItem = {
    title: NewTitle,
    details: newDetails,
  };
  postItem(newItem);
  document.querySelector("#itemForm").reset();
});