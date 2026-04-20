import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 DOM
const nombre = document.getElementById("nombre");
const menuDiv = document.getElementById("menu");

// 🔹 Obtener ID desde HASH (#)
const id = location.hash.replace("#", "");

console.log("🌐 URL completa:", window.location.href);
console.log("🔗 HASH:", location.hash);
console.log("🆔 ID procesado:", id);

let data = null;
let carrito = [];

// =============================
// 🔥 CARGAR MENÚ
// =============================
async function cargar() {
  try {
    if (!id) {
      console.warn("❌ No hay ID en la URL (hash vacío)");
      nombre.innerText = "Menú no encontrado";
      return;
    }

    console.log("📡 Buscando en Firestore ID:", id);

    const ref = doc(db, "menus", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("❌ Documento no existe en Firestore");
      nombre.innerText = "Menú inexistente";
      return;
    }

    data = snap.data();
    console.log("✅ DATA recibida:", data);

    // 🔹 Validación estructura
    if (!data.nombre || !Array.isArray(data.categorias)) {
      console.error("❌ Estructura inválida:", data);
      nombre.innerText = "Error en datos del menú";
      return;
    }

    nombre.innerText = data.nombre;
    menuDiv.innerHTML = ""; // limpiar

    // 🔹 Render categorías e items
    data.categorias.forEach((cat, i) => {
      if (!cat.items || !Array.isArray(cat.items)) {
        console.warn(`⚠️ Categoría sin items [${i}]`, cat);
        return;
      }

      const div = document.createElement("div");
      div.innerHTML = `<h2>${cat.nombre}</h2>`;

      cat.items.forEach((item, j) => {
        if (!item.nombre || item.precio == null) {
          console.warn(`⚠️ Item inválido [${i}-${j}]`, item);
          return;
        }

        const el = document.createElement("div");

        el.innerHTML = `
          <p>${item.nombre} - $${item.precio}</p>
          <button>Agregar</button>
        `;

        el.querySelector("button").addEventListener("click", () => {
          agregar(item.nombre, item.precio);
        });

        div.appendChild(el);
      });

      menuDiv.appendChild(div);
    });

  } catch (err) {
    console.error("🔥 ERROR REAL:", err);
    nombre.innerText = "Error cargando menú";
    menuDiv.innerHTML = "<p>Revisá la consola</p>";
  }
}

// =============================
// 🛒 CARRITO
// =============================
function agregar(n, p) {
  carrito.push({ n, p });
  console.log("🛒 Carrito actual:", carrito);
}

// =============================
// 📲 WHATSAPP
// =============================
function enviar() {
  if (!data) {
    console.warn("❌ No hay datos cargados");
    return;
  }

  if (carrito.length === 0) {
    alert("Agregá productos primero");
    return;
  }

  let texto = "Hola, quiero pedir:%0A";

  carrito.forEach(i => {
    texto += `- ${i.n} ($${i.p})%0A`;
  });

  const url = `https://wa.me/${data.whatsapp}?text=${texto}`;

  console.log("📲 URL WhatsApp generada:", url);

  window.open(url, "_blank");
}

// 🔹 Exponer funciones al HTML
window.enviar = enviar;

// 🚀 INIT
cargar();