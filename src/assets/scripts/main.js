function calcularPrecio(toppings, urlToppings, size, urlSizes) {
  let precioToppings = 0;
  let precioSize = 0;

  const toppingsXhr = new XMLHttpRequest();
  toppingsXhr.onreadystatechange = function () {
    if (toppingsXhr.readyState === XMLHttpRequest.DONE) {
      if (toppingsXhr.status === 200) {
        precioToppings = 0;
        const toppingsList = JSON.parse(toppingsXhr.responseText);
        toppings.forEach(function (selectedTopping) {
          toppingsList.forEach(function (topping) {
            if (topping.code === selectedTopping) {
              precioToppings += topping.price;
            }
          });
        });
        pintarPrecio(precioSize + precioToppings);
      } else {
        console.log(toppingsXhr.status, toppingsXhr.statusText);
      }
    }
  };
  toppingsXhr.onerror = function (reason) {
    console.log(reason);
  };
  toppingsXhr.open("GET", urlToppings);
  toppingsXhr.send(null);

  const sizeXhr = new XMLHttpRequest();
  sizeXhr.onreadystatechange = function () {
    if (sizeXhr.readyState === XMLHttpRequest.DONE) {
      if (sizeXhr.status === 200) {
        precioSize = 0;
        const sizes = JSON.parse(sizeXhr.responseText);
        sizes.forEach(function (item) {
          if (item.code === size) {
            precioSize += item.price;
          }
        });
        pintarPrecio(precioSize + precioToppings);
      } else {
        console.log(xhr.status, xhr.statusText);
      }
    }
  };
  sizeXhr.onerror = function (reason) {
    console.log(reason);
  };
  sizeXhr.open("GET", urlSizes);
  sizeXhr.send(null);
}

function cargarToppings(url) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        pintarToppings(JSON.parse(xhr.responseText));
      } else {
        console.log(xhr.status, xhr.statusText);
      }
    }
  };

  xhr.onerror = function (reason) {
    console.log(reason);
  };

  xhr.open("GET", url);

  xhr.send(null);
}

function cargarSizes(url) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        pintarSizes(JSON.parse(xhr.responseText));
      } else {
        console.log(xhr.status, xhr.statusText);
      }
    }
  };

  xhr.onerror = function (reason) {
    console.log(reason);
  };

  xhr.open("GET", url);

  xhr.send(null);
}

function pintarSizes(sizes) {
  const sizeItems = Array.from(document.getElementsByClassName("size"));

  sizeItems.forEach(function (sizeItem) {
    sizeItem.remove();
  });

  sizes.forEach(function (size) {
    const container = document.createElement("div");
    container.classList.add("radio-group-item");
    document.getElementById("size").appendChild(container);

    const input = document.createElement("input");
    input.type = "radio";
    input.classList.add("size");
    input.name = "size";
    input.id = `size_${size.code}`;
    input.value = size.code;
    container.appendChild(input);

    const label = document.createElement("label");
    label.htmlFor = `size_${size.code}`;
    label.append(size.name);
    container.appendChild(label);

    const price = document.createElement("small");
    price.append(`(+${size.price}€)`);
    label.appendChild(price);
  });
}

function pintarToppings(toppings) {
  // eliminar los toppings actuales
  const toppingItems = Array.from(document.getElementsByClassName("toppings"));
  toppingItems.forEach(function (toppingItem) {
    toppingItem.remove();
  });

  toppings.forEach(function (topping) {
    const container = document.createElement("div");
    container.classList.add("checkbox-group-item");
    document.getElementById("toppings").appendChild(container);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("toppings");
    input.name = topping.code;
    input.id = topping.code;
    container.appendChild(input);

    const label = document.createElement("label");
    label.htmlFor = topping.code;
    label.append(topping.name);
    container.appendChild(label);

    const price = document.createElement("small");
    price.append(`(+${topping.price}€)`);
    label.appendChild(price);
  });
}

function pintarPrecio(precio) {
  document.getElementById("total").innerText = precio;
}

function pintarError(campo, mensaje) {
  const parent = document.getElementById(campo).parentNode;
  parent.classList.add("has-error");
  const container = document.createElement("p");
  container.append(mensaje);
  container.classList.add("error-message");
  parent.appendChild(container);
}

function limpiarErrores() {
  const contenedores = Array.from(document.getElementsByClassName("has-error"));
  contenedores.forEach(function (contenedor) {
    contenedor.classList.remove("has-error");
  });
  const mensajes = Array.from(document.getElementsByClassName("error-message"));
  mensajes.forEach(function (mensaje) {
    mensaje.remove();
  });
}

function validarFormulario() {
  limpiarErrores();

  let resultado = true;
  const mensaje = "El campo es obligatorio.";

  const name = document.getElementById("name").value;
  if (name === "" || name === undefined) {
    pintarError("name", mensaje);
    resultado = false;
  }

  const email = document.getElementById("email").value;
  if (email === "" || email === undefined) {
    pintarError("email", mensaje);
    resultado = false;
  }

  const address = document.getElementById("address").value;
  if (address === "" || address === undefined) {
    pintarError("address", mensaje);
    resultado = false;
  }

  const phone = document.getElementById("phone").value;
  if (phone === "" || phone === undefined) {
    pintarError("phone", mensaje);
    resultado = false;
  }

  const radioButtons = Array.from(document.getElementsByClassName("size"));
  let marcados = 0;
  radioButtons.forEach(function (radio) {
    if (radio.checked) {
      marcados++;
    }
  });

  if (marcados === 0) {
    pintarError("size", "Debe seleccionar un tamaño de pizza.");
    resultado = false;
  }

  const checkboxList = Array.from(document.getElementsByClassName("toppings"));

  let checked = 0;
  checkboxList.forEach(function (checkbox) {
    if (checkbox.checked) {
      checked++;
    }
  });

  if (checked === 0) {
    pintarError("toppings", "Debe seleccionar al menos un ingrediente.");
    resultado = false;
  }

  return resultado;
}

function reiniciarFormulario() {
  limpiarErrores();
  pintarPrecio("-");
}

function enviarFormulario(ev) {
  if (!validarFormulario()) {
    ev.preventDefault();
  }

  let sizeChecked = "";
  const sizes = Array.from(document.getElementsByName("size"));
  sizes.forEach(function (size) {
    if (size.checked) {
      sizeChecked = size.value;
    }
  });

  let toppingsSeleccted = [];
  const toppings = Array.from(document.getElementsByClassName("toppings"));
  toppings.forEach(function (topping) {
    if (topping.checked) {
      toppingsSeleccted.push(topping.name);
    }
  });

  calcularPrecio(
    toppingsSeleccted,
    "/assets/data/toppings.json",
    sizeChecked,
    "/assets/data/sizes.json"
  );
}

function configurarFormulario() {
  document.getElementById("form").addEventListener("submit", enviarFormulario);
  document
    .getElementById("reset-btn")
    .addEventListener("click", reiniciarFormulario);

  cargarSizes("/assets/data/sizes.json");
  cargarToppings("/assets/data/toppings.json");
}

document.addEventListener("DOMContentLoaded", configurarFormulario);
