const loginBtn = document.querySelector(".login-btn");
const loginInput = document.querySelector("#password");

let password = 12345;

loginInput.addEventListener("keyup", function() {
  if (+(this.value) === password) {
    loginBtn.setAttribute("href", "teachers.html");
    console.log(this.value);
  } else {
    return false;
  }
})


loginBtn.addEventListener("submit", function(e) {
  let password = this.password.value;
  console.log(password);
})