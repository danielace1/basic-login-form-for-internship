const changePasswordFormEl = document.querySelector("#changePasswordForm");
const usernameEl = document.querySelector("#username");
const newPasswordEl = document.querySelector("#newPassword");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

document.addEventListener("DOMContentLoaded", () => {
  const storedUsername = getCookie("username");
  if (storedUsername) {
    usernameEl.value = storedUsername;
  }
});

async function handleChangePassword(e) {
  e.preventDefault();

  const username = usernameEl.value.trim();
  const newPassword = newPasswordEl.value.trim();

  if (username === "" || newPassword === "") {
    alert("Please fill in both username and new password.");
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]*$/;
  if (!passwordRegex.test(newPassword)) {
    alert(
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
    );
    return;
  }

  try {
    const response = await fetch(
      "https://basic-login-form-for-internship.vercel.app/api/users/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, newPassword }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      alert(errorMessage);
      return;
    }

    alert("Password has been successfully updated.");
    changePasswordFormEl.reset();
  } catch (error) {
    alert("An error occurred while changing your password. Please try again.");
    console.error(error);
  }
}

changePasswordFormEl.addEventListener("submit", handleChangePassword);
