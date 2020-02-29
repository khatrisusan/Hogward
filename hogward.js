"use strict";
window.addEventListener("DOMContentLoaded", init);
let allStudents = [];
// The prototype for all students:
const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  photo: "",
  house: ""
};

const settings = {
  filter: null,
  sortBy: null,
  sortDir: "asc"
};

function init() {
  console.log("ready");
  fetchStudentList();
}
async function fetchStudentList() {
  const response = await fetch(
    "https://petlatkea.dk/2020/hogwarts/students.json"
  );
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);

  buildList();
}
function preapareObject(jsonObject) {
  const student = Object.create(Student);
  //define new prototype
  //DO TRIM SPILIT AND BLAH BLAH.......string/substring or substr/indexof lastindexof
  const houseName = jsonObject.house.trim();
  student.house =
    houseName.substring(0, 1).toUpperCase() +
    houseName.substring(1).toLowerCase();
  const genderName = jsonObject.gender.trim();
  student.gender =
    genderName.substring(0, 1).toUpperCase() +
    genderName.substring(1).toLowerCase();
  //student.gender = jsonObject.gender;
  //(sentence[1].toUpperCase());
  //const hypen = jsonObject.fullname.indexOf("-");
  let letter = jsonObject.fullname; //.replace('dog', 'monkey')

  student.nickname = "";
  if (letter.indexOf('"') != -1) {
    student.nickname = letter.substring(
      letter.indexOf('"') - 1,
      letter.lastIndexOf('"') + 2
    );
    letter = letter.replace(student.nickname, " ");
    student.nickname = student.nickname.trim();
  }
  letter = letter.trim();

  student.fullname = letter;
  const noOfSpaces = letter.split(" ").length - 1;
  if (noOfSpaces > 0) {
    student.firstname = letter.substring(0, letter.indexOf(" ")); //letter.substring(0, indexOf(" ") )
    student.firstname =
      student.firstname[0].toUpperCase() +
      letter.substring(1, letter.indexOf(" ")).toLowerCase();
  } else if (!noOfSpaces == 0) {
    student.firstname =
      letter[0].toUpperCase() + letter.substring(1, -1).toLowerCase();
  }
  //if hypen true
  /*   if (letter.search("-") == true) {
    student.lastname =
      letter[letter.indexOf(" ")].toUpperCase +
      letter.substring(indexOf(" ") + 1, indexOf("-")).toLowerCase();
  } */
  if (letter.search("-") == true) {
    student.lastname = letter.substring(letter.lastIndexOf("-") + 1);
    student.lastname[0].toUpperCase() +
      student.lastname.substring(1, -1).toLowerCase();
    student.middlename = letter.substring(
      letter.indexOf(" ") + 1,
      letter.lastIndexOf("-")
    );
    student.middlename[0].toUpperCase() +
      student.middlename.substring(1, -1).toLowerCase();
  } else {
    student.lastname = letter.substring(letter.lastIndexOf(" ") + 1);
    student.lastname[0].toUpperCase() +
      student.lastname.substring(1, -1).toLowerCase();
    student.middlename = letter[
      letter.indexOf(" ") + 1
    ].toUpperCase(); /* +
      letter
        .substring(letter.indexOf(" ") + 2, letter.lastIndexOf(" "))
        .toLowerCase(); */
  }

  if (noOfSpaces == 1) {
    student.middlename = "";
  } else {
    student.middlename = letter.substring(
      letter.indexOf(" "),
      letter.lastIndexOf(" ")
    );
  }
  if (noOfSpaces == 0) {
    student.firstname = letter;
    student.middlename = "";
    student.lastname = "";
  }
  if (noOfSpaces == 1) {
    student.lastname = letter.substring(letter.lastIndexOf(" ") + 1);
    student.lastname =
      student.lastname[0].toUpperCase() +
      letter.substring(letter.lastIndexOf(" ") + 2).toLowerCase();
  }
  if (noOfSpaces == 2) {
    student.middlename =
      letter[letter.indexOf(" ") + 1].toUpperCase() +
      letter
        .substring(letter.indexOf(" ") + 2, letter.lastIndexOf(" "))
        .toLowerCase();
  }

  return student;
}

function buildList() {
  const currentList = allStudents; // FUTURE: Filter and sort currentList before displaying

  displayList(currentList);
}
function displayList(student) {
  // clear the display
  document.querySelector("main").innerHTML = "";

  // build a new list
  student.forEach(showStudent);
}
function showStudent(student) {
  console.log(student);
  let template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector(".fullName span.one").textContent = student.firstname;
  copy.querySelector(".fullName span.two").textContent = student.middletname;
  copy.querySelector(".fullName span.three").textContent = student.lastname;
  //(student.firstname)+" "+student.middlename + " "+student.lasttname
  //copy.querySelector(".middleName").textContent = student.middlename;
  //copy.querySelector(".lastName").textContent = student.lastname;
  //copy.querySelector(".nickName").textContent = student.nickname;

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
    let fullname = students.fullname;
    modal.querySelector(".modal-house").textContent = students.house;
    modal.dataset.theme = students.house;
    let logo = modal.querySelector("img.modal-image");
    logo.src = "imgs/" + students.house + ".jpg";

    /*   OR STATEMENT
      ("imgs/" + students.house.toLowerCase() + ".jpg") |
      ("imgs/" + students.house + ".jpg"); */
    modal.classList.remove("hide");
    return fullname;
  }

  document.querySelector("main").appendChild(copy);
}
//SORT
let sortBtn = document.querySelector("button.sort");
sortBtn.addEventListener("click", sortFunc);
function sortFunc(fullname) {
  fullname.sort();
}
