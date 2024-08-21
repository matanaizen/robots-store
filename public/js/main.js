$(document).ready(function () {
  $(document).on("submit", ".register-form", function (event) {
    event.preventDefault();

    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();

    $.ajax({
      url: "/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ name, email, password }),
      success: function () {
        $(".message").text("Registration successful! Redirecting...");
        setTimeout(function () {
          window.location.href = "/login";
        }, 1000);
      },
      error: function (xhr) {
        $(".message").text("Error: " + xhr.responseText);
      },
    });
  });

  $(document).on("submit", ".login-form", function (event) {
    event.preventDefault();

    const email = $("#email").val();
    const password = $("#password").val();

    $.ajax({
      url: "/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function () {
        $(".message").text("Login successful! Redirecting...");
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
      },
      error: function (xhr) {
        $(".message").text("Error: " + xhr.responseText);
      },
    });
  });
});

