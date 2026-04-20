import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const nombre = document.getElementById("nombre");
const menuDiv = document.getElementById("menu");
const mesaInput = document.getElementById("mesa");

// 🔥 ID desde hash
const id = location.hash.replace("#", "");

console.log("URL:", window.location.href);
console.log("ID:", id);

let data = null;
let carrito = [];

// =============================
// 📦 CARGAR MENÚ
// =============================
async function cargar() {
  try {
    if (!id) {
      nombre.innerText = "Menú no encontrado";
      return;
    }

    const ref = doc(db, "menus", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      nombre.innerText = "Menú inexistente";
      return;
    }

    data = snap.data();

    nombre.innerText = data.nombre;
    menuDiv.innerHTML = "";

    data.categorias.forEach(cat => {
      const div = document.createElement("div");
      div.innerHTML = `<h2>${cat.nombre}</h2>`;

      cat.items.forEach(item => {
        const el = document.createElement("div");

        el.innerHTML = `
          <p>${item.nombre} - $${item.precio}</p>
          <button>Agregar</button>
        `;

        el.querySelector("button").addEventListener("click", () => {
          carrito.push(item);
          console.log("🛒 Carrito:", carrito);
        });

        div.appendChild(el);
      });

      menuDiv.appendChild(div);
    });

  } catch (e) {
    console.error("Error:", e);
    nombre.innerText = "Error cargando";
  }
}

// =============================
// 📲 WHATSAPP
// =============================
window.enviar = function () {
  if (!data) return;

  const mesa = mesaInput.value.trim();

  if (!mesa) {
    alert("Ingresá el número de mesa");
    return;
  }

  if (carrito.length === 0) {
    alert("Agregá productos primero");
    return;
  }

  // 🕒 Fecha y hora
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString();
  const hora = ahora.toLocaleTimeString();

  let texto = `🧾 Pedido\n`;
  texto += `📍 Mesa: ${mesa}\n`;
  texto += `📅 Fecha: ${fecha}\n`;
  texto += `⏰ Hora: ${hora}\n\n`;
  texto += `🍔 Productos:\n`;

  carrito.forEach(i => {
    texto += `- ${i.nombre} ($${i.precio})\n`;
  });

  const url = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(texto)}`;

  console.log("📲 WhatsApp:", url);

  window.open(url, "_blank");
};

cargar();