export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string;
  is_active: boolean;
  requires_server_id: boolean;
  server_id_hint: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  game_id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  nominal: string;
  bonus: string | null;
  is_promo: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  game?: Game;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  logo_url: string | null;
  fee: number;
  is_active: boolean;
  sort_order: number;
}

export interface Transaction {
  id: string;
  invoice_id: string;
  game_id: string | null;
  product_id: string | null;
  user_id: string | null;
  server_id: string | null;
  username: string | null;
  price: number;
  fee: number;
  total: number;
  payment_method: string | null;
  status: string;
  payment_status: string;
  qr_code: string | null;
  payment_url: string | null;
  paid_at: string | null;
  expired_at: string | null;
  created_at: string;
  game?: Game;
  product?: Product;
}

export interface Promo {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  discount_percent: number | null;
  game_id: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  created_at: string;
}

export interface CartItem {
  game: Game;
  product: Product;
  userId: string;
  serverId?: string;
  username?: string;
  paymentMethod: PaymentMethod;
}
