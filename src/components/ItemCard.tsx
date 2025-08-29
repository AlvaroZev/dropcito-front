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

interface Props {
  item: ShopEntry;
  onBuy?: (item: ShopEntry) => void;
}

const ItemCard: React.FC<Props> = ({ item, onBuy }) => {
  const display = item.itemDisplay;
  const [timeLeft, setTimeLeft] = useState("");

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
    onBuy?.(item);
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
        <button 
          className="buy-button responsive-buy-button"
          onClick={handleBuyClick}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
