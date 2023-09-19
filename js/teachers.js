import request from "./main.js";
import LIMIT from "./const.js";

const groups = ["N11", "N13", "N15", "N22", "N48", "N2", "N35"];

const teachersRow = document.querySelector(".teachers-row");
const searchInput = document.querySelector(".search-input");
const totalTeachers = document.querySelector(".total-teachers");
const pagination = document.querySelector(".pagination");
const teachersForm = document.querySelector(".teachers-form");
const teacherModal = document.querySelector("#teacher-modal");
const openBtnModal = document.querySelector(".open-modal-btn");
const submitBtn = document.querySelector(".save-btn");

function getTeachersCard({
  id,
  avatar,
  fullName,
  email,
  phoneNumber,
  isMarried,
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
        <h3>${id}.
        ${fullName}</h3>
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
        <p>Group: <span class="text-decoration-underline">${
          groups[id % groups.length]
        }</span></p>
        <p>Married <span> ${isMarried ? "&#9989;" : "&#10060;	"} </span></p>
      </div>
      <div class="btn-row">
        <a editId="${id}" class="btn btn-success" data-bs-toggle="modal"
        data-bs-target="#teacher-modal">Edit</a>
        <a class="btn btn-info students-link" name="${fullName}" href="student.html?teacherId=${id}" ata-bs-toggle="modal"
          data-bs-target="#student-modal">Students</a>
        <a deleteId="${id}" class="btn btn-danger">Delete</a>
      </div>
    </div>
  `;
}

let search = "";
let activePage = 1;
let selected = null;

async function getTeachers() {
  try {
    let params = { fullName: search };
    let { data } = await request.get("Teacher", { params });

    params = { ...params, page: activePage, limit: LIMIT };

    let { data: dataPgtn } = await request.get("Teacher", { params });

    let len = data.length;

    let pages = Math.ceil(len / LIMIT);

    pagination.innerHTML = `
      <li class="page-item ${activePage === 1 ? "disabled" : ""}">
        <button page="-" class="page-link">Previous</button>
      </li>`;

    for (let page = 1; page <= pages; page++) {
      pagination.innerHTML += `<li class="page-item ${
        activePage === page ? "active" : ""
      }"><button page="${page}" class="page-link">${page}</button></li>
`;
    }

    pagination.innerHTML += `
      <li class="page-item ${activePage === pages ? "disabled" : ""}">
        <button page="+" class="page-link">Next</button>
      </li>`;

    totalTeachers.textContent = len;

    teachersRow.innerHTML = "";

    dataPgtn.map((teachers) => {
      teachersRow.innerHTML += getTeachersCard(teachers);
    });
  } catch (err) {
    console.log(err.response.data);
  }
}

getTeachers();

searchInput.addEventListener("keyup", function () {
  search = this.value;
  getTeachers();
});

pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page === "-") {
    activePage--;
  } else if (page === "+") {
    activePage++;
  } else {
    activePage = +page;
  }
  getTeachers();
});

teachersForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();

    if (this.checkValidity()) {
      let teacher = {
        fullName: this.fullName.value,
        avatar: this.image.value,
        email: this.email.value,
        phoneNumber: this.phone.value,
        isMarried: this.isMarried.value,
      };
      if (selected === null) {
        await request.post("Teacher", teacher);
      } else {
        await request.put(`Teacher/${selected}`, teacher)
      }
      bootstrap.Modal.getInstance(teacherModal).hide();
      getTeachers();
    } else {
      this.classList.add("was-validated");
    }
  } catch (err) {
    console.log(err);
  }
});

openBtnModal.addEventListener("click", function () {
  selected = null;
  submitBtn.textContent = "Add teacher";
  teachersForm.fullName.value = "";
  teachersForm.image.value = "";
  teachersForm.email.value = "";
  teachersForm.phone.value = "";
  teachersForm.email.value = "";
});

teachersRow.addEventListener("click", async function (e) {
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");
    if (editId) {
      selected = editId;
      submitBtn.textContent = "Sava teacher"
      let { data } = await request.get(`Teacher/${editId}`);
      teachersForm.fullName.value = data.fullName;
      teachersForm.image.value = data.avatar;
      teachersForm.email.value = data.email;
      teachersForm.phone.value = data.phoneNumber;
      teachersForm.isMarried.value = data.isMarried;
    }
    if (deleteId) {
      let deleteConfirm = confirm("Are you sure that you want to delete the information?");
      if (deleteConfirm) {
        await request.delete(`Teacher/${deleteId}`);
        getTeachers();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
