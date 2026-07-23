import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatters";
import Loader from "../../components/common/Loader";
import "./ProductDetailPage.css";

export default function ProductDetailPage({ setOpenCart }) {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [openSection, setOpenSection] = useState(0);

  useEffect(() => {
    let isMounted = true;
    productService.getProductById(id).then((data) => {
      if (!isMounted) return;
      setProduct(data);

      if (data) {
        const imgs = data.imagenes
          ? (Array.isArray(data.imagenes) ? data.imagenes : Object.values(data.imagenes))
          : [data.url_imagen];
        
        setSelectedImg(imgs[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80");

        const available = ["XS", "S", "M", "L", "XL", "2XL"].filter((t) => {
          const tieneTalla = data.tallas?.[t] || false;
          const stockDispon = Number(data.stock?.[t]) || 0;
          return tieneTalla && stockDispon > 0;
        });

        if (available.length > 0) setSelectedSize(available[0]);
      }
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="container not-found-wrapper">
        <h2>Prenda no encontrada en El Vault.</h2>
      </div>
    );
  }

  const imagenes = product.imagenes
    ? (Array.isArray(product.imagenes) ? product.imagenes : Object.values(product.imagenes))
    : [product.url_imagen];

  const stockDisponible = selectedSize ? (Number(product.stock?.[selectedSize]) || 10) : 10;
  const puedeAgregar = selectedSize && stockDisponible > 0;

  const handleAdd = () => {
    if (!puedeAgregar) return;

    addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: Number(product.precio),
      url_imagen: selectedImg,
      size: selectedSize,
      qty: 1,
    });

    setOpenCart(true);
  };

  const detalles = product.detalles || {};

  const secciones = [
    {
      title: "DESCRIPCIÓN Y DETALLES",
      text: detalles.descripcion || "Edición exclusiva de archivo con confección artesanal de alta costura y etiquetas de la casa de moda.",
    },
    {
      title: "COMPOSICIÓN Y MATERIALES",
      text: detalles.material || "100% Algodón Peinado Francés (500 GSM).",
    },
    {
      title: "CUIDADOS Y MANTENIMIENTO",
      text: detalles.cuidados || "Lavar en seco o con agua fría al revés, no usar blanqueador, secar a la sombra.",
    },
    {
      title: "ENVÍOS Y TIEMPOS DE ENTREGA",
      text: "Despacho asegurado a todo el país. Entrega estimada en 2 a 4 días hábiles vía Servientrega / Interrapidísimo.",
    },
  ];

  return (
    <div className="product-detail-container container">
      {/* GALLERY COLUMN */}
      <div className="detail-gallery">
        <div className="thumbnails-col">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.nombre} thumbnail ${i}`}
              className={`thumb-img ${img === selectedImg ? "active" : ""}`}
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>

        <div className="main-image-box">
          <div className="badge-red quality-tag">DROP EXCLUSIVO</div>
          <img src={selectedImg} alt={product.nombre} className="main-product-img" />
        </div>
      </div>

      {/* INFO COLUMN */}
      <div className="detail-info-col">
        <span className="detail-category">{product.categoria || "COLECCIÓN EXCLUSIVA"}</span>
        <h1 className="detail-title">{product.nombre}</h1>

        <div className="detail-price-box">
          <span className="detail-price">{formatCurrency(product.precio)}</span>
          <span className="tax-notice">IMPUESTOS INCLUIDOS • ENVÍO NACIONAL ASEGURADO</span>
        </div>

        {/* SIZES */}
        <div className="detail-sizes-box">
          <div className="size-label-row">
            <label>SELECCIONAR TALLA:</label>
            <span className="size-guide-link">Guía de tallas</span>
          </div>

          <div className="sizes-flex">
            {["XS", "S", "M", "L", "XL", "2XL"].map((talla) => {
              const tieneTalla = product.tallas?.[talla] ?? true;
              const isSelected = selectedSize === talla;

              return (
                <button
                  key={talla}
                  className={`size-pick-btn ${isSelected ? "selected" : ""} ${!tieneTalla ? "disabled" : ""}`}
                  onClick={() => tieneTalla && setSelectedSize(talla)}
                  disabled={!tieneTalla}
                >
                  {talla}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className={`btn-red add-to-vault-btn ${!puedeAgregar ? "disabled" : ""}`}
          onClick={handleAdd}
          disabled={!puedeAgregar}
        >
          {puedeAgregar ? "AÑADIR A LA BOLSA" : "AGOTADO EN ESTA TALLA"}
        </button>

        {/* ACCORDION SECTIONS */}
        <div className="accordions-wrapper">
          {secciones.map((sec, i) => (
            <div key={i} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() => setOpenSection(openSection === i ? null : i)}
              >
                <span>{sec.title}</span>
                <span className="acc-icon">{openSection === i ? "−" : "+"}</span>
              </div>
              {openSection === i && (
                <div className="accordion-body">
                  <p>{sec.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
