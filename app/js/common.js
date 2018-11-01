var userData, session, userId, projectName, baseUrl, refreshToken;

const schemaIdRegistration = "UserProfiles";
const loader = document.querySelector(".loader-background");
const form = document.querySelector("form");
const submitButton = form.querySelector("button");
const refuse = document.querySelector(".refuse");
const inputs = form.querySelectorAll("input");
const menu = document.querySelector(".menu");

function sessionFromNative(e) {
  userData = JSON.parse(e);
  session = userData.sessionId;
  userId = userData.userId;
  projectName = userData.projectName;
  baseUrl = userData.baseUrl;
  refreshToken = userData.refreshToken;
  checkRegistration();
}

function checkRegistration() {
  let url = `${baseUrl}${projectName}/objects/${schemaIdRegistration}/query`;
  let reqBody = {
    where: {
      userId: userId
    }
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appercode-Session-Token": session
    },
    body: JSON.stringify(reqBody)
  })
    .then(function(response) {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
      }
      return Promise.resolve(response);
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.length) {
        menu.hidden = false;
      } else {
        document.querySelector(".form_wrapper").hidden = true;
      }
      stopLoadAnimation();
    })
    .catch(function(error) {
      stopLoadAnimation();
      console.log("error", error);
    });
}

function sendUserProfile(e) {
  e.preventDefault();
  startLoadAnimation();
  var lastName = document.querySelector("#lastName").value;
  var firstName = document.querySelector("#firstName").value;
  var position = document.querySelector("#position").value;
  var email = document.querySelector("#email").value;
  var phoneNumber = document.querySelector("#phoneNumber").value;

  var url = `${baseUrl}${projectName}/objects/${schemaIdRegistration}`;
  var reqBody = {
    userId: userId,
    lastName: lastName,
    firstName: firstName,
    position: position,
    email: email,
    phoneNumber: phoneNumber
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appercode-Session-Token": session
    },
    body: JSON.stringify(reqBody)
  })
    .then(function(response) {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
      }
      return Promise.resolve(response);
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.log("error", error);
    });
}

function stopLoadAnimation() {
  loader.hidden = true;
}

function startLoadAnimation() {
  loader.hidden = false;
}

function changeInput() {
  var t = false;
  t = Array.prototype.some.call(inputs, function(item) {
    return item.value == "";
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
}

document.addEventListener("DOMContentLoaded", ready);
