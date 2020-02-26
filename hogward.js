"use strict";
window.addEventListener("DOMContentLoaded", init);
function init() {
  console.log("ready");
  fetchStudentList();
}
function fetchStudentList() {
  fetch(" https://petlatkea.dk/2020/hogwarts/students.json")
    .then(function(result) {
      return result.json();
    })
    .then(function(data) {
      console.log(data);
      data.forEach(showStudent);
    });
}
function showStudent(student) {
  console.log(student);
  let template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector(".fullName").textContent = student.fullname;
  //copy.querySelector(".gender").textContent = student.gender;
  copy.querySelector(".house").textContent = student.house;
  //ADDED MODAL ON CLICK ON BUTTON
  const modal = document.querySelector(".modal-background");
  modal.addEventListener("click", () => {
    modal.classList.add("hide");
  });
  copy.querySelector("button").addEventListener("click", showStudents => {
    showDetails(student);
  });

  function showDetails(students) {
    console.log(students);

    modal.querySelector(".modal-name").textContent = students.fullname;
    modal.querySelector(".modal-house").textContent = students.house;

    modal.dataset.theme = students.house;
    modal.classList.remove("hide");
  }

  document.querySelector("main").appendChild(copy);
}
