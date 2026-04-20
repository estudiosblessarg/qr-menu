import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Elementos DOM
const nombre = document.getElementById("nombre");
const whatsapp = document.getElementById("whatsapp");
const catInput = document.getElementById("cat");
const prodInput = document.getElementById("prod");
const precioInput = document.getElementById("precio");
const lista = document.getElementById("lista");
const qr = document.getElementById("qr");
const link = document.getElementById("link");

// 🔹 Estado
let menu = {
  nombre: "",
  whatsapp: "",
  categorias: []
};

// 🔹 Agregar producto
window.agregar = function () {
  const cat = catInput.value.trim();
  const prod = prodInput.value.trim();
  const precio = precioInput.value.trim();

  if (!cat || !prod || !precio) {
    alert("Completá categoría, producto y precio");
    return;
  }

  let categoria = menu.categorias.find(c => c.nombre === cat);

  if (!categoria) {
    categoria = { nombre: cat, items: [] };
    menu.categorias.push(categoria);
  }

  categoria.items.push({ nombre: prod, precio });

  render();

  // limpiar inputs
  prodInput.value = "";
  precioInput.value = "";
};

// 🔹 Render lista
function render() {
  lista.innerHTML = "";

  menu.categorias.forEach(c => {
    c.items.forEach(i => {
      const li = document.createElement("li");
      li.innerText = `${c.nombre} - ${i.nombre} ($${i.precio})`;
      lista.appendChild(li);
    });
  });
}

// 🔹 Guardar y generar QR
window.guardar = async function () {
  try {
    console.log("Guardando menú...");

    menu.nombre = nombre.value.trim();
    menu.whatsapp = whatsapp.value.trim();

    if (!menu.nombre || !menu.whatsapp || menu.categorias.length === 0) {
      alert("Completá todos los datos");
      return;
    }

    // 🔥 Guardar en Firebase
    const docRef = await addDoc(collection(db, "menus"), menu);

    console.log("Guardado con ID:", docRef.id);

    // 🔗 Generar URL
    const url = `${window.location.origin}/menu.html#id=${docRef.id}`;

    link.innerText = url;

    // 🧼 Limpiar QR anterior
    qr.innerHTML = "";

    // 🎯 Crear canvas
    const canvas = document.createElement("canvas");

    // 🔳 Generar QR
    QRCode.toCanvas(canvas, url, { width: 250 }, function (error) {
      if (error) {
        console.error("Error QR:", error);
        alert("Error generando QR");
        return;
      }

      qr.appendChild(canvas);
    });

  } catch (e) {
    console.error("ERROR FIREBASE:", e);
    alert("Error al guardar en Firebase. Revisá configuración.");
  }
};

