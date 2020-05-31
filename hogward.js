"use strict";
window.addEventListener("DOMContentLoaded", init);
let bloodArray = {};
let allStudents = [];
// The prototype for all students:
const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  photo: "",
  house: "",
  blood: "",
};

function init() {
  fetchStudentList();
  fetchFamilyList();
}
async function fetchStudentList() {
  const response = await fetch(
    "https://petlatkea.dk/2020/hogwarts/students.json"
  );
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}
function fetchFamilyList() {
  fetch("http://petlatkea.dk/2020/hogwarts/families.json")
    .then((res) => res.json())
    .then((bloods) => {
      bloodArray = bloods;
      console.log(bloods);
    });

  // when loaded, prepare data objects
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);

  buildList();
}
function preapareObject(jsonObject) {
  const student = Object.create(Student);
  const houseName = jsonObject.house.trim();
  student.house =
    houseName.substring(0, 1).toUpperCase() +
    houseName.substring(1).toLowerCase();
  const genderName = jsonObject.gender.trim();
  student.gender =
    genderName.substring(0, 1).toUpperCase() +
    genderName.substring(1).toLowerCase();
  let letter = jsonObject.fullname;

  student.nickname = "";
  if (letter.indexOf('"') != -1) {
    student.nickname = true;
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
    student.middlename = letter[letter.indexOf(" ") + 1].toUpperCase();
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
  //console.log(student);
  let template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector(".fullName span.one").textContent = student.firstname;
  copy.querySelector(".fullName span.two").textContent = student.middlename;
  copy.querySelector(".fullName span.three").textContent = student.lastname;
  copy.querySelector(".house").textContent = student.house;
  //ADDED MODAL ON CLICK ON BUTTON
  const modal = document.querySelector(".modal-background");
  modal.addEventListener("click", () => {
    modal.classList.add("hide");
  });
  copy
    .querySelector(".detail-btn")
    .addEventListener("click", (showStudents) => {
      showDetails(student);
    });

  function showDetails(students) {
    console.log(students);

    modal.querySelector(".modal-name").textContent =
      students.firstname + " " + student.middlename + " " + student.lastname;
    let fullname = students.fullname;
    modal.querySelector(".modal-gender span").textContent = student.gender;
    if (student.nickname == true) {
      modal.querySelector(
        ".modal-nickname span"
      ).textContent = `Nickname : ${student.nickname}`;
    }
    modal.dataset.theme = students.house;
    let logo = modal.querySelector("img.crest-image");
    logo.src = "imgs/" + students.house.toLowerCase() + ".jpg";
    let image = modal.querySelector("img.student-image");
    image.src =
      "images/" +
      student.lastname.toLowerCase() +
      "_" +
      student.firstname[0] +
      ".png";
    modal.classList.remove("hide");
    return fullname;
  }
  console.log(student.lastname);

  document.querySelector("main").appendChild(copy);
}

//todos
//blood
//filterby the selected value
//search
//addto inquistorial
//addto prefect
//expel
//hack
