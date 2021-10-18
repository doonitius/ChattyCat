//import { Register } from "../controller/loginRegis";

const form = document.getElementById("form2");
const email = document.getElementById("email");
const employeeID = document.getElementById("employeeID");
const userName = document.getElementById("username");
const password = document.getElementById("password");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (email.value && username.value && password.value && employeeID.value) {
        console.log(email.value, userName.value, password.value, employeeID.value);
        register(email.value, userName.value, password.value, employeeID.value);
    } else {
        console.log("Please enter");
    }
});

async function register(email, userName, password, employeeID) {
    let sendthis = {
        email: email,
        userName: userName,
        password: password,
        employeeID: employeeID
    };
    console.log(sendthis);
    let res = await axios.post("http://localhost:3000/login-register/register", sendthis);
    console.log(res);
    return;
}