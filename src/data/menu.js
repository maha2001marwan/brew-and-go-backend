'use strict';

const coffeeMenu = [
  {
    id: '1', name: 'Espresso Noir', category: 'Hot',
    price: 3.50, rating: 4.8, featured: true,
    description: 'A rich, concentrated shot of our finest dark-roast beans, delivering an intense and complex flavour profile with notes of dark chocolate and toasted oak.',
    imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600',
  },
  {
    id: '2', name: 'Caramel Latte', category: 'Hot',
    price: 5.25, rating: 4.7, featured: true,
    description: 'Velvety steamed milk poured over a double shot of espresso, finished with a generous swirl of homemade salted caramel sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600',
  },
  {
    id: '3', name: 'Flat White', category: 'Hot',
    price: 4.75, rating: 4.6, featured: false,
    description: 'A bold double ristretto shot paired with a precise measure of micro-foamed whole milk, creating a velvety, intensely coffee-forward experience.',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600',
  },
  {
    id: '4', name: 'Mocha Bliss', category: 'Hot',
    price: 5.50, rating: 4.9, featured: true,
    description: 'The perfect union of espresso and premium Belgian dark chocolate, topped with lightly whipped cream and a dusting of bittersweet cocoa powder.',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600',
  },
  {
    id: '5', name: 'Cold Brew Supreme', category: 'Cold',
    price: 5.75, rating: 4.9, featured: true,
    description: 'Steeped for 24 hours in cold filtered water, our cold brew delivers a silky smooth, never-bitter coffee experience with a long, refreshing finish.',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
  },
  {
    id: '6', name: 'Iced Caramel Macchiato', category: 'Cold',
    price: 5.95, rating: 4.8, featured: false,
    description: 'Chilled vanilla-infused milk layered over ice and a double ristretto, finished with a graceful lattice drizzle of premium buttery caramel sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=600',
  },
  {
    id: '7', name: 'Frappuccino Velvet', category: 'Cold',
    price: 6.25, rating: 4.7, featured: false,
    description: 'A blended frozen coffee crafted with double-strength cold brew, whole milk, and dark chocolate, crowned with rosette whipped cream.',
    imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=600',
  },
  {
    id: '8', name: 'Matcha Cloud Latte', category: 'Cold',
    price: 5.50, rating: 4.5, featured: false,
    description: 'Premium ceremonial-grade matcha whisked to perfection and gently layered over cold oat-milk cloud foam, creating a stunning earthy-green gradient.',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600',
  },
  {
    id: '9', name: 'Butter Croissant', category: 'Bakery',
    price: 3.95, rating: 4.8, featured: true,
    description: 'Freshly baked each morning, our classic French croissant boasts 81 laminated layers of pure European butter dough with a perfectly caramelised golden crust.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600',
  },
  {
    id: '10', name: 'Blueberry Muffin', category: 'Bakery',
    price: 3.50, rating: 4.6, featured: false,
    description: 'A generously-sized muffin bursting with plump wild blueberries, finished with a golden oat crumble and a bright hint of Meyer lemon zest.',
    imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600',
  },
  {
    id: '11', name: 'Cinnamon Scroll', category: 'Bakery',
    price: 4.25, rating: 4.7, featured: false,
    description: 'A pillowy-soft brioche dough rolled with Ceylon cinnamon, dark muscovado sugar, and toasted pecans, finished with a thick vanilla bean cream-cheese glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600',
  },
  {
    id: '12', name: 'Chocolate Brownie', category: 'Bakery',
    price: 3.75, rating: 4.9, featured: true,
    description: 'Fudge-dense and intensely chocolatey, baked with 70% Valrhona couverture, toasted walnuts, and finished with Maldon sea-salt flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
  },
];

module.exports = coffeeMenu;
