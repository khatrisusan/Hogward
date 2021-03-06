"use strict";
/* GLOBAL VARS */
const url = [
  "http://petlatkea.dk/2020/hogwarts/students.json",
  "http://petlatkea.dk/2020/hogwarts/families.json",
];
let filterValue;
let studentsJSON;
let sortValue;
let searchValue;
let whatHouse;
let currentArray;
let hacked = false;
/* OBJECTS */
const students = [];
const families = [];
const newArray = [];
let bloodArray = [];
let expelledArray = [];
/* PROTOTYPE */
const Student = {
  fullname: "",
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  blood: "",
  gender: "",
  house: "",
  profile: "",
  desc: [],
  age: 0,
  expelled: false,
  squad: false,
};
/* FILTER SETTINGS */
const settings = {
  typeOfFilter: null,
  filter: "*",
  sortBy: null,
  sortDir: "asc",
};
loadStudentsJSON(url[0]);
loadFamiliesJSON(url[1]);
/* START */
window.addEventListener("DOMContentLoaded", init);
function init() {
  fetchData();
  //sortAndFilter();
}
function fetchData() {
  async function loadStuentsJSON(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    studentsJSON = jsonData;
    itsDone();
  }
  async function loadFamiliesJSON(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    familiesJSON = jsonData;
    itsDone();
  }
}
function itsDone() {
  if (++fileCounter == url.length) {
    // console.log("all files loaded");
    prepareStudentObjects(studentsJSON);
  }
}
function itsDone() {
  if (++fileCounter == url.length) {
    // console.log("all files loaded");
    prepareStudentObjects(studentsJSON);
  }
}

function prepareStudentObjects(jsonData) {
  // console.log("prepareStudentObjects()");

  jsonData.forEach((jsonObject) => {
    // Create new object with cleaned data - and store that in the students array
    const student = Object.create(Student);
    let student_fullname = fullnameCapitalization(jsonObject.fullname);
    const student_house = houseCapitalization(jsonObject.house);

    // store data in Student object
    student.nickName = "";
    if (student_fullname.indexOf('"') != -1) {
      student.nickName = student_fullname.substring(
        student_fullname.indexOf('"') - 1,
        student_fullname.lastIndexOf('"') + 2
      );
      student_fullname = student_fullname.replace(student.nickName, " ");
      student.nickName = student.nickName.trim();
    }
    student.fullname = student_fullname;

    student.firstName = student_fullname.substring(
      0,
      student_fullname.indexOf(" ")
    );
    if (student.fullname.search("-") != -1) {
      student.lastName = student_fullname.substring(
        student_fullname.lastIndexOf("-") + 1
      );
      student.middleName = student_fullname.substring(
        student_fullname.indexOf(" ") + 1,
        student_fullname.lastIndexOf("-")
      );
    } else {
      student.lastName = student_fullname.substring(
        student_fullname.lastIndexOf(" ") + 1
      );
      student.middleName = student_fullname.substring(
        student_fullname.indexOf(" ") + 1,
        student_fullname.lastIndexOf(" ")
      );
    }

    student.expelled = false;
    student.squad = false;
    student.desc = [];
    student.gender = jsonObject.gender;
    student.house = student_house;
    student.blood = setBloodStatus(student.lastName, student.house);
    student.profile = setProfileName(student.lastName, student.firstName);

    students.push(student);
  });

  function setProfileName(lastName, firstName) {
    let sameLastName = false;
    students.forEach((student) => {
      if (student.lastName === lastName) {
        sameLastName = true;
        student.profile = `profile/${lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
      }
    });

    if (sameLastName)
      return `profile/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
    else
      return `profile/${lastName.toLowerCase()}_${firstName
        .substring(0, 1)
        .toLowerCase()}.png`;
  }

  function setBloodStatus(lastName, house) {
    if (house === "Slytherin") return "Pure";
    const result = familiesJSON.half.find((e) => e === lastName);
    if (result == undefined) return "Pure";
    else return "Half";
  }

  function fullnameCapitalization(fullname) {
    let i = 0,
      capitalizedFullname = "";
    for (i = 0; i < fullname.length - 1; i++) {
      if (fullname[i] == " " || fullname[i] == "-" || fullname[i] == '"') {
        capitalizedFullname += fullname[i];
        while (
          fullname[i + 1] == " " ||
          fullname[i + 1] == "-" ||
          fullname[i + 1] == '"'
        ) {
          capitalizedFullname += fullname[++i];
        }
        capitalizedFullname += fullname[++i].toUpperCase();
      } else if (i == 0) capitalizedFullname += fullname[i].toUpperCase();
      else capitalizedFullname += fullname[i].toLowerCase();
    }
    if (fullname.length - 1 == i)
      capitalizedFullname += fullname[i].toLowerCase();
    cnt = 0;
    for (i = 0; ; i++) {
      if (
        capitalizedFullname[i] == " " ||
        capitalizedFullname[i] == "-" ||
        capitalizedFullname[i] == '"'
      )
        cnt++;
      else break;
    }
    if (cnt > 0) capitalizedFullname = capitalizedFullname.substring(cnt);
    return capitalizedFullname.trim();
  }

  function houseCapitalization(house) {
    return (
      house.trim()[0].toUpperCase() + house.trim().substring(1).toLowerCase()
    );
  }

  displayList(students);
}

function displayList(students) {
  // console.log("displayList()");

  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // console.log("displayStudent()");

  // if its expelled student, don't show up on the list
  if (settings.filter != "expelled" && student.expelled === true) return;

  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=fullname]").textContent = student.fullname;

  // querySelector Set
  HTML.text_house = clone.querySelector(".house");
  HTML.detail_button = clone.querySelector(".detail_button");

  // translate textContent to img file
  HTML.text_house.src = `img/${HTML.text_house.textContent}.PNG`;

  // if clicks detail button
  HTML.detail_button.addEventListener("click", function () {
    // show up data on modal
    if (student.expelled) HTML.expel_button.style.display = "none";
    if (student.blood != "Pure") HTML.squad_button.style.display = "none";
    HTML.modal_name.innerHTML = student.fullname;
    HTML.modal_nickname.innerHTML =
      student.nickName === "" ? "" : `&nbsp;${student.nickName}`;
    HTML.modal_gender.innerHTML = student.gender == "boy" ? "♂" : "♀";
    HTML.modal_house.innerHTML = student.house;
    HTML.modal_blood.innerHTML = student.blood;
    HTML.modal_profile.src = student.profile;
    if (student.desc.length != 0) {
      HTML.modal_desc.innerHTML = "";
      for (let i = 0; i < student.desc.length; i++)
        HTML.modal_desc.innerHTML += `- ${student.desc[i]} <br>`;
    } else HTML.modal_desc.innerHTML = `Nothing`;
    HTML.modal_content.dataset.theme = student.house;
    HTML.modal_buttons.dataset.student = student.fullname;
    HTML.modal.style.display = "block";
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
