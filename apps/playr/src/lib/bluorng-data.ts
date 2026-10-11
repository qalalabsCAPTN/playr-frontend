// playR catalog — pulled from the playR Shopify store (full image galleries)
const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';
const img = (f: string) => `${CDN}/${f}`;

/**
 * Shopify Image Resizer helper:
 * Appends width parameters (?width=N or &width=N) to Shopify CDN URLs,
 * serving optimal image payloads according to device screens.
 */
export function imgUrl(url: string, width: number = 640): string {
  if (!url) return '';
  if (!url.includes('cdn.shopify.com')) return url;
  if (/([?&])width=\d+/.test(url)) {
    return url.replace(/([?&])width=\d+/, `$1width=${width}`);
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}`;
}

export interface BluorngProduct {
  handle: string;
  title: string;
  price: number;
  compareAt: number | null;
  type: string;
  collections: string[];
  images: string[];
  description: string;
  details: string[];
  colors?: string[];
  sizes?: string[];
  customizable?: boolean;
  soldOut?: boolean;
  /** True when no real product photo could be sourced yet — renders a "Photo coming soon" placeholder. */
  placeholder?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export const products: BluorngProduct[] = [
  {
    handle: 'playr-mesh-cap-red',
    title: 'playR Mesh Cap — Red',
    price: 351, compareAt: 449,
    type: 'Caps',
    collections: ['new-in', 'caps'],
    images: [
      img('Artboard6.png?v=1782909214'),
      img('Artboard4_39939875-15a4-4069-8511-66e8074423bc.png?v=1782909214'),
    ],
    description: 'A breathable, lightweight cap built for everyday sport and street wear. Structured mesh back panel for ventilation, curved brim, and an adjustable snap closure for a secure fit.',
    details: ['Structured mesh back panel', 'Curved brim', 'Adjustable snap closure', 'Lightweight everyday fit'],
    colors: ['Red', 'Maroon', 'India Blue', 'Dark Grey', 'Bottle Green'],
  },
  {
    handle: 'playr-mesh-cap-maroon',
    title: 'playR Mesh Cap — Maroon',
    price: 351, compareAt: 449,
    type: 'Caps',
    collections: ['new-in', 'caps'],
    images: [
      img('Artboard9_9614b917-5015-49f8-a2ce-501529807c76.png?v=1782909278'),
      img('Artboard11_cf26877a-9245-45d5-a01d-b05468930bf3.png?v=1782909278'),
    ],
    description: 'A breathable, lightweight cap built for everyday sport and street wear. Structured mesh back panel for ventilation, curved brim, and an adjustable snap closure for a secure fit.',
    details: ['Structured mesh back panel', 'Curved brim', 'Adjustable snap closure', 'Lightweight everyday fit'],
    colors: ['Red', 'Maroon', 'India Blue', 'Dark Grey', 'Bottle Green'],
  },
  {
    handle: 'playr-mesh-cap-india-blue',
    title: 'playR Mesh Cap — India Blue',
    price: 351, compareAt: 449,
    type: 'Caps',
    collections: ['new-in', 'caps'],
    images: [
      img('Artboard18.png?v=1782909337'),
      img('Artboard19.png?v=1782909337'),
      img('Artboard20.png?v=1782909337'),
    ],
    description: 'A breathable, lightweight cap built for everyday sport and street wear. Structured mesh back panel for ventilation, curved brim, and an adjustable snap closure for a secure fit.',
    details: ['Structured mesh back panel', 'Curved brim', 'Adjustable snap closure', 'Lightweight everyday fit'],
    colors: ['Red', 'Maroon', 'India Blue', 'Dark Grey', 'Bottle Green'],
  },
  {
    handle: 'playr-mesh-cap-dark-grey',
    title: 'playR Mesh Cap — Dark Grey',
    price: 351, compareAt: 449,
    type: 'Caps',
    collections: ['new-in', 'caps'],
    images: [
      img('Artboard25.png?v=1782909396'),
      img('Artboard23.png?v=1782909396'),
    ],
    description: 'A breathable, lightweight cap built for everyday sport and street wear. Structured mesh back panel for ventilation, curved brim, and an adjustable snap closure for a secure fit.',
    details: ['Structured mesh back panel', 'Curved brim', 'Adjustable snap closure', 'Lightweight everyday fit'],
    colors: ['Red', 'Maroon', 'India Blue', 'Dark Grey', 'Bottle Green'],
  },
  {
    handle: 'playr-mesh-cap-bottle-green',
    title: 'playR Mesh Cap — Bottle Green',
    price: 351, compareAt: 449,
    type: 'Caps',
    collections: ['new-in', 'caps'],
    images: [
      img('Artboard33.png?v=1782909509'),
      img('Artboard34.png?v=1782909510'),
      img('Artboard32.png?v=1782909509'),
    ],
    description: 'A breathable, lightweight cap built for everyday sport and street wear. Structured mesh back panel for ventilation, curved brim, and an adjustable snap closure for a secure fit.',
    details: ['Structured mesh back panel', 'Curved brim', 'Adjustable snap closure', 'Lightweight everyday fit'],
    colors: ['Red', 'Maroon', 'India Blue', 'Dark Grey', 'Bottle Green'],
  },
  {
    handle: 'seattle-orcas-match-hat',
    title: 'Seattle Orcas Match Hat',
    price: 749, compareAt: null,
    type: 'Headwear',
    collections: ['new-in', 'caps', 'seattle-orcas'],
    images: [
      img('Artboard11.png?v=1782821929'),
      img('Artboard10.png?v=1782821931'),
      img('Artboard8.png?v=1782821929'),
      img('Artboard9.png?v=1782821928'),
    ],
    description: 'playR x Seattle Orcas — the official Match Hat for MLC 2026. Classic headwear for fans who follow the team through every match, built for game-day comfort.',
    details: ['Official MLC 2026 merchandise', 'playR x Seattle Orcas', 'Breathable panel construction', 'One size fits most'],
  },
  {
    handle: 'seattle-orcas-bucket-hat',
    title: 'Seattle Orcas Bucket Hat',
    price: 899, compareAt: null,
    type: 'Headwear',
    collections: ['caps', 'seattle-orcas'],
    soldOut: true,
    images: [
      img('Artboard2.png?v=1782822163'),
      img('Artboard4.png?v=1782822163'),
      img('Artboard3.png?v=1782822163'),
      img('Artboard5.png?v=1782822165'),
    ],
    description: 'playR x Seattle Orcas — the official Cotton Poly Bucket Hat for MLC 2026 fans who like their game-day style laid-back. Lightweight cotton-poly blend.',
    details: ['Official MLC 2026 merchandise', 'Cotton-poly blend', 'Laid-back bucket silhouette', 'Lightweight all-day wear'],
  },
  {
    handle: 'seattle-orcas-match-cap',
    title: 'Seattle Orcas Match Cap',
    price: 749, compareAt: null,
    type: 'Caps',
    collections: ['new-in', 'caps', 'seattle-orcas'],
    images: [
      img('Artboard21_b101aa12-8cca-47c9-a790-72e33032fde9.jpg?v=1782822668'),
      img('Artboard22_d2484fcb-4e97-49b5-ae85-f399feb9c6a4.jpg?v=1782822668'),
      img('Artboard23_89687ff9-4055-4c01-8943-e6d2158fc9ce.jpg?v=1782822668'),
      img('Artboard24_27b32581-d3ee-427c-b63b-64c54c8f6416.jpg?v=1782822668'),
    ],
    description: 'playR x Seattle Orcas — the official Match Cap for MLC 2026. The go-to headwear for fans who back the Orcas on every matchday.',
    details: ['Official MLC 2026 merchandise', 'playR x Seattle Orcas', 'Structured crown', 'Adjustable closure'],
  },
  {
    handle: 'goggles-performance-neon-orange',
    title: 'Performance Goggles — Neon Orange',
    price: 1199, compareAt: null,
    type: 'Goggles',
    collections: ['new-in', 'swimming', 'goggles'],
    images: [
      img('Artboard89_8f487e33-daf7-4e86-99aa-6f9c1d9a1a91.jpg?v=1782800550'),
      img('Artboard91_2fbb8724-4f76-4d86-b3bc-0082abd00869.jpg?v=1782800549'),
      img('Artboard90_d44e3438-5184-43ea-839f-1c85f294c060.jpg?v=1782800549'),
      img('Artboard95.jpg?v=1782800549'),
      img('Artboard92.jpg?v=1782800550'),
    ],
    description: 'Mirrored electroplated lenses reduce glare in outdoor and indoor pools. UV protection, anti-fog coating, and a silicone seal built for serious training.',
    details: ['Electroplated mirrored lenses', 'UV protection + anti-fog', 'Silicone seal & strap', 'Polycarbonate lens'],
  },
  {
    handle: 'goggles-professional-blue-green',
    title: 'Professional Goggles — Blue Green',
    price: 1399, compareAt: null,
    type: 'Goggles',
    collections: ['new-in', 'swimming', 'goggles'],
    images: [
      img('Artboard123.jpg?v=1782800842'),
      img('Artboard121.jpg?v=1782800842'),
      img('Artboard122.jpg?v=1782800843'),
      img('Artboard127.jpg?v=1782800842'),
      img('Artboard124.jpg?v=1782800842'),
    ],
    description: 'Precision-crafted for elite-level swimmers. Razor-sharp electroplated optics, UV protection and anti-fog performance for race day.',
    details: ['Professional race fit', 'Electroplated optics', 'UV protection + anti-fog', 'Low-profile silicone seal'],
  },
  {
    handle: 'goggles-mask-performance-black',
    title: 'Goggles Mask Performance — Black',
    price: 1499, compareAt: null,
    type: 'Goggles',
    collections: ['new-in', 'swimming', 'goggles'],
    images: [
      img('Artboard16_03eda70c-9b22-4931-9a0a-eba347e4f10f.jpg?v=1782801235'),
      img('Artboard15_c64152f7-c774-415a-84d8-6401d3111334.jpg?v=1782801235'),
      img('Artboard14_9992b023-65bb-4bd2-9a5a-546b519e2dfc.jpg?v=1782801236'),
      img('Artboard12_143b3a24-67ae-40e8-a033-20979aca4fc9.jpg?v=1782801235'),
      img('Artboard9_f85e919f-8276-4d6c-a196-1bca5e98c73c.jpg?v=1782801235'),
    ],
    description: 'A wide-angle mask format with high-performance electroplated lenses. Panoramic vision with a soft full-seal fit.',
    details: ['Wide-angle mask format', 'Electroplated lenses', 'UV protection + anti-fog', 'Soft full-seal silicone skirt'],
  },
  {
    handle: 'kids-goggles-mask-blue-grey',
    title: 'Kids Goggles Mask — Blue Grey',
    price: 899, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles', 'kids'],
    images: [
      img('Artboard25_89bd15ed-4458-4d75-9e4c-bcb4223b8cb2.jpg?v=1782802430'),
      img('Artboard27_b1987f83-50e6-4a93-8595-66dfa1f0fa3d.jpg?v=1782802430'),
      img('Artboard26_0a53861f-ae2b-4420-9be7-8d26f19b8f13.jpg?v=1782802430'),
      img('Artboard31_594c6332-1270-4b70-a43e-0d4e10c61b72.jpg?v=1782802430'),
      img('Artboard29_92b29380-9aac-46bb-8699-599844694c5f.jpg?v=1782802430'),
    ],
    description: 'A wide panoramic view with a full-face-style mask fit. Bigger, gentler seal designed for young swimmers.',
    details: ['Kids mask fit', 'Panoramic view', 'UV protection + anti-fog', 'Gentle silicone seal'],
  },
  {
    handle: 'kids-goggles-mask-green-blue',
    title: 'Kids Goggles Mask — Green Blue',
    price: 899, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles', 'kids'],
    images: [
      img('Artboard1_24ae1d17-4885-4d0b-ba56-b231d64f41a3.jpg?v=1782803627'),
      img('Artboard2_24cb1dbe-afe2-4619-841d-1273830e41da.jpg?v=1782803627'),
      img('Artboard3_18150458-7055-44a7-8ab6-47c8f1abe8a0.jpg?v=1782803627'),
      img('Artboard7_f8b668bf-6b5c-4bf8-b55f-9d864899895d.jpg?v=1782803628'),
      img('Artboard4_074ceb9b-562e-4afa-87e0-68599d54b015.jpg?v=1782803627'),
    ],
    description: 'A wide panoramic view with a full-face-style mask fit. Bigger, gentler seal designed for young swimmers.',
    details: ['Kids mask fit', 'Panoramic view', 'UV protection + anti-fog', 'Gentle silicone seal'],
  },
  {
    handle: 'kids-goggles-essentials-lt-grey',
    title: 'Kids Goggles Essentials — Lt. Grey',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles', 'kids'],
    images: [
      img('Artboard48.jpg?v=1782803967'),
      img('Artboard47.jpg?v=1782803967'),
      img('Artboard46.jpg?v=1782803967'),
      img('Artboard42_a1c8b216-15f1-4245-96b8-9b1b9cc435bb.jpg?v=1782803967'),
      img('Artboard43.jpg?v=1782803967'),
    ],
    description: 'UV-protected polycarbonate lenses with anti-fog coating. Great vision in the pool for young swimmers.',
    details: ['Kids essentials fit', 'UV-protected polycarbonate lens', 'Anti-fog coating', 'Adjustable split strap'],
  },
  {
    handle: 'kids-goggles-essentials-green-blue',
    title: 'Kids Goggles Essentials — Green Blue',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles', 'kids'],
    images: [
      img('Artboard105.jpg?v=1782804081'),
      img('Artboard106.jpg?v=1782804080'),
      img('Artboard107.jpg?v=1782804080'),
      img('Artboard111.jpg?v=1782804080'),
      img('Artboard108.jpg?v=1782804081'),
    ],
    description: 'UV-protected polycarbonate lenses with anti-fog coating. Great vision in the pool for young swimmers.',
    details: ['Kids essentials fit', 'UV-protected polycarbonate lens', 'Anti-fog coating', 'Adjustable split strap'],
  },
  {
    handle: 'goggles-essentials-pink-blue',
    title: 'Essentials Goggles — Pink Blue',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles'],
    images: [
      img('Artboard49.jpg?v=1782804158'),
      img('Artboard50_9cd8cba0-e89c-43d8-892a-357fa8b8c6cc.jpg?v=1782804158'),
      img('Artboard51_a41c9076-1672-4011-8f55-37e859c32f69.jpg?v=1782804158'),
      img('Artboard52_1eab4e3d-b272-4286-b58f-3b3f3043dc51.jpg?v=1782804158'),
      img('Artboard53_0653d87d-83f6-407c-8d66-eb93c5a84466.jpg?v=1782804158'),
    ],
    description: 'See clearly from end to end. Polycarbonate lens and silicone seal for comfortable daily laps.',
    details: ['Polycarbonate lens', 'Silicone seal', 'UV protection + anti-fog', 'Everyday training fit'],
  },
  {
    handle: 'goggles-essentials-light-blue',
    title: 'Essentials Goggles — Light Blue',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles'],
    images: [
      img('Artboard73.jpg?v=1782804247'),
      img('Artboard74.jpg?v=1782804247'),
      img('Artboard75.jpg?v=1782804247'),
      img('Artboard76.jpg?v=1782804247'),
      img('Artboard77.jpg?v=1782804247'),
      img('Artboard78.jpg?v=1782804247'),
    ],
    description: 'See clearly from end to end. Polycarbonate lens and silicone seal for comfortable daily laps.',
    details: ['Polycarbonate lens', 'Silicone seal', 'UV protection + anti-fog', 'Everyday training fit'],
  },
  {
    handle: 'goggles-essentials-silver-grey',
    title: 'Essentials Goggles — Silver Grey',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'goggles'],
    images: [
      img('Artboard66.jpg?v=1782804414'),
      img('Artboard65.jpg?v=1782804413'),
      img('Artboard67.jpg?v=1782804413'),
      img('Artboard68.jpg?v=1782804413'),
    ],
    description: 'See clearly from end to end. Polycarbonate lens and silicone seal for comfortable daily laps.',
    details: ['Polycarbonate lens', 'Silicone seal', 'UV protection + anti-fog', 'Everyday training fit'],
  },
  {
    handle: 'swim-cap-professional-orange-silver',
    title: 'Pro Swim Cap — Orange Silver',
    price: 699, compareAt: null,
    type: 'Swim Caps',
    collections: ['swimming', 'swim-caps'],
    images: [
      img('Artboard34_fb0e1c14-dd91-4f0b-bc00-3a691e06b311.jpg?v=1782804718'),
      img('Artboard27_ef241a9c-8c84-4e3a-b96f-648dc4573564.jpg?v=1782804717'),
      img('Artboard26_244c8fe9-020d-4faf-9784-b32836f6fc70.jpg?v=1782804717'),
      img('Artboard28_a913ef2b-3035-4961-ace0-19c1f3cd0350.jpg?v=1782804717'),
      img('Artboard29_dd401b22-7893-4c4a-8e8c-b881f79c6671.jpg?v=1782804718'),
    ],
    description: 'Premium dual-colour silicone cap combining bold design with professional performance. Chlorine-resistant and hydrodynamic.',
    details: ['Professional two-tone design', 'Chlorine-resistant silicone', 'Hydrodynamic fit', 'Tear-resistant'],
  },
  {
    handle: 'swim-cap-performance-pink',
    title: 'Performance Swim Cap — Pink',
    price: 449, compareAt: null,
    type: 'Swim Caps',
    collections: ['swimming', 'swim-caps'],
    images: [
      img('Artboard84.jpg?v=1782804802'),
      img('Artboard80_ddc2d980-c03e-4265-91e8-806b7dbc6730.jpg?v=1782804802'),
      img('Artboard81_8cf598af-42df-424f-84cb-65062a64f8e1.jpg?v=1782804802'),
      img('Artboard82.jpg?v=1782804802'),
      img('Artboard83.jpg?v=1782804802'),
    ],
    description: 'Train harder and swim faster. Crafted from premium, chlorine-resistant silicone with a snug, comfortable fit.',
    details: ['Premium silicone', 'Chlorine-resistant', 'Snug performance fit', 'Easy on, easy off'],
  },
  {
    handle: 'swim-cap-performance-blue',
    title: 'Performance Swim Cap — Blue',
    price: 449, compareAt: null,
    type: 'Swim Caps',
    collections: ['swimming', 'swim-caps'],
    images: [
      img('Artboard70_d6aad7a7-417a-4445-b627-1233e2e12ea0.jpg?v=1782804870'),
      img('Artboard65_4e4bf254-cdb1-4d89-891d-f419283befae.jpg?v=1782804870'),
      img('Artboard66_aec4d1fd-1274-4317-a29f-9c6ecdf093dd.jpg?v=1782804871'),
      img('Artboard67_b27a12ba-2d5f-4c70-8c0e-c2c400ddbc06.jpg?v=1782804871'),
      img('Artboard68_6cfac204-7600-4795-91bb-ac357406d5eb.jpg?v=1782804870'),
    ],
    description: 'Train harder and swim faster. Crafted from premium, chlorine-resistant silicone with a snug, comfortable fit.',
    details: ['Premium silicone', 'Chlorine-resistant', 'Snug performance fit', 'Easy on, easy off'],
  },
  {
    handle: 'swim-cap-performance-silver',
    title: 'Performance Swim Cap — Silver',
    price: 449, compareAt: null,
    type: 'Swim Caps',
    collections: ['swimming', 'swim-caps'],
    images: [
      img('Artboard71_59c2f25d-d0fb-449d-8d17-1c786c448946.jpg?v=1782804943'),
      img('Artboard76_b3bb16c0-751d-4140-9168-0892b520ecbb.jpg?v=1782804943'),
      img('Artboard72_01c90221-b5a7-4146-93fb-3c651d6277ac.jpg?v=1782804943'),
      img('Artboard73_b4ec1e6a-0879-4eca-a5ac-fbfb7c419d15.jpg?v=1782804943'),
      img('Artboard74_0811c817-df89-4d73-83fa-d2c8c2758f88.jpg?v=1782804943'),
    ],
    description: 'Train harder and swim faster. Crafted from premium, chlorine-resistant silicone with a snug, comfortable fit.',
    details: ['Premium silicone', 'Chlorine-resistant', 'Snug performance fit', 'Easy on, easy off'],
  },
  {
    handle: 'kids-swim-cap-fish-pink',
    title: 'Kids Swim Cap Fish — Pink',
    price: 599, compareAt: null,
    type: 'Swim Caps',
    collections: ['swimming', 'swim-caps', 'kids'],
    images: [
      img('Artboard49_85d4ec8a-59d1-4266-b38e-1513de7fe695.jpg?v=1782804993'),
      img('Artboard45_b36d20d5-3a19-4ac1-b097-37d4fed2c8e7.jpg?v=1782804993'),
      img('Artboard43_abfc626d-a016-4daa-b144-3b103a917d8e.jpg?v=1782804994'),
      img('Artboard44_4908f492-ed31-40c4-9ff1-1b7f21b9895f.jpg?v=1782804993'),
      img('Artboard46_2633c117-14e8-4560-8cb5-732fbfc6ff3e.jpg?v=1782804993'),
    ],
    description: 'Dive into fun with a playful fish motif. Soft, stretch-silicone made for young swimmers.',
    details: ['Playful fish motif', 'Soft stretch silicone', 'Kids fit', 'Chlorine-resistant'],
  },
  {
    handle: 'kids-swim-cap-wave-pink',
    title: 'Kids Swim Cap Wave — Pink',
    price: 499, compareAt: null,
    type: 'Swim Caps',
    collections: ['swimming', 'swim-caps', 'kids'],
    images: [
      img('Artboard24.jpg?v=1782803191'),
      img('Artboard22.jpg?v=1782803191'),
      img('Artboard20.jpg?v=1782803192'),
      img('Artboard21.jpg?v=1782803191'),
      img('Artboard23.jpg?v=1782803191'),
    ],
    description: 'Make swim sessions fun. Designed for young swimmers with soft silicone comfort.',
    details: ['Wave graphic', 'Soft stretch silicone', 'Kids fit', 'Chlorine-resistant'],
  },
];

export const collections: Record<string, { title: string; description: string }> = {
  // Category - Apparels
  'new-in': { title: 'Latest Drop', description: 'The newest performance sportswear and gear from playR.' },
  'all-products': { title: 'All Products', description: 'Explore the complete playR collection.' },
  apparel: { title: 'Apparel', description: 'High-performance sportswear crafted for movement, durability, and style.' },
  bottomwear: { title: 'Bottomwear', description: 'Performance shorts, track pants, tights, and training bottoms.' },
  topwear: { title: 'Topwear', description: 'Breathable tees, polos, jerseys, and jackets built for movement.' },
  suit: { title: 'Suit & Tracksuits', description: 'Official playR athletic suits and tracksuits.' },
  innerwear: { title: 'Innerwear & Base Layers', description: 'Comfortable base layers, skin pants, skin shorts, and athletic innerwear.' },
  
  // Apparel Subcategories
  't-shirt-tee': { title: 'T-Shirts & Tees', description: 'Round neck athletic t-shirts and graphic tees.' },
  't-shirt-polo': { title: 'Polo T-Shirts', description: 'Classic collar performance polo t-shirts.' },
  jersey: { title: 'Match & Fan Jerseys', description: 'Official team jerseys and training matchwear.' },
  hoodie: { title: 'Hoodies & Sweatshirts', description: 'Warm, breathable hoodies for athletic workouts and casual wear.' },
  jacket: { title: 'Jackets & Windbreakers', description: 'Windproof, water-resistant athletic and track jackets.' },
  singlet: { title: 'Singlets & Tanks', description: 'Breathable sleeveless singlets for gym, running, and track.' },
  jogger: { title: 'Joggers', description: 'Tapered athletic joggers with stretch comfort.' },
  shorts: { title: 'Performance Shorts', description: 'Lightweight performance shorts with moisture management.' },
  pants: { title: 'Track Pants', description: 'Ergonomic track pants for daily training and sports.' },
  'track-set': { title: 'Track Sets', description: 'Full athletic track sets matching jacket and trousers.' },
  'skin-pants': { title: 'Skin Pants', description: 'Compression base layer skin pants.' },
  'skin-shorts': { title: 'Skin Shorts', description: 'Compression athletic skin shorts.' },
  'skin-singlet': { title: 'Skin Singlets', description: 'Compression sleeveless base layer tops.' },
  'skin-tee': { title: 'Skin Tees', description: 'Compression short-sleeve athletic base layer tops.' },

  // Category - Equipment
  equipment: { title: 'Equipment', description: 'Professional sporting equipment, bats, balls, protective gear, and training accessories.' },
  paddle: { title: 'Paddle & Pickleball', description: 'Professional pickleball paddles, balls, and court gear.' },
  'paddle-raquet': { title: 'Pickleball Paddles', description: 'Carbon fiber and fiberglass pickleball paddles with honeycomb cores.' },
  'carbon-fiber': { title: 'Carbon Fiber Paddles', description: 'Professional T700/T300 carbon fiber pickleball paddles.' },
  'glass-fiber': { title: 'Glass Fiber Paddles', description: 'High-control fiberglass pickleball paddles.' },
  band: { title: 'Bands & Resistance', description: 'Fitness resistance bands and athletic wristbands.' },
  resistance: { title: 'Resistance Bands', description: 'Heavy muscle and loop resistance bands for strength training.' },
  bag: { title: 'Bags & Duffels', description: 'Durable sports bags, duffels, and gear backpacks.' },
  kitbag: { title: 'Kit Bags', description: 'Spacious cricket and sports equipment kit bags.' },
  ball: { title: 'Balls & Equipment', description: 'Match balls, training balls, and equipment.' },
  'leather-ball': { title: 'Leather Balls', description: 'Hand-stitched leather cricket match balls.' },
  'tennis-ball': { title: 'Tennis Balls', description: 'Durable high-bounce tennis balls for training and cricket.' },
  bat: { title: 'Bats & Gear', description: 'Premium cricket bats and batting accessories.' },
  'english-willow': { title: 'English Willow Bats', description: 'Grade-A English willow cricket bats for professional matches.' },
  'kashmir-willow': { title: 'Kashmir Willow Bats', description: 'Durable Kashmir willow cricket bats for tournament play.' },
  'popular-willow': { title: 'Popular Willow Bats', description: 'High-power willow bats designed for club and recreational cricket.' },
  gloves: { title: 'Gloves', description: 'Batting, fielding, and sports gloves for max grip.' },
  guard: { title: 'Guards & Protection', description: 'Protective guards and pads engineered for safety.' },
  'yoga-mat': { title: 'Yoga Mats', description: 'Non-slip fitness and yoga mats for daily training.' },
  mat: { title: 'Mats', description: 'High-density exercise and yoga mats.' },
  eyewear: { title: 'Eyewear & Goggles', description: 'UV-protected, anti-fog goggles and sports eyewear.' },
  goggles: { title: 'Swimming Goggles', description: 'UV-protected, anti-fog goggles for every swimmer.' },
  'swimming-goggles': { title: 'Swimming Goggles', description: 'UV-protected, anti-fog goggles for every swimmer.' },
  'swimming-caps': { title: 'Swimming Caps', description: 'Chlorine-resistant silicone swim caps.' },
  'swim-caps': { title: 'Swim Caps', description: 'Chlorine-resistant silicone caps.' },
  'swimming-accessories': { title: 'Swimming Accessories', description: 'Swim fins, kickboards, and pool accessories.' },
  set: { title: 'Sets & Combos', description: 'Complete performance kit sets and multi-piece gear combos.' },
  combo: { title: 'Combo Sets', description: 'Curated sports equipment combos and gift packages.' },

  // Category - Accessories
  accessories: { title: 'Accessories', description: 'Essential bags, headwear, drinkware, and sports lifestyle accessories.' },
  backpack: { title: 'Backpacks', description: 'Multipurpose laptop and sports backpacks.' },
  sling: { title: 'Sling Bags', description: 'Compact crossbody and sling bags for daily essentials.' },
  gym: { title: 'Gym Bags & Duffels', description: 'High-capacity athletic gym bags and training duffels.' },
  trolley: { title: 'Trolley Bags', description: 'Heavy-duty travel trolley bags and team wheelie bags.' },
  cushion: { title: 'Cushions & Accessories', description: 'Comfort accessories and stadium cushions.' },
  drinkware: { title: 'Drinkware & Bottles', description: 'Insulated stainless steel bottles, sippers, and hydration gear.' },
  sipper: { title: 'Sippers & Bottles', description: 'Ergonomic sports sipper water bottles.' },
  shaker: { title: 'Shaker Bottles', description: 'Protein and supplement shaker bottles.' },
  mug: { title: 'Ceramic Mugs', description: 'Official team ceramic fan mugs.' },
  headwear: { title: 'Headwear & Caps', description: 'Breathable caps, visors, and beanies built for sport.' },
  caps: { title: 'Caps & Headwear', description: 'Breathable caps and hats built for sport and street.' },
  cap: { title: 'Caps & Headwear', description: 'Breathable caps and hats built for sport and street.' },
  hat: { title: 'Hats & Bucket Hats', description: 'Wide-brim athletic hats and bucket hats.' },
  socks: { title: 'Socks & Performance', description: 'Cushioned athletic socks with arch support.' },
  'crew-socks': { title: 'Crew Socks', description: 'Mid-calf athletic crew socks.' },
  'ankle-socks': { title: 'Ankle Socks', description: 'Low-cut cushioned ankle socks.' },
  towel: { title: 'Towels & Bath Sets', description: 'Quick-dry microfiber and premium cotton sports towels.' },

  // Sports - Functions
  cricket: { title: 'Cricket Collection', description: 'Official match jerseys, training tees, bats, and cricket gear.' },
  'running-training': { title: 'Running & Training', description: 'Lightweight, sweat-wicking gear for runners and gym enthusiasts.' },
  cycling: { title: 'Cycling', description: 'Aerodynamic cycling wear and accessories.' },
  football: { title: 'Football', description: 'Jerseys, shorts, and training equipment for football.' },
  pickleball: { title: 'Pickleball', description: 'Pickleball paddles, balls, and court apparel.' },
  swimming: { title: 'Swimming', description: 'Goggles and swim caps engineered for the pool.' },
  badminton: { title: 'Badminton', description: 'Rackets, apparel, and court gear for badminton.' },
  tennis: { title: 'Tennis', description: 'Tennis polos, shorts, and accessories.' },
  volleyball: { title: 'Volleyball', description: 'Volleyball jerseys, kneepads, and training gear.' },
  squash: { title: 'Squash', description: 'Court gear and breathable apparel for squash.' },
  basketball: { title: 'Basketball', description: 'Hoops jerseys, shorts, and basketball gear.' },
  'fitness-gym-yoga': { title: 'Fitness Gym & Yoga', description: 'Apparel and accessories built for yoga and strength training.' },
  'gym-fitness-yoga': { title: 'Gym, Fitness & Yoga', description: 'Apparel and accessories built for gym workouts, fitness training, and yoga.' },
  'outdoor-adventure': { title: 'Outdoor & Adventure', description: 'Durable gear for hiking, trail running, and outdoor adventures.' },
  golf: { title: 'Golf', description: 'Premium golf polos and performance accessories.' },
  baseball: { title: 'Baseball', description: 'Baseball caps, jerseys, and field gear.' },
  'lifestyle-after-sports': { title: 'Lifestyle After Sports', description: 'Casual street style apparel for recovery and everyday wear.' },
  kabaddi: { title: 'Kabaddi', description: 'Official Kabaddi jerseys, shorts, and fan gear.' },
  'home-office': { title: 'Home & Office', description: 'Lifestyle accessories and drinkware for work and home.' },

  // Brand & Collaborations
  playr: { title: 'playR Core Collection', description: 'The signature performance sportswear collection by playR.' },
  'playr-street': { title: 'playR STREET', description: 'Urban streetwear meets athletic performance.' },
  'playr-official-merchandise': { title: 'playR Official Merchandise', description: 'Authentic playR licensed merchandise and gear.' },
  'chennai-super-kings': { title: 'Chennai Super Kings', description: 'Official playR x Chennai Super Kings IPL merchandise.' },
  'playr-x-chennai-super-kings': { title: 'Chennai Super Kings', description: 'Official playR x Chennai Super Kings IPL merchandise.' },
  'csk': { title: 'Chennai Super Kings', description: 'Official playR x Chennai Super Kings IPL merchandise.' },
  'sunrisers-hyderabad': { title: 'Sunrisers Hyderabad', description: 'Official playR x Sunrisers Hyderabad IPL merchandise.' },
  'playr-x-sunrisers-hyderabad': { title: 'Sunrisers Hyderabad', description: 'Official playR x Sunrisers Hyderabad IPL merchandise.' },
  'srh': { title: 'Sunrisers Hyderabad', description: 'Official playR x Sunrisers Hyderabad IPL merchandise.' },
  'lucknow-super-giants': { title: 'Lucknow Super Giants', description: 'Official playR x Lucknow Super Giants IPL merchandise.' },
  'playr-x-lucknow-super-giants': { title: 'Lucknow Super Giants', description: 'Official playR x Lucknow Super Giants IPL merchandise.' },
  'lsg': { title: 'Lucknow Super Giants', description: 'Official playR x Lucknow Super Giants IPL merchandise.' },
  'mumbai-indians': { title: 'Mumbai Indians', description: 'Official playR x Mumbai Indians IPL merchandise.' },
  'playr-x-mumbai-indians': { title: 'Mumbai Indians', description: 'Official playR x Mumbai Indians IPL merchandise.' },
  'rajasthan-royals': { title: 'Rajasthan Royals', description: 'Official playR x Rajasthan Royals IPL merchandise.' },
  'playr-x-rajasthan-royals': { title: 'Rajasthan Royals', description: 'Official playR x Rajasthan Royals IPL merchandise.' },
  'punjab-kings': { title: 'Punjab Kings', description: 'Official playR x Punjab Kings IPL merchandise.' },
  'playr-x-punjab-kings': { title: 'Punjab Kings', description: 'Official playR x Punjab Kings IPL merchandise.' },
  'kolkata-knight-riders': { title: 'Kolkata Knight Riders', description: 'Official playR x Kolkata Knight Riders IPL merchandise.' },
  'playr-x-kolkata-knight-riders': { title: 'Kolkata Knight Riders', description: 'Official playR x Kolkata Knight Riders IPL merchandise.' },
  'gujarat-titans': { title: 'Gujarat Titans', description: 'Official playR x Gujarat Titans IPL merchandise.' },
  'playr-x-gujarat-titans': { title: 'Gujarat Titans', description: 'Official playR x Gujarat Titans IPL merchandise.' },
  'up-yoddha': { title: 'UP Yoddha', description: 'Official playR x UP Yoddha PKL merchandise.' },
  'up-yoddhas': { title: 'UP Yoddhas', description: 'Official playR x UP Yoddhas PKL merchandise.' },
  'playr-x-up-yoddha': { title: 'UP Yoddhas', description: 'Official playR x UP Yoddhas PKL merchandise.' },
  'seattle-orcas': { title: 'Seattle Orcas', description: 'Official playR x Seattle Orcas MLC merchandise.' },
  'playr-x-seattle-orcas': { title: 'Seattle Orcas', description: 'Official playR x Seattle Orcas MLC merchandise.' },
  'adidas': { title: 'Adidas Collection', description: 'Authentic Adidas performance athletic footwear and training wear.' },
  'reebok': { title: 'Reebok Collection', description: 'Authentic Reebok performance sportswear and footwear.' },
  'icc': { title: 'ICC World Cup Collection', description: 'Official ICC tournament fanwear, jerseys, and gear.' },

  // Gender & Age Collections
  men: { title: "Men's Sportswear", description: "Engineered athletic wear and performance gear for men." },
  women: { title: "Women's Sportswear", description: "Engineered athletic wear and performance gear for women." },
  unisex: { title: 'Unisex Performance', description: 'Versatile sportswear and accessories designed for all athletes.' },
  boys: { title: "Boys' Activewear", description: "High-performance youth sportswear for boys." },
  girls: { title: "Girls' Activewear", description: "High-performance youth sportswear for girls." },
  kids: { title: 'Kids Collection', description: 'Performance sportswear built for young athletes.' },
  adult: { title: 'Adults Collection', description: 'Performance athletic apparel and equipment for adults.' },
  ageless: { title: 'Ageless Collection', description: 'Universal athletic gear and accessories designed for all athletes.' },
};

export function formatCollectionTitle(slug: string): string {
  if (!slug) return 'Collection';
  if (collections[slug]?.title) {
    return collections[slug].title;
  }
  return slug
    .split('-')
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'and') return '&';
      if (['ipl', 'csk', 'lsg', 'srh', 'mlc', 'pkl'].includes(lower)) return lower.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export const filterChips = ['View all', 'Caps', 'Headwear', 'Goggles', 'Swim Caps'];

export function getProduct(handle: string): BluorngProduct | undefined {
  return products.find((p) => p.handle === handle);
}

export function getCollectionProducts(handle: string): BluorngProduct[] {
  if (!handle || handle === 'all-products' || handle === 'collection') return products;
  
  const normalized = handle.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const matches = products.filter((p) => {
    const pCollections = p.collections.map((c) => c.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const pType = p.type ? p.type.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const pTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      pCollections.includes(normalized) ||
      pType.includes(normalized) ||
      (normalized.length > 2 && pType.includes(normalized.slice(0, 4))) ||
      pTitle.includes(normalized)
    );
  });

  return matches.length > 0 ? matches : products.slice(0, 8);
}

export function formatPrice(n: number): string {
  return 'RS. ' + n.toLocaleString('en-IN');
}

export const stories = Array.from({ length: 14 }).map((_, i) => {
  const p = products[i % products.length];
  const num = String(i + 1).padStart(2, '0');
  return {
    label: `Look ${num}`,
    href: `/products/${p.handle}`,
    cta: 'Shop Look',
    image: p.images[0] || '',
  };
});

export const banners = [
  {
    title: 'PICKLEBALL 2026',
    cta: 'Shop now',
    href: '/collections/pickleball',
    image: `${CDN}/amazon_3.jpg`,
    bg: 'linear-gradient(120deg, #1e3a8a, #065f46)',
  },
  {
    title: 'SWIM PERFORMANCE',
    cta: 'Shop now',
    href: '/collections/swimming',
    image: `${CDN}/amazon_5.jpg`,
    bg: 'linear-gradient(120deg, #06263f, #0e4d7a)',
  },
  {
    title: 'CHENNAI SUPER KINGS',
    cta: 'Shop fanwear',
    href: '/collections/csk',
    image: `${CDN}/csk_web_banner__jpg.jpg`,
    bg: 'linear-gradient(120deg, #854d0e, #1e3a8a)',
  },
  {
    title: 'GYM & WORKOUT',
    cta: 'Shop now',
    href: '/collections/gym',
    image: `${CDN}/amazon.jpg`,
    bg: 'linear-gradient(120deg, #18181b, #27272a)',
  },
  {
    title: 'SUNRISERS HYDERABAD',
    cta: 'Shop fanwear',
    href: '/collections/srh',
    image: `${CDN}/srh_web_banner__jpg.jpg`,
    bg: 'linear-gradient(120deg, #9a3412, #431407)',
  },
  {
    title: 'LUCKNOW SUPER GIANTS',
    cta: 'Shop fanwear',
    href: '/collections/lsg',
    image: `${CDN}/lsg_available_now_banner.jpg`,
    bg: 'linear-gradient(120deg, #0284c7, #075985)',
  },
];

export interface DiscoverCollection {
  handle: string;
  title: string;
  image: string;
}

export const discoverCollections: DiscoverCollection[] = [
  { handle: 'caps', title: 'Caps & Headwear', image: getProduct('playr-mesh-cap-bottle-green')?.images[0] || '' },
  { handle: 'swimming', title: 'Swim Gear', image: getProduct('goggles-professional-blue-green')?.images[0] || '' },
  { handle: 'seattle-orcas', title: 'Seattle Orcas Collection', image: getProduct('seattle-orcas-match-cap')?.images[0] || '' },
];

export interface StoreLocation {
  city: string;
  image: string;
  address: string;
  phone: string;
  map: string;
}

export const stores: StoreLocation[] = [
  {
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80',
    address: 'Ground Floor, Phoenix Palladium, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    phone: '+91 22 6634 3000',
    map: 'https://maps.google.com/?q=Phoenix+Palladium+Mumbai',
  },
  {
    city: 'Bengaluru',
    image: 'https://images.unsplash.com/photo-1567401893930-f158be9cf7b3?auto=format&fit=crop&w=600&q=80',
    address: '2nd Floor, Orion Mall, Dr Rajkumar Rd, Rajajinagar, Bengaluru, Karnataka 560055',
    phone: '+91 80 6728 2222',
    map: 'https://maps.google.com/?q=Orion+Mall+Bengaluru',
  },
  {
    city: 'New Delhi',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    address: 'Ground Floor, DLF Promenade, Nelson Mandela Marg, Vasant Kunj, New Delhi, Delhi 110070',
    phone: '+91 11 4606 8600',
    map: 'https://maps.google.com/?q=DLF+Promenade+Delhi',
  },
];

// Full playR SKU catalog -- imported from sku-catalog.ts (sourced from 'playR new website product.xlsx'
// and mapped to 'playR Website listings - sport.xlsx' taxonomy).
import { skuCatalog } from './sku-catalog';
export { skuCatalog };

// Deduplicate catalog entries to prevent React key collision and duplicated collection tiles
const existingHandles = new Set(products.map((p) => p.handle));
for (const item of skuCatalog) {
  if (!existingHandles.has(item.handle)) {
    products.push(item);
    existingHandles.add(item.handle);
  }
}

// Map and merge local DB products into Bluorng catalog for a unified experience
try {
  // eslint-disable-next-line
  const dbData = require('../../../../db_store.json');
  if (dbData && Array.isArray(dbData.products)) {
    for (const dbp of dbData.products) {
      const handle = dbp.slug || dbp.id;
      if (!existingHandles.has(handle)) {
        products.push({
          handle,
          title: dbp.title,
          price: dbp.price,
          compareAt: dbp.compareAtPrice || null,
          type: dbp.category || 'Apparel',
          collections: [dbp.category ? dbp.category.toLowerCase() : 'all'],
          images: dbp.gallery && dbp.gallery.length > 0 ? dbp.gallery : (dbp.imageSrc ? [dbp.imageSrc] : []),
          description: dbp.description || '',
          details: dbp.specifications || [],
          colors: dbp.colors ? dbp.colors.map((c: any) => c.name || c) : [],
          sizes: dbp.sizes || ['S', 'M', 'L', 'XL'],
          customizable: dbp.customizable || handle.includes('jersey')
        });
        existingHandles.add(handle);
      }
    }
  }
} catch {
  // Graceful fallback if db_store is not accessible in specific bundling contexts
}

export interface CategoryTile {
  handle: string;
  title: string;
  image: string;
}

export const categoryTiles: CategoryTile[] = [
  { handle: 'apparel', title: 'Apparel', image: getProduct('lucknow-super-giants-authentic-match-jersey-ipl-2026-adult-half-sleeve')?.images[0] || 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/cxzxc.jpg?v=1773746369' },
  { handle: 'equipment', title: 'Equipment', image: getProduct('csk-whistle-podu-cut-frame-kashmir-willow-tennis-bat-1')?.images[0] || 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard1_bbb32292-afbc-41ee-b2f0-01fd96c5aabd.jpg?v=1787655480' },
  { handle: 'accessories', title: 'Accessories', image: getProduct('playr-mesh-cap-dark-grey')?.images[0] || '' },
  { handle: 'topwear', title: 'Topwear', image: getProduct('csk-whistle-podu-round-neck-t-shirt-yellow-men')?.images[0] || 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/cxzxc.jpg?v=1773746369' },
];
