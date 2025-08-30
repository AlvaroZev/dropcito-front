import React, { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";

// --- Types ---
export type RawEntry = {
  status: number;
  data: {
    hash: string;
    date: string;
    vbuckIcon: string;
    entries: {
      regularPrice: number;
      finalPrice: number;
      devName: string;
      offerId: string;
      inDate: string;
      outDate: string;
      giftable: boolean;
      refundable: boolean;
      sortPriority: number;
      layoutId: string;
      layout: {
        id: string;
        name: string;
        category?: string;
        index: number;
        rank: number;
        showIneligibleOffers: string;
        background?: string;
        useWidePreview: boolean;
        displayType: string;
      };
      colors?: {
        color1: string;
        color2: string;
        color3: string;
        textBackgroundColor: string;
      };
      tileSize: string;
      displayAssetPath: string;
      newDisplayAssetPath: string;
      newDisplayAsset?: {
        id: string;
        cosmeticId?: string;
        renderImages: {
          productTag: string;
          fileName: string;
          image: string;
        }[];
      };
      brItems?: {
        id: string;
        name: string;
        description: string;
        type: {
          value: string;
          displayValue: string;
          backendValue: string;
        };
        rarity: {
          value: string;
          displayValue: string;
          backendValue: string;
        };
        series: {
          value: string;
          image: string;
          colors: string[];
          backendValue: string;
        } | null;
        images: {
          smallIcon: string;
          icon: string;
          featured?: string | null;
        };
        added: string;
        shopHistory?: string[];
      }[];
      bundle?: {
        name: string;
        info: string;
        image: string;
      };
    }[];
  };
};

export interface ShopEntry {
  regularPrice: number;
  finalPrice: number;
  offerId?: string;
  outDate: string;
  itemDisplay: {
    name: string;
    type: string;
    image: string;
    vBucks: number;
    rarity: string;
    category: string;
    color?: string;
    color2?: string;
    color3?: string;
    backgroundColor?: string;
    backgroundColor2?: string;
  };
}

// Fortnite accounts configuration
const generateFortniteAccounts = (): string[] => {
  const accounts: string[] = [];
  for (let i = 1; i <= 10; i++) {
    accounts.push(`DropCito${i.toString().padStart(4, '0')}`);
  }
  return accounts;
};

const FortniteAccountsPrompt: React.FC = () => {
  const [accounts] = useState<string[]>(generateFortniteAccounts());
  const [showAll, setShowAll] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const displayedAccounts = showAll ? accounts : accounts.slice(0, 3);

  const handleAccountClick = (accountName: string) => {
    setShowUsernameForm(true);
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          itemName: "Fortnite Account Addition",
          itemPrice: "0.00"
        }),
      });
      
      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          setShowUsernameForm(false);
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

  const handleCloseForm = () => {
    setShowUsernameForm(false);
    setUsername("");
    setSubmitStatus("idle");
  };

  if (showUsernameForm) {
    return (
      <div className="fortnite-accounts-prompt">
        <div className="accounts-header">
          <h2>🎮 Agregar en Fortnite</h2>
          <p>Comparte tu username para que te agreguemos</p>
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
          onClick={handleCloseForm}
          title="Volver"
        >
          ← Volver a las cuentas
        </button>
      </div>
    );
  }

  return (
    <div className="fortnite-accounts-prompt">
      <div className="accounts-header">
        <h2>🎮 Agrega nuestros cuentas en Fortnite</h2>
        <p>¡Juega con nosotros y obtén mejores precios!</p>
      </div>
      
      <div className="accounts-list">
        {displayedAccounts.map((account, index) => (
          <div 
            key={account} 
            className="account-item"
            onClick={() => handleAccountClick(account)}
            title={`Haz clic para agregar ${account}`}
          >
            <span className="account-number">#{index + 1}</span>
            <span className="account-name">{account}</span>
            <span className="account-click-hint">👆</span>
          </div>
        ))}
      </div>
      
      {accounts.length > 3 && (
        <button 
          className="show-more-button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Mostrar menos' : `Mostrar ${accounts.length - 3} más`}
        </button>
      )}
    </div>
  );
};

const TiendaPage: React.FC = () => {
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, ShopEntry[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const res = await fetch("https://fortnite-api.com/v2/shop?language=es-419");
      const json: RawEntry = await res.json();
      const entries = json.data?.entries || [];

      const categoryMap: Record<string, ShopEntry[]> = {};

      entries.forEach((entry) => {
        const layout = entry.layout || { name: "Otros" };
        const category = layout.name || "Otros";

        const item = entry.brItems?.[0];

        if (!item) return;

        const name = entry.bundle?.name || item.name || entry.devName || "Sin nombre";
        const image = entry.newDisplayAsset?.renderImages?.[0]?.image || 
                     entry.bundle?.image || 
                     item.images?.icon || "";
        const rarity = item.rarity?.displayValue || item.rarity?.value || "Común";
        const type = entry.bundle?.info || 
                    item.type?.displayValue || 
                    item.type?.value || 
                    entry.layout?.name || 
                    "Desconocido";

        const color = entry.colors?.color1 ? `#${entry.colors.color1}` : "";
        const color2 = entry.colors?.color2 ? `#${entry.colors.color2}` : "";
        const color3 = entry.colors?.color3 ? `#${entry.colors.color3}` : "";
        const backgroundColor = entry.colors?.textBackgroundColor ? `#${entry.colors.textBackgroundColor}` : "";
        const backgroundColor2 = entry.colors?.color2 ? `#${entry.colors.color2}` : "";

        const displayItem: ShopEntry = {
          regularPrice: entry.regularPrice ?? 0,
          finalPrice: entry.finalPrice ?? 0,
          offerId: entry.offerId ?? "unknown-offer",
          outDate: entry.outDate ?? "",
          itemDisplay: {
            name,
            type,
            image,
            vBucks: entry.finalPrice ?? 0,
            rarity,
            category,
            color,
            color2,
            color3,
            backgroundColor,
            backgroundColor2,
          },
        };

        if (!categoryMap[category]) categoryMap[category] = [];
        categoryMap[category].push(displayItem);
      });

      setItemsByCategory(categoryMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shop data:", error);
      setLoading(false);
    }
  };

  const handleBuy = (item: ShopEntry) => {
    // TODO: Implement buy functionality, already implemented in ItemCard.tsx
  };

  return (
    <div className="tienda-page">
      <div className="page-content">
        <div className="tienda-container">
          <h1 className="tienda-title">🛍️ Tienda de Fortnite</h1>
          
          {/* Fortnite Accounts Prompt */}
          <FortniteAccountsPrompt />
          
          <input
            type="text"
            placeholder="🔍 Buscar objeto..."
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />

          {loading ? (
            <p className="loading-text">Cargando tienda...</p>
          ) : (
            <div className="categories-container">
              {Object.entries(itemsByCategory).map(([category, items]) => {
                const filtered = items.filter((item) =>
                  item.itemDisplay.name.toLowerCase().includes(searchTerm)
                );
                if (!filtered.length) return null;

                return (
                  <div key={category} className="category-section">
                    <h3 className="category-title">{category}</h3>
                    <div className="items-grid">
                      {filtered.map((item, idx) => (
                        <ItemCard key={idx} item={item} onBuy={handleBuy} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TiendaPage;
