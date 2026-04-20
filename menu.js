import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 DOM
const nombre = document.getElementById("nombre");
const menuDiv = document.getElementById("menu");

// 🔹 Obtener ID desde URL
const params = new URLSearchParams(location.search);
const id = params.get("id");

console.log("🔍 ID recibido:", id);

let data = null;
let carrito = [];

// =============================
// 🔥 CARGAR MENÚ
// =============================
async function cargar() {
  try {
    if (!id) {
      console.warn("❌ No hay ID en la URL");
      nombre.innerText = "Menú no encontrado";
      return;
    }

    console.log("📡 Buscando en Firestore...");

    const ref = doc(db, "menus", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("❌ Documento no existe");
      nombre.innerText = "Menú inexistente";
      return;
    }

    data = snap.data();
    console.log("✅ DATA:", data);

    // 🔹 Validaciones críticas
    if (!data.nombre || !data.categorias) {
      console.error("❌ Estructura inválida:", data);
      nombre.innerText = "Error en datos del menú";
      return;
    }

    nombre.innerText = data.nombre;
    menuDiv.innerHTML = ""; // limpiar por si recarga

    // 🔹 Render
    data.categorias.forEach((cat, i) => {
      if (!cat.items) {
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
  console.log("🛒 Carrito:", carrito);
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
  console.log("📲 URL WhatsApp:", url);

  window.open(url, "_blank");
}

// 🔹 Exponer al HTML
window.enviar = enviar;

// 🚀 INIT
cargar();