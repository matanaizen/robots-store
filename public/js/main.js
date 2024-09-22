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

  $("#addProductForm").on("submit", function (event) {
    event.preventDefault();

    const name = $("#addProductName").val();
    const description = $("#addProductDescription").val();
    const price = $("#addProductPrice").val();
    const imageUrl = $("#addProductImageUrl").val();
    const category = $("#addProductCategory").val();

    $.ajax({
      url: "/admin/products",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ name, description, price, category, imageUrl }),
      success: function () {
        alert("Product added successfully!");
        $("#addProductModal").hide();
        location.reload();
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
    });
  });

  $("#editForm").on("submit", function (event) {
    event.preventDefault();

    const isProduct = $(".product-only").is(":visible");
    const itemId = $("#editItemId").val();
    const name = $("#editName").val();
    const description = $("#editDescription").val();
    const price = $("#editPrice").val();
    const imageUrl = $("#editImageUrl").val();
    const category = $("#editProductCategory").val();

    const url = isProduct
      ? `/admin/products/${itemId}`
      : `/admin/categories/${itemId}`;
    const data = isProduct
      ? { name, description, price, imageUrl, category }
      : { name, description };

    $.ajax({
      url: url,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        alert("Item updated successfully!");
        $("#editModal").hide();
        location.reload();
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
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

  $(document).on("click", ".delete-product-button", function () {
    const productId = $(this).data("product-id");

    if (confirm("Are you sure you want to delete this product?")) {
      $.ajax({
        url: `/admin/products/${productId}`,
        method: "DELETE",
        success: function () {
          alert("Product deleted!");
          location.reload();
        },
        error: function (xhr) {
          alert("Error: " + xhr.responseText);
        },
      });
    }
  });
});

$(document).on("click", ".update-quantity-button", function () {
  const productId = $(this).data("product-id");
  const quantity = parseInt($(`#quantity-${productId}`).val(), 10);

  if (isNaN(quantity) || quantity < 1) {
    alert("Please enter a valid quantity (minimum 1).");
    return;
  }

  $.ajax({
    url: "/cart/update",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ productId, quantity }),
    success: function () {
      const productPrice = parseFloat(
        $(`#quantity-${productId}`)
          .closest(".cart-item")
          .find(".cart-item-price")
          .text()
          .replace("Price: $", "")
      );

      $(`#quantity-${productId}`)
        .closest(".cart-item")
        .find(".cart-item-total")
        .text(`Total: $${(quantity * productPrice).toFixed(2)}`);

      updateCartTotal();
    },
    error: function (xhr) {
      alert("Error: " + xhr.responseText);
    },
  });
});

$(document).on("click", ".remove-item-button", function () {
  const productId = $(this).data("product-id");

  if (confirm("Are you sure you want to remove this item from your cart?")) {
    $.ajax({
      url: "/cart/remove",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ productId }),
      success: function () {
        $(`#quantity-${productId}`).closest(".cart-item").remove();

        updateCartTotal();

        if ($(".cart-item").length === 0) {
          $(".cart-list").html("<p>Your cart is empty.</p>");
          $(".cart-total").remove();
        }
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

$(document).ready(function () {
  const salesChartElement = document.getElementById("salesChart");

  if (salesChartElement) {
    const salesData = JSON.parse(salesChartElement.getAttribute("data-sales"));

    const labels = salesData.map((item) => item.product.name);
    const quantities = salesData.map((item) => item.totalQuantity);

    const ctx = salesChartElement.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Quantity Sold",
            data: quantities,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  const categorySalesElement = document.getElementById("categorySalesChart");
  if (categorySalesElement) {
    const categorySalesData = JSON.parse(
      categorySalesElement.getAttribute("data-category-sales")
    );

    const ctx = categorySalesElement.getContext("2d");

    if (categorySalesData.length === 0) {
      categorySalesData.push({
        name: "No Sales Data",
        totalSales: 1,
      });
    }

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: categorySalesData.map((item) => item.name),
        datasets: [
          {
            data: categorySalesData.map((item) => item.totalSales),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                if (tooltipItem.label === "No Sales Data") {
                  return "No sales data available";
                }
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
      },
    });
  }
});