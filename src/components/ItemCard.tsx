import React, { useEffect, useState } from "react";
import { ShopEntry } from "../pages/TiendaPage";

// 🎨 Estilos según rareza
const estilosPorRareza: Record<string, string> = {
  legendary: "shadow-[inset_0_0_150px_-50px_orange] border-orange-400",
  epic: "shadow-[inset_0_0_150px_-50px_purple] border-purple-500",
  rare: "shadow-[inset_0_0_150px_-50px_blue] border-blue-400",
  uncommon: "shadow-[inset_0_0_150px_-50px_limegreen] border-lime-400",
  common: "shadow-[inset_0_0_150px_-50px_gray] border-gray-400",
  marvel: "shadow-[inset_0_0_150px_-50px_red] border-red-500",
  dc: "shadow-[inset_0_0_150px_-50px_darkblue] border-blue-600",
  starwars: "shadow-[inset_0_0_150px_-50px_white] border-gray-300",
  idol: "shadow-[inset_0_0_150px_-50px_gold] border-yellow-400",
  gaminglegends: "shadow-[inset_0_0_150px_-50px_indigo] border-indigo-500",
  creatorcollab: "shadow-[inset_0_0_150px_-50px_gold] border-yellow-400",
};

// 💰 Conversion rates for easy modification
const PAVOS_TO_PEN_RATE = 0.01955;
const PAVOS_TO_PEN_DISCOUNTED_RATE = 0.015;

// WhatsApp configuration
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "51999999999";

// Fortnite configuration
const FORTNITE_USERNAME = "DropCito0001";

interface Props {
  item: ShopEntry;
  onBuy?: (item: ShopEntry) => void;
}

const ItemCard: React.FC<Props> = ({ item, onBuy }) => {
  const display = item.itemDisplay;
  const [timeLeft, setTimeLeft] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showFriendRequest, setShowFriendRequest] = useState(false);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Calculate PEN prices
  const penPrice = display.vBucks * PAVOS_TO_PEN_RATE;
  const penDiscountedPrice = display.vBucks * PAVOS_TO_PEN_DISCOUNTED_RATE;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date(); // now is UTC
      const expirationDate = new Date(item.outDate); // expirationDate is UTC
      
      if (isNaN(expirationDate.getTime())) {
        setTimeLeft("Fecha no disponible");
        return;
      }

      
      const diff = expirationDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("Expirado");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [item.outDate]);

  const rareza = display.rarity?.toLowerCase() || "common";
  const estilo = estilosPorRareza[rareza] || "border-slate-700";

  function withAlpha(color: string, alpha: number) {
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    if (color.startsWith("rgb")) {
      return color.replace(/rgba?\(([^)]+)\)/, (_, values) => {
        const [r, g, b] = values.split(",").map((v: string) => v.trim());
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      });
    }

    return `rgba(135, 135, 135, ${alpha})`;
  }

  const fixedColor = withAlpha(
    display.backgroundColor ||
      display.backgroundColor2 ||
      display.color ||
      display.color2 ||
      display.color3 ||
      "transparent",
    0.3
  );

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWhatsApp(true);
    onBuy?.(item);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hola! Me interesa comprar: ${display.name} - S/ ${penDiscountedPrice.toFixed(2)} PEN`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFriendRequestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFriendRequest(true);
  };

  const handleCloseWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWhatsApp(false);
    setShowFriendRequest(false);
    setUsername("");
    setSubmitStatus("idle");
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!username.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const response = await fetch('https://backend.com/addtofriends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          itemName: display.name,
          itemPrice: penDiscountedPrice.toFixed(2)
        }),
      });
      
      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          setShowFriendRequest(false);
          setUsername("");
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error('Error submitting friend request:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`item-card ${estilo} responsive-card`}>
      <img
        style={{
          background: `linear-gradient(to bottom, ${fixedColor}, ${
            display.backgroundColor ||
            display.backgroundColor2 ||
            display.color ||
            display.color2 ||
            display.color3 ||
            "transparent"
          })`,
        }}
        src={display.image}
        alt={display.name}
        className="item-image responsive-image"
        loading="lazy"
      />

      <div className="item-content responsive-content">
        <h2 className="item-name responsive-name" title={display.name}>
          {display.name}
        </h2>

        <div className="item-price responsive-price">
          <img
            src="https://static.wikia.nocookie.net/fortnite/images/e/eb/V-Bucks_-_Icon_-_Fortnite.png"
            alt="V-Bucks"
            className="vbucks-icon responsive-vbucks-icon"
          />
          <p className="price-text responsive-price-text">{display.vBucks} PAVOS</p>
        </div>

        <div className="pen-prices responsive-pen-prices">
          <p className="pen-price-regular responsive-pen-regular">S/ {penPrice.toFixed(2)}</p>
          <p className="pen-price-discounted responsive-pen-discounted">S/ {penDiscountedPrice.toFixed(2)}</p>
        </div>

        <p className="time-left responsive-time">
          ⏳ Disponible por: {timeLeft}
        </p>
      </div>

      {/* Buy Now Overlay */}
      <div className="buy-overlay responsive-overlay">
        {!showWhatsApp ? (
          <button 
            className="buy-button responsive-buy-button"
            onClick={handleBuyClick}
          >
            Comprar
          </button>
        ) : !showFriendRequest ? (
          <div className="whatsapp-buttons-container">
            <button 
              className="whatsapp-button"
              onClick={handleWhatsAppClick}
              title="Contactar por WhatsApp"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="whatsapp-icon"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </button>
            <button 
              className="fortnite-button"
              onClick={handleFriendRequestClick}
              title="Agregar en Fortnite"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="fortnite-icon"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
            <button 
              className="close-button"
              onClick={handleCloseWhatsApp}
              title="Cerrar"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="close-icon"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="friend-request-container">
            <div className="friend-request-header">
              <h3>🎮 Agregar en Fortnite</h3>
              <p>Agrega <strong>{FORTNITE_USERNAME}</strong> y comparte tu username</p>
            </div>
            <form onSubmit={handleUsernameSubmit} className="friend-request-form">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu username de Fortnite"
                className="username-input"
                disabled={isSubmitting}
                required
              />
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting || !username.trim()}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </form>
            {submitStatus === "success" && (
              <div className="success-message">
                ✅ ¡Solicitud enviada! Te agregaremos pronto.
              </div>
            )}
            {submitStatus === "error" && (
              <div className="error-message">
                ❌ Error al enviar. Intenta de nuevo.
              </div>
            )}
            <button 
              className="back-button"
              onClick={handleCloseWhatsApp}
              title="Volver"
            >
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
