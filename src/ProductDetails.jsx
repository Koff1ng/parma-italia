import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, get } from "firebase/database";
import { useCart } from "./CartContext";
import "./productdetails.css";

export default function ProductDetails({ setOpenCart }) {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [openSection, setOpenSection] = useState(null);

  // ============================
  //  ZOOM FOLLOW TIPO ZARA
  // ============================
  const handleFollowZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    e.currentTarget.style.setProperty("--zoom-x", `${x}%`);
    e.currentTarget.style.setProperty("--zoom-y", `${y}%`);
  };

  // ============================
  //  CARGAR PRODUCTO
  // ============================
  useEffect(() => {
    const productRef = ref(db, "productosweb/" + id);

    get(productRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setProducto(data);

        if (data.imagenes) {
          setSelectedImg(Object.values(data.imagenes)[0]);
        } else {
          setSelectedImg(data.url_imagen);
        }
      }

      setLoading(false);
    });
  }, [id]);

  if (loading)
    return <p style={{ textAlign: "center", color: "#111" }}>Cargando...</p>;

  if (!producto)
    return (
      <p style={{ textAlign: "center", color: "#111" }}>
        Producto no encontrado
      </p>
    );

  // Soporte para arreglo desde Firebase
  const imagenes = producto.imagenes
    ? Object.values(producto.imagenes)
    : [producto.url_imagen];

  // ============================
  //  ANIMACIÓN ADD TO CART
  // ============================
  const animateAddToCart = () => {
    const btn = document.querySelector(".btn-add-cart");
    btn.classList.add("added");
    setTimeout(() => btn.classList.remove("added"), 600);
  };

  // ============================
  //  FLY TO CART
  // ============================
  const flyToCart = () => {
    const img = document.createElement("img");
    img.src = selectedImg;
    img.className = "fly-img";
    document.body.appendChild(img);

    const productImg = document.querySelector(".zoom-follow-img");
    const rect = productImg.getBoundingClientRect();

    img.style.left = rect.left + "px";
    img.style.top = rect.top + "px";

    const cartBtn = document.querySelector(".cart-icon");
    const cartRect = cartBtn.getBoundingClientRect();

    setTimeout(() => {
      img.style.transform = `translate(${cartRect.left - rect.left}px, ${
        cartRect.top - rect.top
      }px) scale(.2)`;
      img.style.opacity = "0";
    }, 20);

    setTimeout(() => img.remove(), 800);
  };

  const handleAdd = () => {
    animateAddToCart();
    flyToCart();

    addToCart({
      id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      url_imagen: selectedImg,
      size: selectedSize,
      qty: 1,
    });

    setTimeout(() => setOpenCart(true), 300);
  };

  const detalles = producto.detalles || {};

  const secciones = [
    {
      title: "DESCRIPCIÓN",
      text: detalles.descripcion || producto.descripcion || "Sin descripción.",
    },
    {
      title: "MATERIAL",
      text: detalles.material || "Material no especificado.",
    },
    {
      title: "CUIDADOS",
      text: detalles.cuidados || "Sin instrucciones de cuidado.",
    },
    {
      title: "ENVÍO Y PEDIDOS",
      text: "Envío nacional 2–5 días hábiles.",
    },
    {
      title: "CAMBIOS Y DEVOLUCIONES",
      text: "Aceptados en 30 días con etiqueta y empaque original.",
    },
  ];

  return (
    <div className="detail-container">

      {/* GALERÍA - ESTILO ZARA */}
      <div className="galeria">
        <div className="galeria-column">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={img}
              className={`thumb ${img === selectedImg ? "active-thumb" : ""}`}
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>

        {/* IMG PRINCIPAL CON ZOOM */}
        <div className="zoom-follow-wrapper" onMouseMove={handleFollowZoom}>
          <img src={selectedImg} className="zoom-follow-img" />
        </div>
      </div>

      {/* INFORMACIÓN */}
      <div className="info">
        <h1>{producto.nombre}</h1>

        <p className="precio">
          ${Number(producto.precio).toLocaleString("es-CO")} COP
        </p>

        {/* TALLAS */}
        <div className="sizes">
          <label>Talla:</label>
          <div className="size-options">
            {["XS", "S", "M", "L", "XL", "2XL"].map((talla) => (
              <span
                key={talla}
                className={`size-btn ${
                  selectedSize === talla ? "active" : ""
                }`}
                onClick={() => setSelectedSize(talla)}
              >
                {talla}
              </span>
            ))}
          </div>
        </div>

        <button className="btn-add-cart" onClick={handleAdd}>
          AÑADIR AL CARRITO
        </button>

        {/* ACORDEONES */}
        {secciones.map((sec, i) => (
          <div key={i} className="acordeon">
            <div
              className="acordeon-header"
              onClick={() => setOpenSection(openSection === i ? null : i)}
            >
              <span className="acc-title">{sec.title}</span>
              <span className="acc-icon">
                {openSection === i ? "−" : "+"}
              </span>
            </div>

            <div
              className={`acordeon-content ${
                openSection === i ? "open" : ""
              }`}
            >
              {sec.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
