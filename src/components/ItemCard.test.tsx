import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ItemCard from './ItemCard';
import { ShopEntry } from '../pages/TiendaPage';
import { Country } from '../App';

// Mock the environment variable
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

const mockItem : ShopEntry = {
  regularPrice: 1000,
  finalPrice: 1000,
  itemDisplay: {
    name: "Test Item",
    vBucks: 1000,
    image: "test-image.jpg",
    rarity: "rare",
    backgroundColor: "#0000ff",
    type: "outfit",
    category: "featured"
  },
  outDate: new Date(Date.now() + 86400000).toISOString() // 24 hours from now
};

describe('ItemCard', () => {
  const mockRegularExchangeRate = 0.01955;
  const mockDiscountedExchangeRate = 0.015;

  test('shows buy button initially', () => {
    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    expect(screen.getByText('Comprar')).toBeInTheDocument();
  });

  test('shows WhatsApp button after clicking buy', () => {
    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    expect(screen.getByTitle('Contactar por WhatsApp')).toBeInTheDocument();
    expect(screen.getByTitle('Cerrar')).toBeInTheDocument();
  });

  test('opens WhatsApp with correct message when clicked', () => {
    // Mock window.open
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    });

    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const whatsappButton = screen.getByTitle('Contactar por WhatsApp');
    fireEvent.click(whatsappButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/wa\.me\/\d+\?text=.*$/),
      '_blank'
    );
  });

  test('closes WhatsApp buttons when close button is clicked', () => {
    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const closeButton = screen.getByTitle('Cerrar');
    fireEvent.click(closeButton);
    
    expect(screen.getByText('Comprar')).toBeInTheDocument();
    expect(screen.queryByTitle('Contactar por WhatsApp')).not.toBeInTheDocument();
  });

  test('opens WhatsApp with correct message format', () => {
    // Mock window.open
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    });

    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const whatsappButton = screen.getByTitle('Contactar por WhatsApp');
    fireEvent.click(whatsappButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/wa\.me\/\d+\?text=.*$/),
      '_blank'
    );
    
    // Check that the message contains the item name and price
    const callArgs = mockOpen.mock.calls[0][0];
    const decodedUrl = decodeURIComponent(callArgs);
    expect(decodedUrl).toContain('Test Item');
    expect(decodedUrl).toContain('15.00');
  });

  test('shows Fortnite friend request form after clicking Fortnite button', () => {
    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const fortniteButton = screen.getByTitle('Agregar en Fortnite');
    fireEvent.click(fortniteButton);
    
    expect(screen.getByText('🎮 Agregar en Fortnite')).toBeInTheDocument();
    expect(screen.getByText('DropCito0001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu username de Fortnite')).toBeInTheDocument();
    expect(screen.getByText('Enviar')).toBeInTheDocument();
  });

  test('submits friend request with correct data', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const fortniteButton = screen.getByTitle('Agregar en Fortnite');
    fireEvent.click(fortniteButton);
    
    const usernameInput = screen.getByPlaceholderText('Tu username de Fortnite');
    const submitButton = screen.getByText('Enviar');
    
    fireEvent.change(usernameInput, { target: { value: 'TestUser123' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    expect(global.fetch).toHaveBeenCalledWith('https://backend.com/addtofriends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'TestUser123',
        itemName: 'Test Item',
        itemPrice: '15.00'
      }),
    });
  });

  test('shows success message after successful submission', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const fortniteButton = screen.getByTitle('Agregar en Fortnite');
    fireEvent.click(fortniteButton);
    
    const usernameInput = screen.getByPlaceholderText('Tu username de Fortnite');
    const submitButton = screen.getByText('Enviar');
    
    fireEvent.change(usernameInput, { target: { value: 'TestUser123' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText('✅ ¡Solicitud enviada! Te agregaremos pronto.')).toBeInTheDocument();
    });
  });

  test('shows error message after failed submission', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as jest.Mock;

    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const fortniteButton = screen.getByTitle('Agregar en Fortnite');
    fireEvent.click(fortniteButton);
    
    const usernameInput = screen.getByPlaceholderText('Tu username de Fortnite');
    const submitButton = screen.getByText('Enviar');
    
    fireEvent.change(usernameInput, { target: { value: 'TestUser123' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('❌ Error al enviar. Intenta de nuevo.')).toBeInTheDocument();
    });
  });

  test('returns to WhatsApp buttons when back button is clicked', () => {
    render(<ItemCard item={mockItem} country="peru" regularExchangeRate={mockRegularExchangeRate} discountedExchangeRate={mockDiscountedExchangeRate} />);
    
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
    
    const fortniteButton = screen.getByTitle('Agregar en Fortnite');
    fireEvent.click(fortniteButton);
    
    const backButton = screen.getByText('← Volver');
    fireEvent.click(backButton);
    
    // Should return to the buy button state
    expect(screen.getByText('Comprar')).toBeInTheDocument();
    expect(screen.queryByText('🎮 Agregar en Fortnite')).not.toBeInTheDocument();
  });
});
