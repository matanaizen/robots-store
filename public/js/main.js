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

  $(document).on("click", ".order-now-button", function () {
    $.ajax({
      url: "/checkout",
      method: "POST",
      contentType: "application/json",
      success: function () {
        alert("Order completed! Redirecting...");
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
    });
  });

  $(document).on("submit", ".search-form", function (event) {
    event.preventDefault();

    const query = $("#query").val();
    const minPrice = $("#minPrice").val();
    const maxPrice = $("#maxPrice").val();
    const productList = $(".product-list");
    const categoryId = productList.data("category-id");

    $.ajax({
      url: `/category/${categoryId}/search`,
      method: "GET",
      contentType: "application/json",
      data: { query, minPrice, maxPrice },
      success: function (results) {
        productList.empty();

        if (results.length > 0) {
          results.forEach(function (product) {
            productList.append(`
              <div class="product-item">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button class="add-to-cart" data-product-id="${product._id}">
                  Add to Cart
                </button>
              </div>
            `);
          });
        } else {
          productList.append("<p>No results found for your search.</p>");
        }
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
    });
  });
  
  $(document).on("click", ".add-to-cart", function () {
    const productId = $(this).data("product-id");

    $.ajax({
      url: "/cart",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ productId }),
      success: function () {
        alert("Product added to cart!");
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
    });
  });

  $(document).on("click", ".add-category-button", function () {
    $("#addCategoryModal").show();
  });

  $(document).on("click", ".add-product-button", function () {
    $("#addProductModal").show();
  });

  $(document).on(
    "click",
    ".edit-category-button, .edit-product-button",
    function () {
      const isProduct = $(this).hasClass("edit-product-button");
      const itemId = $(this).data(isProduct ? "product-id" : "category-id");
      const name = $(this).data(isProduct ? "product-name" : "category-name");
      const description = $(this).data(
        isProduct ? "product-description" : "category-description"
      );

      $("#editItemId").val(itemId);
      $("#editName").val(name);
      $("#editDescription").val(description);

      if (isProduct) {
        const price = $(this).data("product-price");
        const imageUrl = $(this).data("product-imageurl");
        const categoryId = $(this).data("product-category");

        $("#editPrice").val(price);
        $("#editImageUrl").val(imageUrl);
        $(`#editProductCategory`).val(categoryId);

        $(".product-only").show();
      } else {
        $(".product-only").hide();
      }

      $("#editModal").show();
    }
  );

  $(".close-button").on("click", function () {
    $(".modal").hide();
  });

  $("#addCategoryForm").on("submit", function (event) {
    event.preventDefault();

    const name = $("#addCategoryName").val();
    const description = $("#addCategoryDescription").val();

    $.ajax({
      url: "/admin/categories",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ name, description }),
      success: function () {
        alert("Category added successfully!");
        $("#addCategoryModal").hide();
        location.reload();
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
    });
  });

    });
  });

  $(document).on("click", ".delete-category-button", function () {
    const categoryId = $(this).data("category-id");

    if (confirm("Are you sure you want to delete this category?")) {
      $.ajax({
        url: `/admin/categories/${categoryId}`,
        method: "DELETE",
        success: function () {
          alert("Category deleted!");
          location.reload();
        },
        error: function (xhr) {
          alert("Error: " + xhr.responseText);
        },
      });
    }
  });

function updateCartTotal() {
  let total = 0;
  $(".cart-item").each(function () {
    const itemTotal = parseFloat(
      $(this).find(".cart-item-total").text().replace("Total: $", "")
    );
    total += itemTotal;
  });
  $(".cart-total p").text(`Total: $${total.toFixed(2)}`);
}
