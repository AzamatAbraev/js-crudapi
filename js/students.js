import request from "./main.js";

const studentsRow = document.querySelector(".students-row");
const totalStudents = document.querySelector(".total-students");
const teacherIdText = document.querySelector(".teacher-id");
const studentsForm = document.querySelector(".students-row");
const studentModal = document.querySelector(".student-modal");
const submitBtn = document.querySelector(".save-btn");

let birthdaySort = "Sort";
let selected = null;


const query = new URLSearchParams(location.search);
const teacherId = query.get("teacherId");

function getStudentCard({
  firstName,
  lastName,
  avatar,
  birthday,
  doesWork,
  field,
  phoneNumber,
  email,
  id,
}) {
  return `
    <div class="teachers-card">
      <div class="teachers-img">
        <img
          class="teachers-pic"
          src="${avatar}"
          alt="img"
        />
      </div>
      <div class="teachers-body">
        <h3>${id} ${firstName} ${lastName}</h3>
        <p>
          Email:
          <span class="text-decoration-underline"
            >${email}</span
          >
        </p>
        <p>
          Phone:
          <span class="text-decoration-underline">${phoneNumber}</span>
        </p>
        <p>Birthdate: <span class="text-decoration-underline">${birthday.split("T")[0]}</span></p>
        <p>Works? <span> ${doesWork ? "&#9989;" : "&#10060;	"} </span></p>
      </div>
      <div class="btn-row">
        <a editId="${id}" class="btn btn-success" data-bs-toggle="modal"
        data-bs-target="#student-modal">Edit</a>
        <a deleteId="${id}" class="btn btn-danger">Delete</a>
      </div>
    </div>
  `;
}

teacherIdText.textContent = teacherId;

async function getStudent() {
  try {
    let { data } = await request.get(`Teacher/${teacherId}/Student`);
    studentsRow.innerHTML = "";
    data.map((student) => {
      studentsRow.innerHTML += getStudentCard(student);
    });
    totalStudents.innerHTML = data.length;
  } catch (err) {
    console.log(err);
  }
}

getStudent();

studentsForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();

    if (this.checkValidity()) {
      let student = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        birthday: this.birthday.value,
        avatar: this.image.value,
        email: this.email.value,
        phoneNumber: this.phone.value,
        doesWork: this.doesWork.value,
      };
      if (selected === null) {
        await request.post(`Teacher/${teacherId}/Student`, student);
      } else {
        await request.put(`Teacher/${teacherId}/Student${5}`, student);
      }
      bootstrap.Modal.getInstance(studentModal).hide();
      getTeachers();
    } else {
      this.classList.add("was-validated");
    }
  } catch (err) {
    console.log(err);
  }
});

studentsRow.addEventListener("click", async function (e) {
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");
    if (editId) {
      selected = editId;
      submitBtn.textContent = "Sava teacher";
      let { data } = await request.get(`Teacher/${editId}`);
      teachersForm.fullName.value = data.fullName;
      teachersForm.image.value = data.avatar;
      teachersForm.email.value = data.email;
      teachersForm.phone.value = data.phoneNumber;
      teachersForm.isMarried.value = data.isMarried;
    }
    if (deleteId) {
      let deleteConfirm = confirm(
        "Are you sure that you want to delete the information?"
      );
      if (deleteConfirm) {
        await request.delete(`Teacher/${deleteId}/Student/`);
        getTeachers();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
