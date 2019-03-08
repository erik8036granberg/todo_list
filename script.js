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
    const click = "deleteItem";
    const title = item.title;
    const details = item.details;
    const id = item._id;
    showModal(click, title, details, id);
  });
  // clone.querySelector("[data-delete]").addEventListener("click", e => {
  //   console.log(e);
  //   e.target.parentElement.remove();
  //   deleteItem(item._id);
  // });
  document.querySelector("[data-container]").appendChild(clone);
}

function mouseClick(event) {
  click = event.target.dataset.click;

  if (click === "addItem") {
    event.preventDefault();
    showModal(click);
  }
}

function showModal(click, title, details, id) {
  console.log("showModal");
  const modal = document.querySelector("#modal");
  modal.classList.add("show");
  document.querySelector("#close").addEventListener("click", closeModal);

  if (click === "addItem") {
    document.querySelector("#modal_content").innerHTML = `

    <form id="itemForm">
    <h2>Add todo-item</h2>
    <label for=" title">Title</label>
    <input type="text" name="title" id="title" placeholder="Bananas" required>
    <label for="detalis">Detalis</label>
    <input type="text" name="details" id="details" placeholder="The yellow ones" required>
    <button type="submit" name="submit">Submit</button>
    <button type="reset" value="Reset">Clear</button>
    </form>`;

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
      closeModal();
    });
  }
  if (click === "deleteItem") {
    document.querySelector("#modal_content").innerHTML = `
    <p class="bold">Do yout really want do delete:</p>
    <p>${title}</p>
    <p>${details}</p>

    `;
  }
}

function closeModal() {
  modal.classList.remove("show");
  document.querySelector("#modal_content").innerHTML = "";
}
