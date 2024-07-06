const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addresWarn = document.getElementById("address-warn");

let cart = [];

//abrir carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
});

//fechar modal clicando fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

//fct adc carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//att carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    const formattedPrice = parseFloat(item.price).toFixed(2);

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${formattedPrice}</p>
            </div>
            
            <button class="remove-btn" data-name="${item.name}">
            Remover
            </button>
            
        </div>
        `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  const formattedTotal = total.toFixed(2);
  cartTotal.textContent = formattedTotal;
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

// remover itens cart
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addresWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  // const isOpen = checkOpen();
  // if(!isOpen){
  //     Toastify({
  //       text: "Restaurente fechado",
  //       duration: 3000,
  //       close: true,
  //       gravity: "top", // `top` or `bottom`
  //       position: "right", // `left`, `center` or `right`
  //       stopOnFocus: true, // Prevents dismissing of toast on hover
  //       style: {
  //         background: "#ef4444",
  //       },
  //     }).showToast();

  //   return;
  // }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addresWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //enviar wppweb
  const total = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  const cartItems = cart
    .map((item) => {
      return ` ${item.name} - Quantidade: (${item.quantity}), Preço: R$${item.price} |`;
    })
    .join("");
  const message = `Olá, gostaria de confirmar meu pedido:\n\n${cartItems}\n\nTotal: R$${total}\n\n`;

  const encodedMessage = encodeURIComponent(message);
  const phone = "41996029093";

  window.open(
    `https://wa.me/${phone}?text=${encodedMessage} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart.length = 0;
  updateCartModal();
});

//verificar se esta aberto
function checkOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}

document.addEventListener("DOMContentLoaded", function () {
  const handleLinkClick = function (event) {
    // Remover a borda de todos os links
    document.querySelectorAll("#navbar-items a").forEach((link) => {
      link.classList.remove("border-b", "text-red-500", "border-red-500");
    });

    // Adicionar borda ao link clicado
    event.target.classList.add("border-b", "text-red-500", "border-red-500");
  };

  document.querySelectorAll("#navbar-items a").forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });

  // Função para lidar com cliques fora dos links
  document.addEventListener("click", function (event) {
    // Verifica se o clique foi feito fora dos links do menu de navegação
    if (!event.target.matches("#navbar-items a")) {
      // Remove as classes adicionais de todos os links
      document.querySelectorAll("#navbar-items a").forEach((link) => {
        link.classList.remove("border-b", "text-red-500", "border-red-500");
      });
    }
  });
});
