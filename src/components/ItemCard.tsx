import React, { useEffect, useState, useMemo, memo } from "react";
import { ShopEntry } from "../pages/TiendaPage";
import { Country } from "../App";

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

// WhatsApp configuration
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "51999999999";

interface Props {
  item: ShopEntry;
  onBuy?: (item: ShopEntry) => void;
  country: Country;
  regularExchangeRate: number;
  discountedExchangeRate: number;
}

const ItemCard: React.FC<Props> = ({ item, onBuy, country, regularExchangeRate, discountedExchangeRate }) => {
  const display = item.itemDisplay;
  const [timeLeft, setTimeLeft] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Memoize prices calculation
  const prices = useMemo(() => {
    const regular = display.vBucks * regularExchangeRate;
    const discounted = display.vBucks * discountedExchangeRate;
    
    return {
      regular,
      discounted,
      currency: country === 'argentina' ? 'ARS' as const : 'PEN' as const
    };
  }, [country, display.vBucks, regularExchangeRate, discountedExchangeRate]);

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
    // Use longer interval for better performance - update every 5 seconds instead of every second
    const timer = setInterval(updateCountdown, 5000);
    return () => clearInterval(timer);
  }, [item.outDate]);

  // Memoize style calculations
  const { estilo, fixedColor, backgroundColor } = useMemo(() => {
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

    const bgColor = display.backgroundColor ||
      display.backgroundColor2 ||
      display.color ||
      display.color2 ||
      display.color3 ||
      "transparent";
    
    const fixedColor = withAlpha(bgColor, 0.3);

    return { estilo, fixedColor, backgroundColor: bgColor };
  }, [display.rarity, display.backgroundColor, display.backgroundColor2, display.color, display.color2, display.color3]);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWhatsApp(true);
    onBuy?.(item);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currencySymbol = country === 'argentina' ? '$' : 'S/';
    const currencyCode = country === 'argentina' ? 'ARS' : 'PEN';
    const message = `Hola! Me interesa comprar: ${display.name} - ${currencySymbol} ${prices.discounted.toFixed(2)} ${currencyCode}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCloseWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWhatsApp(false);
  };

  return (
    <div className={`item-card ${estilo} responsive-card`}>
      <img
        style={{
          background: `linear-gradient(to bottom, ${fixedColor}, ${backgroundColor})`,
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
          { (
            <p className="pen-price-regular responsive-pen-regular">{country === 'argentina' ? '$' : 'S/'} {prices.regular.toFixed(2)}</p>
          )}
          <p className="pen-price-discounted responsive-pen-discounted">
            {country === 'argentina' ? '$' : 'S/'} {prices.discounted.toFixed(2)}
          </p>
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
        ) : (
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
        )}
      </div>
    </div>
  );
};

// Custom comparison function for memo to prevent unnecessary re-renders
const areEqual = (prevProps: Props, nextProps: Props) => {
  return (
    prevProps.item.offerId === nextProps.item.offerId &&
    prevProps.item.outDate === nextProps.item.outDate &&
    prevProps.item.itemDisplay.vBucks === nextProps.item.itemDisplay.vBucks &&
    prevProps.country === nextProps.country &&
    prevProps.regularExchangeRate === nextProps.regularExchangeRate &&
    prevProps.discountedExchangeRate === nextProps.discountedExchangeRate
  );
};

export default memo(ItemCard, areEqual);
