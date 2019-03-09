"use strict";

let newItem;
let doneItem;
let click;
let items = [];
let doneItems = [];

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("init");
  getItems();
  getDoneItems();
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
      console.log(data);
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
    .then(data => {
      console.log(data);
      console.log(items);
      // doneItem = data;
      // doneItems.push(doneItem);
      // postDoneItem(doneItem);
      if (items.length === 0) {
        document.querySelector("[data-container]").innerHTML = `
        <div class="no_tasks">Nice! All tasks are done...</div>
        `;
      }
    });
}

function getDoneItems() {
  console.log("getDoneItems");
  fetch(
    "https://todolist-f2b2.restdb.io/rest/doneitems?metafields=true&max=10",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5c813fa1cac6621685acbc7f",
        "cache-control": "no-cache"
      }
    }
  )
    //   format as jason & send to sort
    .then(res => res.json())
    .then(data => {
      console.log(data);
      doneItems = data;
      // sortItems(doneItems);
    });
}

function postDoneItem(doneItem) {
  console.log("postDoneItem");
  console.log(doneItem);

  fetch("https://todolist-f2b2.restdb.io/rest/doneitems", {
    method: "post",
    body: JSON.stringify(doneItem),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5c813fa1cac6621685acbc7f",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      doneItems.push(data);
      // sortItems(items);
    });
}

function sortItems(items) {
  console.log("sortItems");
  if (items.length === 0) {
    document.querySelector("[data-container]").innerHTML = `
    <div class="no_tasks">Nice! All tasks are done...</div>
    `;
  } else {
    items.sort(function(a, z) {
      if (a._created < z._created) {
        return 1;
      } else {
        return -1;
      }
    });
    document.querySelector("[data-container]").innerHTML = "";
    items.forEach(showItems);
  }
}

function showItems(item) {
  console.log("showItems");
  const template = document.querySelector("[data-template]").content;
  const clone = template.cloneNode(true);
  clone.querySelector("[data-title]").textContent = item.title;
  clone.querySelector("[data-details]").textContent = item.details;
  clone.querySelector("[data-id]").dataset.id = item._id;
  clone.querySelector("#done").addEventListener("click", e => {
    e.preventDefault();
    deleteItemModal(item);
  });
  // clone.
  document.querySelector("[data-container]").appendChild(clone);
}

function mouseClick(event) {
  click = event.target.dataset.click;
  if (click === "addItem") {
    event.preventDefault();
    addItemModal();
  }
}

function addItemModal() {
  console.log("addItemModal");
  modal.classList.add("show");
  document.querySelector("#modal").classList.add("show");
  document.querySelector("#close").addEventListener("click", closeModal);
  document.querySelector("#modal_content").innerHTML = `

    <form id="itemForm">
    <h2>Add new task</h2>
    <label for=" title">Title</label>
    <input type="text" name="title" id="title" placeholder="What to do?" required><br>
    <label for="detalis">Details</label>
    <input type="text" name="details" id="details" placeholder="Some more stuff about it..." required><br><br>
    <button type="submit" name="submit">Add</button>
    <button type="reset" class="cancel">Cancel</button>
    </form>`;

  document.querySelector("#itemForm").addEventListener("submit", e => {
    e.preventDefault();
    console.log("submit");
    const newTitle = itemForm.elements.title.value;
    const newDetails = itemForm.elements.details.value;
    newItem = {
      title: newTitle,
      details: newDetails
    };
    postItem(newItem);
    document.querySelector("[data-container]").innerHTML = "";
    closeModal();
  });
  document.querySelector(".cancel").addEventListener("click", e => {
    closeModal();
  });
}

function deleteItemModal(item) {
  console.log("deleteItemModal");
  const id = item._id;
  const title = item.title;
  const details = item.details;
  console.log(id);
  document.querySelector("#modal").classList.add("show");
  document.querySelector("#close").addEventListener("click", closeModal);
  document.querySelector("#modal_content").innerHTML = `
    <p class="bold">All done?</p>
    <p>${title}</p>
    <p>${details}</p>
    <button id="delete_ok">Absolutly</button>
    <button class="cancel">Not yet</button>
    `;
  document.querySelector("#delete_ok").addEventListener("click", e => {
    event.preventDefault();
    items = items.filter(function(item) {
      return item._id !== id;
    });
    console.log("Is id gone now?");
    console.log(items);
    document.querySelector("[data-id='" + id + "']").remove();
    const doneTitle = item.title;
    const doneDetails = item.details;
    doneItem = {
      title: doneTitle,
      details: doneDetails
    };
    postDoneItem(doneItem);
    deleteItem(id);
    console.log(id);
    closeModal();
  });
  document.querySelector(".cancel").addEventListener("click", e => {
    closeModal();
  });
}

function closeModal() {
  document.querySelector("#modal").classList.remove("show");
}
