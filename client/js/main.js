(function ($) {
  "use strict";

  /*==================================================================
    [ Focus input ]*/
  $(".input100").each(function () {
    $(this).on("blur", function () {
      if ($(this).val().trim() != "") {
        $(this).addClass("has-val");
      } else {
        $(this).removeClass("has-val");
      }
    });
  });

  /*==================================================================
    [ Validate ]*/
  var input = $(".validate-input .input100");

  $(".validate-form").on("submit", function () {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });

  $(".validate-form .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  /*==================================================================
    [ Show pass ]*/
  var showPass = 0;
  $(".btn-show-pass").on("click", function () {
    if (showPass == 0) {
      $(this).next("input").attr("type", "text");
      $(this).addClass("active");
      showPass = 1;
    } else {
      $(this).next("input").attr("type", "password");
      $(this).removeClass("active");
      showPass = 0;
    }
  });
})(jQuery);

const formEl = document.querySelector("form");
const usernameEl = document.querySelector("#username");
const passwordEl = document.querySelector("#password");
const submitBtnEl = document.querySelector("#submit");
const rememberMeEl = document.querySelector("#ckb1");
const forgotPasswordEl = document.querySelector("#forgotPassword");

// Function to get a cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function handleSubmit(e) {
  e.preventDefault();

  const username = usernameEl.value.trim();
  const password = passwordEl.value.trim();
  const rememberMe = rememberMeEl.checked;

  if (username === "" || password === "") {
    alert("Please fill in both username and password.");
    return;
  }

  if (username.length < 3) {
    alert(
      "Username should be at least 3 characters long and password should be at least 8 characters long."
    );
    return;
  }

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]*$/;
  if (!passwordRegex.test(password)) {
    alert(
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
    );
    return;
  }

  try {
    const response = await fetch(
      `https://basic-login-form-for-internship.vercel.app/api/users/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password, rememberMe }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      alert(errorMessage);
      return;
    }

    const data = await response.json();

    console.log(data);
    alert(`Welcome ${data.username}, your account has been created!`);

    // Store login state in cookies if rememberMe is checked
    if (rememberMe) {
      document.cookie = `username=${username}; path=/; max-age=3600; Secure; SameSite=Lax`;
    } else {
      document.cookie = `username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    formEl.reset();
  } catch (error) {
    alert("An error occurred while creating your account. Please try again.");
    console.error(error);
  }
}

submitBtnEl.addEventListener("click", handleSubmit);

// Display username from cookies on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedUsername = getCookie("username");
  if (storedUsername) {
    usernameEl.value = storedUsername;
  }
});
