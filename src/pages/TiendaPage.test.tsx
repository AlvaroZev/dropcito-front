import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import TiendaPage from './TiendaPage';

// Mock fetch for shop data
const mockShopData = {
  status: 200,
  data: {
    hash: "test-hash",
    date: "2024-01-01",
    vbuckIcon: "test-icon",
    entries: [
      {
        regularPrice: 1000,
        finalPrice: 1000,
        devName: "Test Item",
        offerId: "test-offer",
        inDate: "2024-01-01",
        outDate: "2024-01-02",
        giftable: false,
        refundable: false,
        sortPriority: 1,
        layoutId: "test-layout",
        layout: {
          id: "test-layout",
          name: "Featured",
          index: 1,
          rank: 1,
          showIneligibleOffers: "false",
          useWidePreview: false,
          displayType: "test"
        },
        tileSize: "normal",
        displayAssetPath: "test-path",
        newDisplayAssetPath: "test-new-path",
        newDisplayAsset: {
          id: "test-asset",
          renderImages: [
            {
              productTag: "test-tag",
              fileName: "test.jpg",
              image: "https://test-image.jpg"
            }
          ]
        },
        brItems: [
          {
            id: "test-item",
            name: "Test Item",
            description: "Test description",
            type: {
              value: "outfit",
              displayValue: "Outfit",
              backendValue: "outfit"
            },
            rarity: {
              value: "rare",
              displayValue: "Rare",
              backendValue: "rare"
            },
            series: null,
            images: {
              smallIcon: "test-small.jpg",
              icon: "test-icon.jpg"
            },
            added: "2024-01-01"
          }
        ]
      }
    ]
  }
};

describe('TiendaPage', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockShopData),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Fortnite accounts prompt', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    // Wait for the component to load
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    // Check for Fortnite accounts prompt
    expect(screen.getByText('🎮 Agrega nuestros cuentas en Fortnite')).toBeInTheDocument();
    expect(screen.getByText('¡Juega con nosotros y obtén mejores precios!')).toBeInTheDocument();
  });

  test('displays first 3 accounts by default', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    // Check that first 3 accounts are displayed
    expect(screen.getByText('DropCito0001')).toBeInTheDocument();
    expect(screen.getByText('DropCito0002')).toBeInTheDocument();
    expect(screen.getByText('DropCito0003')).toBeInTheDocument();
    
    // Check that 4th account is not displayed initially
    expect(screen.queryByText('DropCito0004')).not.toBeInTheDocument();
  });

  test('shows "Mostrar más" button when there are more than 3 accounts', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    expect(screen.getByText('Mostrar 7 más')).toBeInTheDocument();
  });

  test('shows all accounts when "Mostrar más" is clicked', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const showMoreButton = screen.getByText('Mostrar 7 más');
    fireEvent.click(showMoreButton);
    
    // Check that all accounts are now displayed
    expect(screen.getByText('DropCito0001')).toBeInTheDocument();
    expect(screen.getByText('DropCito0002')).toBeInTheDocument();
    expect(screen.getByText('DropCito0003')).toBeInTheDocument();
    expect(screen.getByText('DropCito0004')).toBeInTheDocument();
    expect(screen.getByText('DropCito0005')).toBeInTheDocument();
    expect(screen.getByText('DropCito0006')).toBeInTheDocument();
    expect(screen.getByText('DropCito0007')).toBeInTheDocument();
    expect(screen.getByText('DropCito0008')).toBeInTheDocument();
    expect(screen.getByText('DropCito0009')).toBeInTheDocument();
    expect(screen.getByText('DropCito0010')).toBeInTheDocument();
    
    // Button should now say "Mostrar menos"
    expect(screen.getByText('Mostrar menos')).toBeInTheDocument();
  });

  test('hides accounts when "Mostrar menos" is clicked', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const showMoreButton = screen.getByText('Mostrar 7 más');
    fireEvent.click(showMoreButton);
    
    const showLessButton = screen.getByText('Mostrar menos');
    fireEvent.click(showLessButton);
    
    // Check that only first 3 accounts are displayed again
    expect(screen.getByText('DropCito0001')).toBeInTheDocument();
    expect(screen.getByText('DropCito0002')).toBeInTheDocument();
    expect(screen.getByText('DropCito0003')).toBeInTheDocument();
    expect(screen.queryByText('DropCito0004')).not.toBeInTheDocument();
    
    // Button should say "Mostrar más" again
    expect(screen.getByText('Mostrar 7 más')).toBeInTheDocument();
  });

  test('displays account numbers correctly', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    // Check that account numbers are displayed
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
  });

  test('generates correct account names', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const showMoreButton = screen.getByText('Mostrar 7 más');
    fireEvent.click(showMoreButton);
    
    // Check that all account names follow the correct pattern
    for (let i = 1; i <= 10; i++) {
      const accountName = `DropCito${i.toString().padStart(4, '0')}`;
      expect(screen.getByText(accountName)).toBeInTheDocument();
    }
  });

  test('shows username form when account is clicked', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const firstAccount = screen.getByText('DropCito0001').closest('.account-item');
    fireEvent.click(firstAccount!);
    
    expect(screen.getByText('🎮 Agregar en Fortnite')).toBeInTheDocument();
    expect(screen.getByText('Comparte tu username para que te agreguemos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu username de Fortnite')).toBeInTheDocument();
    expect(screen.getByText('Enviar')).toBeInTheDocument();
  });

  test('submits username form with correct data', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const firstAccount = screen.getByText('DropCito0001').closest('.account-item');
    fireEvent.click(firstAccount!);
    
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
        itemName: 'Fortnite Account Addition',
        itemPrice: '0.00'
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

    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const firstAccount = screen.getByText('DropCito0001').closest('.account-item');
    fireEvent.click(firstAccount!);
    
    const usernameInput = screen.getByPlaceholderText('Tu username de Fortnite');
    const submitButton = screen.getByText('Enviar');
    
    fireEvent.change(usernameInput, { target: { value: 'TestUser123' } });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('✅ ¡Solicitud enviada! Te agregaremos pronto.')).toBeInTheDocument();
    });
  });

  test('returns to accounts list when back button is clicked', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    const firstAccount = screen.getByText('DropCito0001').closest('.account-item');
    fireEvent.click(firstAccount!);
    
    const backButton = screen.getByText('← Volver a las cuentas');
    fireEvent.click(backButton);
    
    // Should return to the accounts list
    expect(screen.getByText('🎮 Agrega nuestros cuentas en Fortnite')).toBeInTheDocument();
    expect(screen.getByText('DropCito0001')).toBeInTheDocument();
    expect(screen.queryByText('Comparte tu username para que te agreguemos')).not.toBeInTheDocument();
  });

  test('displays click hints on account items', async () => {
    render(<TiendaPage selectedCountry="peru" />);
    
    await screen.findByText('🛍️ Tienda de Fortnite');
    
    // Check that click hints are displayed
    const clickHints = screen.getAllByText('👆');
    expect(clickHints.length).toBeGreaterThan(0);
  });
});
