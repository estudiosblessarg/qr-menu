let carrito = [];
let data = null;

function obtenerMenu() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("data");

  if (!encoded) return null;

  const json = decodeURIComponent(escape(atob(encoded)));
  return JSON.parse(json);
}

function render() {
  data = obtenerMenu();

  document.getElementById("nombre").innerText = data.nombre;

  const menuDiv = document.getElementById("menu");

  data.categorias.forEach(cat => {
    const div = document.createElement("div");
    div.innerHTML = `<h2>${cat.nombre}</h2>`;

    cat.items.forEach(item => {
      const el = document.createElement("div");
      el.innerHTML = `
        <p>${item.nombre} - $${item.precio}</p>
        <button onclick="agregar('${item.nombre}', ${item.precio})">Agregar</button>
      `;
      div.appendChild(el);
    });

    menuDiv.appendChild(div);
  });
}

function agregar(nombre, precio) {
  carrito.push({ nombre, precio });
  alert("Agregado");
}

function enviar() {
  let texto = "Hola, quiero pedir:%0A";

  carrito.forEach(i => {
    texto += `- ${i.nombre} ($${i.precio})%0A`;
  });

  window.open(`https://wa.me/${data.whatsapp}?text=${texto}`);
}

document.getElementById("buscar").addEventListener("input", e => {
  const valor = e.target.value.toLowerCase();
  document.querySelectorAll("#menu div p").forEach(p => {
    p.parentElement.style.display =
      p.innerText.toLowerCase().includes(valor) ? "block" : "none";
  });
});

render();