import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const nombre = document.getElementById("nombre");
const menuDiv = document.getElementById("menu");

// 🔥 LEER DESDE HASH
const id = location.hash.replace("#", "");

console.log("URL:", window.location.href);
console.log("ID:", id);

let data = null;
let carrito = [];

// Cargar menú
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
          console.log("Carrito:", carrito);
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

// WhatsApp
window.enviar = function () {
  if (!data || carrito.length === 0) return;

  let texto = "Hola, quiero pedir:%0A";

  carrito.forEach(i => {
    texto += `- ${i.nombre} ($${i.precio})%0A`;
  });

  window.open(`https://wa.me/${data.whatsapp}?text=${texto}`);
};

cargar();