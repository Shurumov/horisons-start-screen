var userData, sessionId, userId, projectName, baseUrl, refreshToken;

const schemaIdRegistration = "Registration";
const loader = document.querySelector(".loader-background");
const form = document.querySelector("form");
const submitButton = form.querySelector("button");
const refuse = document.querySelector(".refuse");
const inputs = form.querySelectorAll(".required-input");
const menu = document.querySelector(".menu");
const form_wrapper = document.querySelector(".form_wrapper");
const buttonsWrapper = document.querySelector(".buttons_wrapper");
const buttons_wrapper = document.querySelector(".buttons_wrapper");
const agree = document.querySelector(".agree");

function sessionFromNative(e) {
  userData = JSON.parse(e);
  sessionId = userData.sessionId;
  userId = +userData.userId;
  projectName = userData.projectName;
  baseUrl = userData.baseUrl;
  refreshToken = userData.refreshToken;
  checkRegistration();
}

function checkRegistration() {
  let url = `${baseUrl}${projectName}/objects/${schemaIdRegistration}/query`;
  var reqBody = {
    where: {
      userId: userId
    },
    include: ["userId"]
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Appercode-Session-Token", sessionId);

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
    if (xhr.status == 401) {
      console.log("не удалось получить данные");
      loginByToken();
    } else if (xhr.status == 200) {
      try {
        response = JSON.parse(xhr.responseText);
        if (response.length) {
          menu.hidden = false;
          form_wrapper.hidden = true;
        } else {
          buttonsWrapper.hidden = false;
          menu.hidden = true;
          form_wrapper.hidden = true;
        }
        stopLoadAnimation();
      } catch (err) {
        console.log("Ошибка при парсинге ответа сервера.");
      }
    } else {
    }
  };
  xhr.send(JSON.stringify(reqBody));
}

function sendUserProfile(e) {
  e.preventDefault();
  startLoadAnimation();
  var lastName = document.querySelector("#lastName").value;
  var firstName = document.querySelector("#firstName").value;
  var position = document.querySelector("#position").value;
  var email = document.querySelector("#email").value;
  var phoneNumber = document.querySelector("#phoneNumber").value;
  var programSessions = document.querySelectorAll(":checked");
  var session1 = programSessions[0].value || undefined;
  var session2 = programSessions[1].value || undefined;
  var session3 = programSessions.length == 3 ? programSessions[2].value : "";

  var url = `${baseUrl}${projectName}/objects/${schemaIdRegistration}`;
  var reqBody = {
    userId: userId,
    lastName: lastName,
    firstName: firstName,
    position: position,
    email: email,
    phoneNumber: phoneNumber,
    session1: session1,
    session2: session2,
    session3: session3
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Appercode-Session-Token", sessionId);

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) {
      return;
    }
    if (xhr.status == 401) {
      console.log("не удалось получить данные");
    } else if (xhr.status == 200) {
      try {
        menu.hidden = false;
        form_wrapper.hidden = true;
        buttons_wrapper.hidden = true;
        stopLoadAnimation();
      } catch (err) {
        console.log("Ошибка при парсинге ответа сервера.");
        stopLoadAnimation();
      }
    }
  };

  xhr.send(JSON.stringify(reqBody));
}

function stopLoadAnimation() {
  loader.hidden = true;
}

function startLoadAnimation() {
  loader.hidden = false;
}

function showForm() {
  buttons_wrapper.hidden = true;
  form_wrapper.hidden = false;
  menu.hidden = true;
}

function changeInput() {
  var programSessions = document.querySelectorAll("input[type=radio]:checked");
  var t = false;
  t = Array.prototype.some.call(inputs, function(item) {
    return item.value == "" || programSessions.length != 2;
  });
  return t
    ? (submitButton.setAttribute("disabled", "true"), !1)
    : (submitButton.removeAttribute("disabled"), !0);
}

function ready() {
  Array.prototype.forEach.call(inputs, function(e) {
    e.oninput = changeInput;
  });

  form.addEventListener("submit", sendUserProfile);
  refuse.addEventListener("click", sendUserProfile);
  agree.addEventListener("click", showForm);
}

document.addEventListener("DOMContentLoaded", ready);
