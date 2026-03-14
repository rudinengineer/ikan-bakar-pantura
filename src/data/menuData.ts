import { MenuItem } from '../types';

export const menuData: MenuItem[] = [
// PAKET RAMADHAN KAREEM
{
  id: 'pkt-1',
  name: 'Mubarok 1 (5 Orang)',
  price: 219000,
  category: 'Paket Ramadhan Kareem',
  description:
  'Gurame Bakar, Kakap Bakar, Kerang Ijo, Ayam Lado Ijo, Capcay, Kentang Goreng, Tahu & Tempe, Es Cao Selasih (5), Nasi (5)'
},
{
  id: 'pkt-2',
  name: 'Mubarok 2 (10 Orang)',
  price: 419000,
  category: 'Paket Ramadhan Kareem',
  description:
  'Gurame Bakar, Kakap Bakar, Kerang Ijo, Ayam Lado Ijo, Lele Goreng, Cah Tauge, Cah Kangkung, Capcay, Udang Saus Padang, Cumi Saus Padang, Kentang Goreng, Tahu & Tempe Goreng, Nasi (10), Es Jeruk (5), Es Teh (5)'
},
{
  id: 'pkt-3',
  name: 'Gurame Mix Kerang',
  price: 69000,
  category: 'Paket Ramadhan Kareem',
  description: 'Gurame Saus Padang (1 porsi) + Kerang Ijo + Jagung'
},

// LELE
{ id: 'lele-1', name: 'Lele Goreng', price: 12000, category: 'Lele' },
{ id: 'lele-2', name: 'Lele Bakar Manis', price: 14000, category: 'Lele' },
{
  id: 'lele-3',
  name: 'Lele Bakar Pedas Manis',
  price: 14000,
  category: 'Lele'
},
{ id: 'lele-4', name: 'Lele Bakar Pantura', price: 14000, category: 'Lele' },
{ id: 'lele-5', name: 'Lele Saus Padang', price: 15000, category: 'Lele' },
{
  id: 'lele-6',
  name: 'Lele Saus Asam Pedas/Manis',
  price: 15000,
  category: 'Lele'
},

// AYAM (1/4 Ekor)
{
  id: 'ayam-1',
  name: 'Ayam Goreng 1/4 Ekor',
  price: 22000,
  category: 'Ayam'
},
{
  id: 'ayam-2',
  name: 'Ayam Bakar Manis 1/4 Ekor',
  price: 24000,
  category: 'Ayam'
},
{
  id: 'ayam-3',
  name: 'Ayam Bakar Pedas Manis 1/4 Ekor',
  price: 24000,
  category: 'Ayam'
},
{
  id: 'ayam-4',
  name: 'Ayam Bakar Pantura 1/4 Ekor',
  price: 24000,
  category: 'Ayam'
},
{
  id: 'ayam-5',
  name: 'Ayam Lado Ijo 1/4 Ekor',
  price: 25000,
  category: 'Ayam'
},

// BEBEK (1/4 Ekor)
{
  id: 'bebek-1',
  name: 'Bebek Goreng 1/4 Ekor',
  price: 25000,
  category: 'Bebek'
},
{
  id: 'bebek-2',
  name: 'Bebek Bakar Manis 1/4 Ekor',
  price: 27000,
  category: 'Bebek'
},
{
  id: 'bebek-3',
  name: 'Bebek Bakar Pedas Manis 1/4 Ekor',
  price: 27000,
  category: 'Bebek'
},
{
  id: 'bebek-4',
  name: 'Bebek Bakar Pantura 1/4 Ekor',
  price: 27000,
  category: 'Bebek'
},
{
  id: 'bebek-5',
  name: 'Bebek Lado Ijo 1/4 Ekor',
  price: 28000,
  category: 'Bebek'
},

// AYAM HANTARAN (1 Ekor)
{
  id: 'hantaran-1',
  name: 'Hantaran Goreng 1 Ekor',
  price: 38000,
  category: 'Ayam Hantaran'
},
{
  id: 'hantaran-2',
  name: 'Hantaran Bakar Manis 1 Ekor',
  price: 40000,
  category: 'Ayam Hantaran'
},
{
  id: 'hantaran-3',
  name: 'Hantaran Bakar Pedas Manis 1 Ekor',
  price: 40000,
  category: 'Ayam Hantaran'
},
{
  id: 'hantaran-4',
  name: 'Hantaran Bakar Pantura 1 Ekor',
  price: 40000,
  category: 'Ayam Hantaran'
},

// KERANG IJO
{
  id: 'kerang-1',
  name: 'Kerang Ijo Goreng',
  price: 22000,
  category: 'Kerang Ijo'
},
{
  id: 'kerang-2',
  name: 'Kerang Ijo Saus Padang',
  price: 25000,
  category: 'Kerang Ijo'
},
{
  id: 'kerang-3',
  name: 'Kerang Ijo Saus Asam Pedas/Manis',
  price: 25000,
  category: 'Kerang Ijo'
},

// UDANG TANPA TEPUNG
{
  id: 'udang-1',
  name: 'Udang Saus Padang',
  price: 30000,
  category: 'Udang Tanpa Tepung'
},
{
  id: 'udang-2',
  name: 'Udang Saus Asam Pedas/Manis',
  price: 30000,
  category: 'Udang Tanpa Tepung'
},

// UDANG TEPUNG
{
  id: 'udang-3',
  name: 'Udang Crispy',
  price: 33000,
  category: 'Udang Tepung'
},
{
  id: 'udang-4',
  name: 'Udang Crispy Saus Padang',
  price: 35000,
  category: 'Udang Tepung'
},
{
  id: 'udang-5',
  name: 'Udang Crispy Saus Asam Pedas/Manis',
  price: 35000,
  category: 'Udang Tepung'
},
{
  id: 'udang-6',
  name: 'Udang Crispy Telur Asin',
  price: 35000,
  category: 'Udang Tepung'
},

// CUMI TANPA TEPUNG
{
  id: 'cumi-1',
  name: 'Cumi Saus Padang',
  price: 30000,
  category: 'Cumi Tanpa Tepung'
},
{
  id: 'cumi-2',
  name: 'Cumi Saus Asam Pedas/Manis',
  price: 30000,
  category: 'Cumi Tanpa Tepung'
},

// CUMI TEPUNG
{ id: 'cumi-3', name: 'Cumi Crispy', price: 33000, category: 'Cumi Tepung' },
{
  id: 'cumi-4',
  name: 'Cumi Crispy Saus Padang',
  price: 35000,
  category: 'Cumi Tepung'
},
{
  id: 'cumi-5',
  name: 'Cumi Crispy Saus Asam Pedas/Manis',
  price: 35000,
  category: 'Cumi Tepung'
},
{
  id: 'cumi-6',
  name: 'Cumi Crispy Telur Asin',
  price: 35000,
  category: 'Cumi Tepung'
},

// GURAME
{
  id: 'gurame-1',
  name: 'Gurame Bakar Manis',
  price: 42000,
  category: 'Gurame'
},
{
  id: 'gurame-2',
  name: 'Gurame Bakar Pedas Manis',
  price: 42000,
  category: 'Gurame'
},
{
  id: 'gurame-3',
  name: 'Gurame Bakar Pantura',
  price: 42000,
  category: 'Gurame'
},
{
  id: 'gurame-4',
  name: 'Gurame Saus Padang',
  price: 46000,
  category: 'Gurame'
},
{
  id: 'gurame-5',
  name: 'Gurame Saus Asam Pedas/Manis',
  price: 46000,
  category: 'Gurame'
},

// KERAPU
{
  id: 'kerapu-1',
  name: 'Kerapu Bakar Manis',
  price: 50000,
  priceMax: 60000,
  category: 'Kerapu'
},
{
  id: 'kerapu-2',
  name: 'Kerapu Bakar Pedas Manis',
  price: 50000,
  priceMax: 60000,
  category: 'Kerapu'
},
{
  id: 'kerapu-3',
  name: 'Kerapu Bakar Pantura',
  price: 50000,
  priceMax: 60000,
  category: 'Kerapu'
},
{
  id: 'kerapu-4',
  name: 'Kerapu Saus Padang',
  price: 55000,
  priceMax: 65000,
  category: 'Kerapu'
},
{
  id: 'kerapu-5',
  name: 'Kerapu Saus Asam Pedas/Manis',
  price: 55000,
  priceMax: 65000,
  category: 'Kerapu'
},

// KAKAP PUTIH
{
  id: 'kakap-p-1',
  name: 'Kakap Putih Bakar Manis',
  price: 50000,
  priceMax: 60000,
  category: 'Kakap Putih'
},
{
  id: 'kakap-p-2',
  name: 'Kakap Putih Bakar Pedas Manis',
  price: 50000,
  priceMax: 60000,
  category: 'Kakap Putih'
},
{
  id: 'kakap-p-3',
  name: 'Kakap Putih Bakar Pantura',
  price: 50000,
  priceMax: 60000,
  category: 'Kakap Putih'
},
{
  id: 'kakap-p-4',
  name: 'Kakap Putih Saus Padang',
  price: 55000,
  priceMax: 65000,
  category: 'Kakap Putih'
},
{
  id: 'kakap-p-5',
  name: 'Kakap Putih Saus Asam Pedas/Manis',
  price: 55000,
  priceMax: 65000,
  category: 'Kakap Putih'
},

// KAKAP MERAH
{
  id: 'kakap-m-1',
  name: 'Kakap Merah Bakar Manis',
  price: 55000,
  priceMax: 60000,
  category: 'Kakap Merah'
},
{
  id: 'kakap-m-2',
  name: 'Kakap Merah Bakar Pedas Manis',
  price: 55000,
  priceMax: 60000,
  category: 'Kakap Merah'
},
{
  id: 'kakap-m-3',
  name: 'Kakap Merah Bakar Pantura',
  price: 55000,
  priceMax: 60000,
  category: 'Kakap Merah'
},
{
  id: 'kakap-m-4',
  name: 'Kakap Merah Saus Padang',
  price: 65000,
  priceMax: 75000,
  category: 'Kakap Merah'
},
{
  id: 'kakap-m-5',
  name: 'Kakap Merah Saus Asam Pedas/Manis',
  price: 65000,
  priceMax: 75000,
  category: 'Kakap Merah'
},

// TUMISAN
{ id: 'tumis-1', name: 'Cah Tauge', price: 12000, category: 'Tumisan' },
{ id: 'tumis-2', name: 'Cah Kangkung', price: 13000, category: 'Tumisan' },
{
  id: 'tumis-3',
  name: 'Kangkung Belacan',
  price: 15000,
  category: 'Tumisan'
},
{ id: 'tumis-4', name: 'Capcay Goreng', price: 18000, category: 'Tumisan' },
{ id: 'tumis-5', name: 'Capcay Kuah', price: 18000, category: 'Tumisan' },

// MINUMAN
{ id: 'minum-1', name: 'Es Teh / Panas', price: 4000, category: 'Minuman' },
{ id: 'minum-2', name: 'Air Mineral', price: 4000, category: 'Minuman' },
{ id: 'minum-3', name: 'Kopi', price: 5000, category: 'Minuman' },
{ id: 'minum-4', name: 'Es Cao Selasih', price: 6000, category: 'Minuman' },
{ id: 'minum-5', name: 'Es Jeruk / Panas', price: 6000, category: 'Minuman' },
{ id: 'minum-6', name: 'Es Milo / Panas', price: 6000, category: 'Minuman' },

// LAIN-LAIN
{ id: 'lain-1', name: 'Sambel Terasi', price: 4000, category: 'Lain-lain' },
{ id: 'lain-2', name: 'Sambel Kecap', price: 4000, category: 'Lain-lain' },
{ id: 'lain-3', name: 'Nasi', price: 5000, category: 'Lain-lain' },
{ id: 'lain-4', name: 'Tahu Goreng', price: 7000, category: 'Lain-lain' },
{ id: 'lain-5', name: 'Tempe Goreng', price: 8000, category: 'Lain-lain' },
{ id: 'lain-6', name: 'Kentang Goreng', price: 12000, category: 'Lain-lain' },
{ id: 'lain-7', name: 'Kerupuk Rambak', price: 12000, category: 'Lain-lain' },
{
  id: 'lain-8',
  name: 'Tahu Crispy Original',
  price: 12000,
  category: 'Lain-lain'
},
{
  id: 'lain-9',
  name: 'Jamur Crispy Original',
  price: 12000,
  category: 'Lain-lain'
},
{
  id: 'lain-10',
  name: 'Tahu Crispy Telur Asin',
  price: 15000,
  category: 'Lain-lain'
},
{
  id: 'lain-11',
  name: 'Jamur Crispy Telur Asin',
  price: 15000,
  category: 'Lain-lain'
}];


export const categories = Array.from(
  new Set(menuData.map((item) => item.category))
);