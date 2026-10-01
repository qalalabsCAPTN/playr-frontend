// playR catalog — pulled from the playR Shopify store (full image galleries)
const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';
const img = (f: string) => `${CDN}/${f}`;

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
  soldOut?: boolean;
  /** True when no real product photo could be sourced yet — renders a "Photo coming soon" placeholder. */
  placeholder?: boolean;
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
  bottomwear: { title: 'Bottomwear', description: 'Performance shorts, track pants, tights, and training bottoms.' },
  topwear: { title: 'Topwear', description: 'Breathable tees, polos, jerseys, and jackets built for movement.' },
  suit: { title: 'Suit & Tracksuits', description: 'Official playR athletic suits and tracksuits.' },
  innerwear: { title: 'Innerwear', description: 'Comfortable base layers and athletic innerwear.' },
  
  // Category - Equipment
  paddle: { title: 'Paddle & Pickleball', description: 'Professional pickleball paddles, balls, and court gear.' },
  band: { title: 'Bands & Resistance', description: 'Fitness resistance bands and athletic wristbands.' },
  bag: { title: 'Bags & Duffels', description: 'Durable sports bags, duffels, and gear backpacks.' },
  ball: { title: 'Balls & Equipment', description: 'Match balls, training balls, and equipment.' },
  bat: { title: 'Bats & Gear', description: 'Premium cricket bats and batting accessories.' },
  gloves: { title: 'Gloves', description: 'Batting, fielding, and sports gloves for max grip.' },
  guard: { title: 'Guards & Protection', description: 'Protective guards and pads engineered for safety.' },
  'yoga-mat': { title: 'Yoga Mats', description: 'Non-slip fitness and yoga mats for daily training.' },
  'swimming-goggles': { title: 'Swimming Goggles', description: 'UV-protected, anti-fog goggles for every swimmer.' },
  'swimming-caps': { title: 'Swimming Caps', description: 'Chlorine-resistant silicone swim caps.' },
  'swimming-accessories': { title: 'Swimming Accessories', description: 'Swim fins, kickboards, and pool accessories.' },

  // Category - Accessories
  cushion: { title: 'Cushions & Accessories', description: 'Comfort accessories and stadium cushions.' },
  drinkware: { title: 'Drinkware & Bottles', description: 'Insulated stainless steel bottles and hydration gear.' },
  headwear: { title: 'Headwear & Caps', description: 'Breathable caps, visors, and beanies built for sport.' },
  caps: { title: 'Caps & Headwear', description: 'Breathable caps and hats built for sport and street.' },
  socks: { title: 'Socks & Performance', description: 'Cushioned athletic socks with arch support.' },

  // Sports - Popular & Court
  cricket: { title: 'Cricket Collection', description: 'Official match jerseys, training tees, bats, and cricket gear.' },
  'running-training': { title: 'Running & Training', description: 'Lightweight, sweat-wicking gear for runners and gym enthusiasts.' },
  cycling: { title: 'Cycling', description: 'Aerodynamic cycling wear and accessories.' },
  football: { title: 'Football', description: 'Jerseys, shorts, and training equipment for football.' },
  pickleball: { title: 'Pickleball', description: 'Pickleball paddles, balls, and court apparel.' },
  swimming: { title: 'Swimming', description: 'Goggles and swim caps engineered for the pool.' },
  goggles: { title: 'Goggles', description: 'UV-protected, anti-fog goggles for every swimmer.' },
  'swim-caps': { title: 'Swim Caps', description: 'Chlorine-resistant silicone caps.' },
  badminton: { title: 'Badminton', description: 'Rackets, apparel, and court gear for badminton.' },
  tennis: { title: 'Tennis', description: 'Tennis polos, shorts, and accessories.' },
  volleyball: { title: 'Volleyball', description: 'Volleyball jerseys, kneepads, and training gear.' },
  squash: { title: 'Squash', description: 'Court gear and breathable apparel for squash.' },
  basketball: { title: 'Basketball', description: 'Hoops jerseys, shorts, and basketball gear.' },

  // Sports - Fitness & Lifestyle
  'fitness-gym-yoga': { title: 'Fitness Gym & Yoga', description: 'Apparel and accessories built for yoga and strength training.' },
  'outdoor-adventure': { title: 'Outdoor & Adventure', description: 'Durable gear for hiking, trail running, and outdoor adventures.' },
  golf: { title: 'Golf', description: 'Premium golf polos and performance accessories.' },
  baseball: { title: 'Baseball', description: 'Baseball caps, jerseys, and field gear.' },
  'lifestyle-after-sports': { title: 'Lifestyle After Sports', description: 'Casual street style apparel for recovery and everyday wear.' },
  kabaddi: { title: 'Kabaddi', description: 'Official Kabaddi jerseys, shorts, and fan gear.' },
  'home-office': { title: 'Home & Office', description: 'Lifestyle accessories and drinkware for work and home.' },

  // Brand & Collaborations
  playr: { title: 'playR Core Collection', description: 'The signature performance sportswear collection by playR.' },
  'playr-official-merchandise': { title: 'playR Official Merchandise', description: 'Authentic playR licensed merchandise and gear.' },
  'chennai-super-kings': { title: 'Chennai Super Kings', description: 'Official playR x Chennai Super Kings IPL merchandise.' },
  'sunrisers-hyderabad': { title: 'Sunrisers Hyderabad', description: 'Official playR x Sunrisers Hyderabad IPL merchandise.' },
  'lucknow-super-giants': { title: 'Lucknow Super Giants', description: 'Official playR x Lucknow Super Giants IPL merchandise.' },
  'up-yoddhas': { title: 'UP Yoddhas', description: 'Official playR x UP Yoddhas PKL merchandise.' },
  'seattle-orcas': { title: 'Seattle Orcas', description: 'Official playR x Seattle Orcas MLC merchandise.' },
  kids: { title: 'Kids Collection', description: 'Performance sportswear built for young athletes.' },
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
    title: 'SWIM SEASON 2026',
    cta: 'Shop now',
    href: '/collections/swimming',
    image: getProduct('goggles-professional-blue-green')?.images[1] || '',
    bg: 'linear-gradient(120deg, #06263f, #0e4d7a)',
  },
  {
    title: 'playR x SEATTLE ORCAS',
    cta: 'Shop now',
    href: '/collections/seattle-orcas',
    image: getProduct('seattle-orcas-match-cap')?.images[1] || '',
    bg: 'linear-gradient(120deg, #0b2818, #14532d)',
  },
  {
    title: 'MESH CAPS — ALL COLOURS',
    cta: 'Shop now',
    href: '/collections/caps',
    image: getProduct('playr-mesh-cap-india-blue')?.images[1] || '',
    bg: 'linear-gradient(120deg, #1e2749, #3b4a8f)',
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

export interface CategoryTile {
  handle: string;
  title: string;
  image: string;
}

export const categoryTiles: CategoryTile[] = [
  { handle: 'topwear', title: 'Topwear', image: getProduct('playr-mesh-cap-red')?.images[0] || '' },
  { handle: 'bottomwear', title: 'Bottomwear', image: getProduct('playr-mesh-cap-maroon')?.images[0] || '' },
  { handle: 'headwear', title: 'Headwear', image: getProduct('playr-mesh-cap-dark-grey')?.images[0] || '' },
  { handle: 'swimming', title: 'Swim Gear', image: getProduct('goggles-performance-neon-orange')?.images[0] || '' },
];


// Real playR SKU catalog -- sourced from "playR new website product.xlsx" (2026-09-25),
// 50 products sampled across all sheet categories. Images are matched by SKU/Article Code
// against the live playr.in Shopify store's public catalog (cdn.shopify.com) wherever that
// SKU is already listed there (46 of 50); a few fall back to the sheet's Google Drive photos
// (3 of 50, for products not yet listed on the live store); `placeholder: true` marks the one
// product with no real photo available from either source -- it renders a "Photo coming soon"
// graphic until a real image is supplied.
export const skuCatalog: BluorngProduct[] = [
  {
    handle: 'prlbp-2201-02',
    title: 'Laptop Back Pack',
    price: 2199, compareAt: null,
    type: 'Backpack',
    collections: ['bag', 'fitness-gym-yoga', 'home-office', 'lifestyle-after-sports', 'outdoor-adventure'],
    images: [
      'https://lh3.googleusercontent.com/d/1UfBvKVIClCh7pe_c86WlMmPjFZR3upbI=w1200',
      'https://lh3.googleusercontent.com/d/1NpJMB4EEvXRykFGPhQn-LtM9_KFT3tSf=w1200',
      'https://lh3.googleusercontent.com/d/1LNv563RC9NIwlh81yA_Gb4gCWwgbx151=w1200',
      'https://lh3.googleusercontent.com/d/1sS-MZN4-aoRs_8if_l2kl7ipbmihPgWA=w1200'
    ],
    description: 'Carry your essentials in style and comfort with the playR Laptop Backpack. Crafted from high-quality, durable materials and this backpack ensures your belongings stay protected from moisture and everyday wear. Its spacious main compartment and dedicated laptop sleeve provide storage for your electronics, books, gym gear, or match-day essentials, making it perfect for work, college, cricket practice, or weekend getaways. The lightweight build and padded, adjustable shoulder straps offer all-day c',
    details: ['Crafted from High-Quality Materials : The playR Unisex Laptop Backpack is crafted from High Quality, long-lasting materials that offer exceptional durability. Whether you\'re commuting to work, heading to college, traveling, or packing for match day, this backpack ensures reliable performance, professional appearance that holds up through frequent use.', 'Durable & Built to Last Made from High-quality fabric, this backpack is designed to handle everyday use—whether you\'re heading to school, office, gym, or weekend trips. It stays tough and reliable, season after season.', 'Lightweight & Spacious Multipurpose Design: Despite its compact appearance, the spacious main compartment easily holds your daily essentials, making it ideal for office, college, gym, or cricket match days.', 'Sleek, Stylish & Versatile With a clean, modern design that fits any lifestyle, this backpack works perfectly for men and women. Whether you\'re dressing casual or sporty, it’s the perfect fit for college, travel, or daily routines.'],
  },
  {
    handle: 'pwbc-101-1',
    title: 'Stay Hydrated Sipper Bottle',
    price: 199, compareAt: null,
    type: 'Sipper',
    collections: ['drinkware', 'fitness-gym-yoga', 'lifestyle-after-sports', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/647b576f-b004-4037-aa59-44ce566dfe92.jpg?v=1768636382',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_c51177a1-4170-42c4-9651-6b2955c73702.jpg?v=1768636382',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_48ffc661-48b3-4f99-8dcb-f435144885ff.jpg?v=1768636382',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_bf5b6df4-2083-47ec-b66b-47555bae7b8e.jpg?v=1768636382',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_6a8e2478-ee7c-46e4-ba5e-1e5ebd4d1c02.jpg?v=1768636382'
    ],
    description: 'Introducing the playR Stay Hydrated Sipper Bottle — a thoughtfully designed hydration solution created for athletes, cricket lovers, gym-goers, and active individuals who value performance, durability, and convenience. Made with BPA-free, food-grade materials, this sipper bottle stands out for its safe and sturdy construction, ensuring every sip you take is fresh, clean, and chemical-free. Engineered with a leak-proof sipper lid and ergonomic design, this bottle makes staying hydrated on the mov',
    details: ['Crafted from high-quality, BPA-free material, the playR Sipper Bottle ensures safe, non-toxic hydration with every sip. Its sturdy and durable construction is designed to withstand daily wear and tear, making it an ideal choice for athletes, students, professionals, and fitness enthusiasts who demand both performance and safety from their drinkware.', 'Generously sized with a 750 ml capacity, this sipper bottle is perfectly suited for long training sessions, gym workouts, cricket matches, or travel days where constant refilling isn’t an option. It provides ample hydration support for extended outdoor adventures or intense sporting activities, keeping your favorite beverages easily accessible.', 'Equipped with an ergonomic, easy-to-hold grip and lightweight design, the playR Sipper Bottle ensures comfort during use, whether you’re on the cricket field, at the gym, in school, or traveling. Its compact yet capacious build makes it a convenient fit for backpacks, kitbags, or car holders without compromising on liquid volume.', 'Designed with a secure, leak-proof sipper lid, this bottle allows for effortless, spill-free drinking on the move. The smart flip-top cap mechanism ensures hygiene and quick access to your drink, making it perfect for fast-paced matches, workouts, or commuting without worrying about accidental leaks or mess.'],
  },
  {
    handle: 'prcmug-csk-01',
    title: 'CSK Ready to Raor Ceramic Mug',
    price: 399, compareAt: null,
    type: 'Mug',
    collections: ['chennai-super-kings', 'cricket', 'drinkware', 'home-office', 'lifestyle-after-sports'],
    images: [
      'https://lh3.googleusercontent.com/d/1r1IiuVsPDBKRmka63EEY74tBOL1GNhOR=w1200'
    ],
    description: 'playR x CSK Ready to Roar Ceramic Mug – 330ML is a stylish and durable ceramic coffee and tea mug designed for everyday use. Made from high-quality ceramic material, this 330ML mug is perfect for tea, coffee, hot chocolate, and daily beverages. It features bold “Ready to Roar” graphics inspired by Chennai Super Kings, making it a great choice for cricket fans and IPL match-day vibes. The smooth finish gives a clean, classy look, while the strong ceramic body makes it suitable for regular use at ',
    details: ['✔️ Superior-Grade Ceramic Mug Build – Made from high-quality thick ceramic material that offers strong durability, smooth finish, and good heat retention, perfect for daily tea, coffee, and hot beverage use at home, office, or work-from-home setups.', '✔️ 330ML Coffee & Tea Mug Capacity – Ideal 330ML ceramic coffee mug for tea, coffee, hot chocolate, green tea, and daily drinks. Perfect for office desks, study tables, home kitchens, and everyday routines.', '✔️ Bold CSK Ready to Roar Fan Design – Specially designed for true Chennai Super Kings fans with bold “Ready to Roar” graphics, making it a perfect IPL mug for match days, fan collections, and cricket lovers.', '✔️ Versatile Use for Multiple Occasions – Whether enjoying a quiet morning alone, celebrating victories with friends, gifting a cricket enthusiast, or hosting an IPL match viewing party, this mug fits every mood and moment beautifully.'],
  },
  {
    handle: 'prc23-138-1',
    title: 'playR Mesh Cap',
    price: 399, compareAt: null,
    type: 'Cap',
    collections: ['fitness-gym-yoga', 'headwear', 'lifestyle-after-sports', 'outdoor-adventure', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard1_db8669c2-f8f1-4854-99a3-3b6342fbe6d7.jpg?v=1782909214',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard2_c3445cff-1128-47ce-8d17-d8b1000773db.png?v=1782909214',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard3_03923f62-7cd9-4fc0-83d0-ec27d54f461c.png?v=1782909214',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard5_ad1ea5bf-db2c-4ed1-91fe-fcfcc74461a7.png?v=1782909214',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214'
    ],
    colors: ['Black', 'Bottle Green', 'Dark Grey', 'India Blue', 'Maroon', 'Navy Blue'],
    description: 'Experience next-level comfort and protection with the playR Mesh Cap, a high-performance essential designed for those who demand both style and functionality in their everyday headwear. Whether you\'re powering through a high-intensity workout, going for a long outdoor run, or just stepping out for a casual day, this ultra-lightweight cap delivers unbeatable comfort, breathability, and adaptability to match your pace. Crafted with a breathable mesh fabric, the playR Mesh Cap maximizes airflow to ',
    details: ['Lightweight Mesh Cap for Active Lifestyles : Stay cool and comfortable with this ultra-light playR mesh sports cap designed for performance and daily wear. Ideal for running, gym workouts, cycling, or travel.', 'Breathable Ventilation with Mesh Panels : Built with high-airflow mesh fabric, this cap ensures maximum breathability and helps wick away sweat, keeping your head fresh even on hot days.', 'Adjustable Fit for All Head Sizes : Features an adjustable strap with buckle or Velcro (as per product), ensuring a snug and customized fit for both men and women.', 'Sun Protection & Sweat Control : Offers shade from direct sunlight and absorbs sweat to prevent it from dripping into your eyes — great for sports, outdoor work, or summer errands.'],
  },
  {
    handle: 'prcsk-matchcap',
    title: 'CSK OFFICIAL PLAYER CAP',
    price: 899, compareAt: null,
    type: 'Cap',
    collections: ['chennai-super-kings', 'cricket', 'fitness-gym-yoga', 'headwear', 'lifestyle-after-sports', 'outdoor-adventure'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/0.00.20.21._1.jpg?v=1782368949',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/0.213.0.221_1.jpg?v=1782368949',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/0.213515623.0_1.jpg?v=1782368949',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/0.213516500._ad8d1a03-67a5-4b63-a87d-d8553d6d354b.jpg?v=1782368949',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/0.23105632.0_1.jpg?v=1782368949'
    ],
    description: 'Support your team in style with the Chennai super kings Authentic Match Cap – designed for dedicated CSK fans and true cricket enthusiasts. This csk official match cap blends sporty performance with everyday comfort, making it the perfect IPL match day accessory. Crafted from high-quality Polymesh fabric, the cap offers lightweight comfort, breathable support, and long-lasting durability. The performance fabric helps maintain shape and color even after regular use, making it ideal for stadium we',
    details: ['✔️ Authentic CSK Match Cap One Size – Official chennai super kings authentic match cap for IPL 2026, designed for true fans and cricket lovers. Perfect cricket cap for match day, stadium wear, fan merchandise collection, and everyday team support.', '✔️ Poly Mesh Performance Fabric – Crafted from high quality fabric, this lightweight breathable cricket sports cap offers high comfort, quick-dry performance, and long-lasting durability for extended match day and outdoor use.', '✔️ Unisex Adjustable One Size Fit – Designed with an adjustable back for a secure and customizable fit. Ideal unisex IPL fan cap for men and women, suitable for gym training, cricket practice, outdoor sports, and casual daily wear.', '✔️ Lightweight Sun Protection Cricket Cap – Curved visor provides effective sun protection, making it a reliable outdoor sports cap for summer matches, travel, training sessions, and stadium cheering.'],
  },
  {
    handle: 'prcsk23-fc02',
    title: 'CSK Fan Cap',
    price: 699, compareAt: null,
    type: 'Cap',
    collections: ['chennai-super-kings', 'cricket', 'fitness-gym-yoga', 'headwear', 'lifestyle-after-sports', 'outdoor-adventure'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_2_1d1067a1-25e1-4e4a-909a-e7c73832d6d4.jpg?v=1774425115',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/hf_20260310_054601_d0db8418-7629-4b60-b051-d3896644783e_1.jpg?v=1774425115',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_d00e648d-ac79-48ac-a031-615bb3ea727c.jpg?v=1774425115',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/hf_20260310_052356_84983c1c-cbf6-44b8-83fe-5ea8f02756a9.jpg?v=1774425115',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard_2.jpg?v=1774425115'
    ],
    description: 'Support your team in style with the Chennai super kings Authentic Fan Cap, designed for dedicated CSK fans and true cricket enthusiasts. This CSK official fan cap blends sporty performance with everyday comfort, making it the perfect IPL match day accessory. Crafted from 100% high-quality polyester, the cap offers lightweight comfort, breathable support, and durable construction. The performance fabric helps maintain shape and color even after regular use, making it ideal for stadium wear, outdo',
    details: ['✔️ Authentic CSK Fan Cap One Size – Official chennai super kings authentic fan cap for IPL 2026, designed for true CSK fans and cricket lovers. Perfect cricket fan cap for match day, stadium wear, fan merchandise collection, and everyday team support.', '✔️ 100% Polyester Performance Fabric – Crafted from high quality 100% polyester, this lightweight breathable cricket sports cap offers durable structure, sweat-wicking comfort, and long-lasting performance for extended match day and outdoor use.', '✔️ Unisex Adjustable One Size Fit – Designed with an adjustable back for a secure and customizable fit. Ideal unisex IPL fan cap for men and women, suitable for gym training, cricket practice, outdoor sports, travel, and casual daily wear.', '✔️ Lightweight Sun Protection Cricket Cap – Curved visor provides effective sun protection and glare reduction, making it a reliable outdoor sports cap for summer matches, travel, training sessions, and stadium cheering.'],
  },
  {
    handle: 'prlsg-fc04',
    title: 'LUCKNOW SUPER GIANTS AUTHENTIC FAN CAP -03',
    price: 799, compareAt: null,
    type: 'Cap',
    collections: ['cricket', 'headwear', 'lifestyle-after-sports', 'lucknow-super-giants', 'outdoor-adventure', 'running-training'],
    images: [
      'data:image/svg+xml;utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'800\' viewBox=\'0 0 800 800\'%3E%3Crect width=\'800\' height=\'800\' fill=\'%23EFE9DC\'/%3E%3Ctext x=\'400\' y=\'380\' font-family=\'Arial\' font-size=\'42\' font-weight=\'800\' fill=\'%238a8272\' text-anchor=\'middle\'%3Eplay(R)%3C/text%3E%3Ctext x=\'400\' y=\'430\' font-family=\'Arial\' font-size=\'22\' fill=\'%238a8272\' text-anchor=\'middle\'%3EPhoto coming soon%3C/text%3E%3C/svg%3E'
    ],
    description: 'Official playR LUCKNOW SUPER GIANTS AUTHENTIC FAN CAP -03.',
    details: ['100% Polyester'],
    placeholder: true,
  },
  {
    handle: 'pr30123pck3',
    title: 'Men Ankle Socks (Pack of 3)',
    price: 799, compareAt: null,
    type: 'Ankle',
    collections: ['cricket', 'fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'socks'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/A_highend_professional_4k_202601221639.jpg?v=1769972550',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/In_same_background_4k_202601221650_1.jpg?v=1769972551',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/In_same_background_4k_202601221650.jpg?v=1769972550',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/A_highend_professional_4k_202601221707.jpg?v=1769972550'
    ],
    description: 'The playR Men’s Ankle Socks Pack of 3 is designed for everyday comfort, sports activity, and regular use. Made with a breathable blend of 80% cotton and 20% nylon spandex, these socks feel soft on the skin while allowing proper airflow to help manage sweat during long hours of wear. The cotton fabric keeps feet comfortable, making these socks suitable for gym workouts, running, cricket, and daily routines. These men’s ankle socks offer a comfortable stretch fit that adapts well to your feet with',
    details: ['✔️ Breathable Cotton Fabric : Made with 80% cotton and 20% nylon spandex, these men’s ankle socks feel soft on skin and allow proper airflow, helping reduce sweat during gym, running, cricket, and long daily wear.', '✔️ Comfortable Stretch Fit : Soft and stretchable ankle socks for men that fit well without slipping or tightening. Spandex blend helps socks stay in place while walking, training, or working out.', '✔️ Suitable for Sports & Daily Use : Designed as sports socks for gym, running, cricket, and workouts, also comfortable for casual and daily wear with shoes or sneakers.', '✔️ All-Season Wear : Lightweight yet durable fabric makes these all-season socks suitable for summer, monsoon, and mild winter use without feeling heavy or uncomfortable.'],
  },
  {
    handle: 'pr301blk',
    title: 'Men Ankle Socks (Pack of 1)',
    price: 299, compareAt: null,
    type: 'Ankle',
    collections: ['cricket', 'fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'socks'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_34_b1c2da30-2517-476c-ac04-cb133a0d75ec.jpg?v=1760426410',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_47.jpg?v=1760426410',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_53.jpg?v=1760426410',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_48.jpg?v=1760426410',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_a93fbc97-0e38-436e-8b03-c714f6ef88a0.jpg?v=1760426410'
    ],
    description: 'Step into superior comfort and performance with playR Socks, engineered for men who demand more from their daily essentials. Whether you\'re hitting the gym, dominating the cricket pitch, running errands, or simply relaxing at home, these socks are built to support your every move. Crafted from high-quality, soft cotton Blend fabric, these socks deliver unbeatable breathability and a naturally gentle feel against your skin. Cotton’s moisture-absorbing properties help wick away sweat, keeping your',
    details: ['All-Day Comfort, Built to Perform: Made with a High Quality cotton blend, these socks are ultra-soft, breathable, and designed for all-day wear. Perfect for Cricket, running, walking, or casual everyday use.', 'Anti-Slip & Supportive Fit: Elasticated arch support and anti-slip design provide a secure grip and prevent sliding or bunching during intense workouts, keeping your focus where it should be — on performance.', 'Breathable & Moisture-Wicking: Stay fresh and dry with mesh ventilation panels that allow airflow and wick away sweat, making these socks ideal for training, running, and sports in all seasons.', 'Durable & Skin-Friendly: Reinforced heel and toe add durability, while the smooth seams prevent irritation — great for sensitive skin and long-lasting comfort.'],
  },
  {
    handle: 'prl24-171-1',
    title: 'Crew Jogger',
    price: 1999, compareAt: null,
    type: 'Jogger',
    collections: ['bottomwear', 'fitness-gym-yoga', 'lifestyle-after-sports', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_672c9e00-9ee7-4bdd-af98-1f4895cbb89f.jpg?v=1767381381',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_2325ce85-5c6b-4176-b31b-2551c01962b9.jpg?v=1767381381',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_6b83202c-bf58-49c4-8a5d-03edc8b7183a.jpg?v=1767381381',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_a1e3d868-8a94-430e-980f-6f684f7a53d0.jpg?v=1767381381',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_6dc7c025-dda1-4716-9d6b-43522928e4ea.jpg?v=1767381381'
    ],
    colors: ['Airforce', 'Grey', 'Olive'],
    description: 'Elevate your casual wardrobe with the playR Men\'s Lifestyle Adult Crew Jogger Track Pant. Designed for comfort and versatility, these track pants are perfect for any season. FLEXVENT with high-quality polyester, they provide a regular fit that effortlessly combines style and functionality. Whether you\'re heading to the gym, running errands, or lounging at home, these joggers are your go-to choice for a relaxed yet fashionable look.',
    details: ['Engineered with FLEXVENT and Micro-Fiber Comfort: These joggers are crafted using FLEXVENT design principles and ultra-soft micro-fiber threads that promote dynamic airflow and enhanced stretch, ensuring maximum freedom of movement whether you\'re hitting the gym or lounging. The combination of High micro-fibers and durable polyester offers a luxurious feel against the skin while maintaining high tensile strength for long-lasting use.', 'Sweat-Release & Moisture-Wicking Fabric for Ultimate Dryness: Featuring advanced Sweat-Release and moisture-wicking, these joggers actively pull sweat away from the body and dry rapidly, keeping you cool and dry throughout intense workouts or during long commutes. The quick-dry polyester blend enhances ventilation and prevents discomfort caused by dampness or odor buildup.', 'Highly Breathable & Skin-Friendly for All-Day Comfort: Designed to prioritize breathability, the joggers use skin-friendly, anti-static material that reduces friction and irritation. Whether you\'re running errands or engaging in outdoor activities, the breathable mesh-like weave ensures consistent airflow and optimal body temperature regulation even in warm weather conditions.', 'Supportive Regular Fit with Adjustable : Styled in a regular fit that strikes the perfect balance between relaxed and structured, these joggers adapt to your natural shape without clinging or sagging. support and personalized fit, allowing unrestricted movement during sports or daily wear.'],
  },
  {
    handle: 'psjgr-135-1',
    title: 'Astor Jogger',
    price: 999, compareAt: null,
    type: 'Jogger',
    collections: ['bottomwear', 'fitness-gym-yoga', 'lifestyle-after-sports', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_b74d756d-7259-432a-811a-1b40594c6302.jpg?v=1767382074',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_6dd2d3d1-e5d9-47ac-9b3d-d892b65fff90.jpg?v=1767382074',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_81eafe6d-8e3e-4480-9cad-b57df78df586.jpg?v=1767382074',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_1c0ef1ae-a4fb-4b5b-b6bd-47a225a33b9a.jpg?v=1767382074',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_1d94e011-75f6-43f8-987d-696486a8f388.jpg?v=1767382074'
    ],
    colors: ['Black', 'Dark Grey', 'Forest Green', 'Navy Blue', 'Teal Blue'],
    description: 'The playR Track Pant is designed for ultimate comfort and performance. Ideal for workouts, casual wear, or athletic activities, these 92% Polyester 8% Spandex track pants offer a perfect fit and excellent flexibility. With FLEXVENT - Featuring an ergonomic design, they provide maximum freedom of movement, making them perfect for both intense training sessions and everyday use. The functional pockets add convenience, while the modern design ensures a stylish look. Whether you\'re hitting the gym o',
    details: ['Engineered for Active Performance : Step into your workout zone with joggers built for motion. Whether you\'re out for a morning run, sweating it out at the gym, or just chilling post-workout, these joggers deliver the perfect balance of performance and comfort. The regular fit allows for full range of motion, while the tapered legs offer a modern silhouette that looks as good as it feels. Ideal for cardio, strength training, stretching, or travel.', 'FLEXVENT Polyester Fabric : Crafted from FLEXVENT high-performance polyester, this jogger is ultra-light and breathable, making it perfect for high-intensity workouts or long hours of wear. The moisture-wicking, draws sweat away from your skin, keeping you dry, fresh, and odor-free even during your toughest sessions. No stickiness, no distractions — just next-level comfort all day.', 'Tailored Regular Fit with Smart Taper : Designed with a flattering regular fit and a slightly tapered cut toward the ankle, these joggers bring together athletic function and street-ready style. The silhouette flatters most body types, offering a clean and structured look that’s equally great for workouts or casual wear. Not too loose, not too tight — just the right fit for all-day confidence.', 'All-Season Wearability : Made to adapt to every season, this jogger is your go-to piece no matter the weather. The breathable fabric keeps you cool during summer, while its layering-friendly design makes it cozy enough for winter workouts. Whether you’re running under the sun or stretching in a cold studio, this jogger performs without compromise.'],
  },
  {
    handle: 'prckt-pro-lower',
    title: 'playR Cricket Lower',
    price: 1299, compareAt: null,
    type: 'Pants',
    collections: ['bottomwear', 'cricket', 'fitness-gym-yoga', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_9.jpg?v=1756795992',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_7.jpg?v=1756795992',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_7.jpg?v=1756795992',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_7.jpg?v=1756795992'
    ],
    description: 'Step onto the pitch or into your training session with confidence in the playR Unisex Adult Cricket Lower in classic White. Engineered for all-season versatility, this lower is designed with advanced FLEXVENT, offering maximum breathability, sweat-wicking performance, and unrestricted movement. This material keeps you dry and comfortable, efficiently managing moisture during intense matches, workouts, or casual wear. Its Flex Regular Fit design ensures a balanced, athletic silhouette that moves ',
    details: ['All-Season Wear: Perfect for any weather, these joggers are breathable and moisture-wicking to keep you cool and dry in the summer, while providing enough warmth in cooler conditions.', 'Unisex Design for All-Day Comfort and Universal Fit: Thoughtfully crafted with a versatile silhouette, this lower is designed to suit both men and women, offering a comfortable, flattering fit for a wide range of body types. Its unisex construction ensures ease of movement and balanced flexibility, making it an ideal choice for athletes, fitness enthusiasts, and casual wearers alike. Whether you\'re gearing up for a cricket match, a workout session, or relaxed weekend wear, this lower delivers reliable performance and effortless style that works for everyone.', 'Durable, High-Performance Polyester Fabric: Expertly constructed from High-grade polyester, these joggers are engineered to endure the demands of intense training sessions, competitive matches, and daily activewear. The fabric offers outstanding durability while maintaining a lightweight, breathable feel, ensuring you stay cool and comfortable through every sprint, stretch, and workout.', 'Comfortable, Customizable Fit with Flexible Waistband: Designed for all-day ease and performance, these joggers feature a flexible elastic waistband combined with an adjustable drawstring, allowing you to customize the fit to your personal comfort. Whether you prefer a relaxed or snug feel, this thoughtful design ensures a secure, stay-in-place fit through every movement — from gym routines and cricket practice to casual lounging.'],
  },
  {
    handle: 'prjgr23-150-1',
    title: 'Essential Lowers',
    price: 1499, compareAt: null,
    type: 'Pants',
    collections: ['bottomwear', 'fitness-gym-yoga', 'lifestyle-after-sports', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_10.jpg?v=1767380727',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_8.jpg?v=1767380727',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_8.jpg?v=1767380727',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_8.jpg?v=1767380727',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Copy_of_1_1_1598775d-0b0b-4a96-8dbd-bf6c0210df3e.jpg?v=1767380727'
    ],
    colors: ['Dark Grey', 'Light Grey', 'Navy'],
    description: 'Elevate your running and training wardrobe with the playR Men Adult Running Essential Lowers — designed to deliver the perfect combination of comfort, flexibility, and all-weather performance. Featuring cutting-edge FLEXVENT, these joggers actively wick away moisture, keeping you cool and dry through even the most demanding workouts. The fabrics ensure unmatched mobility and all-day comfort, making these lowers your reliable go-to for everything from intense running sessions to relaxed weekend o',
    details: ['Advanced FLEXVENT Moisture Management: Stay dry, fresh, and focused throughout your runs and training sessions. This high-performance fabric actively pulls sweat away from your skin and promotes rapid evaporation, keeping you cool and comfortable even during intense workouts or long-distance runs.', 'Dry-Fit Stretch & Dry-Tech Fabric for Maximum Flexibility: Engineered with Dry-Fit Stretch and Dry-Tech Stretch fabrics, these lowers offer a perfect blend of flexibility, breathability, and durability. The stretchable material moves effortlessly with your body, providing unrestricted motion for running, gym training, yoga, or casual wear — making them ideal for all-season active lifestyles.', 'Comfortable Regular Fit with Adjustable Waistband: Designed for both performance and ease, these lowers feature a flexible elastic waistband with an adjustable drawstring to deliver a secure, customizable fit. The regular fit silhouette offers balanced comfort and support without compromising on style, ensuring you stay comfortable through every activity.', 'Durable Polyester Construction for Long-Lasting Wear: Crafted from High-quality polyester, these running lowers are built to withstand regular training, running, and outdoor activities. The durable, fade-resistant fabric retains its shape and color, ensuring long-lasting performance, wash after wash.'],
  },
  {
    handle: 'prsknlr23-154-1',
    title: 'Skin Pants',
    price: 1499, compareAt: null,
    type: 'Skin Pants',
    collections: ['fitness-gym-yoga', 'innerwear', 'lifestyle-after-sports', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Copy_of_1_529e0cb3-8a63-461b-a670-88d73ef750a3.jpg?v=1770793768',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Copy_of_2_27f4cc2d-25e9-494f-9ff3-eb4ecaf7693e.jpg?v=1770793768',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Copy_of_3_ed9413de-57dc-4b65-829c-7518ad63ae96.jpg?v=1770793768',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Copy_of_4_74a5393c-97e4-4362-9e2c-fb5c84415533.jpg?v=1770793768',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRSKNLR23-154-3-1.jpg?v=1770793768'
    ],
    colors: ['Black', 'Navy', 'White'],
    description: 'Elevate your activewear essentials with the playR Men Adult Training Skin Pant, designed for athletes and fitness enthusiasts who value style, comfort, and durability. Crafted from High Quality polyester Blend, these skin-fit track pants offering breathability, flexibility, and moisture-wicking performance for intense training or daily wear. The regular fit and elastic waistband provide a snug yet relaxed feel, making them suitable for gym workouts, running, sports, or casual outings. With a lig',
    details: ['All-Season Comfort: Engineered with Dry-Fit Stretch, and Dry-Tech Stretch, these training skin pants keep you cool in summer and comfortably insulated during cooler months, making them perfect for year-round wear.', 'Regular Fit: Designed with a balanced regular fit that offers a sleek, modern look without restricting movement — ideal for diverse body types and fitness levels, providing both comfort and confidence during any activity.', 'Durable Polyester Fabric: Made from high-quality, lightweight polyester Blend, these pants are built to last through intense workouts, running sessions, and casual wear. The fabric resists wrinkles and shrinking while maintaining its shape and feel.', 'Multipurpose Versatile Design: Perfectly suited for gym sessions, training, running, sports practice, or casual lounging — these joggers are an essential wardrobe staple for active men who demand both style and functionality.'],
  },
  {
    handle: 'prsknsht23-155-1',
    title: 'Skin Shorts',
    price: 1199, compareAt: null,
    type: 'Skin Shorts',
    collections: ['fitness-gym-yoga', 'innerwear', 'lifestyle-after-sports', 'running-training'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_9_8bf4886a-4173-4fae-815e-82b29d0a79ca.jpg?v=1767389805',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_6_dd2952d4-eb09-4138-98a2-0dcce5fcc567.jpg?v=1767389805',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_6_a5f0be5e-8a21-428b-a9b9-777b5ab2699f.jpg?v=1767389805',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_7_139f650f-b743-4686-a81e-855939b74c35.jpg?v=1767389805',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_5_9523ac8f-dd08-42ce-b83a-e11220537cf4.jpg?v=1767389805'
    ],
    colors: ['Black', 'Navy', 'White'],
    description: 'Introducing the playR Men Adult Skin Shorts, designed for ultimate comfort and performance throughout the year. These regular fit shorts are crafted from high-quality polyester blend and ensuring durability and a smooth, lightweight feel against your skin. Whether you\'re hitting the gym, going for a run, or simply lounging at home, these versatile shorts are your go-to choice for any activity.perfect for the demands of everyday activewear.',
    details: ['All-Season Wear: Designed to be worn comfortably throughout the year, keeping you cool in the summer and warm in the winter.The breathable and absorbent fabric enhances airflow and wicks away moisture, making them a reliable choice for every climate.', 'Regular Fit: Offers a relaxed yet tailored look, making it suitable for various body types and ensuring a comfortable fit.the ergonomic design ensures comfort and confident wear.', 'FLEXVENT High-Quality Polyester: Made from High Quality polyester Blend fabric that is durable, lightweight, and resistant to wrinkles and shrinking.', 'Versatile Design: Ideal for a variety of activities including casual outings, sports, gym sessions, or simply lounging at hometheir versatile style and functionality make them a wardrobe essential.'],
  },
  {
    handle: 'prats25-513-1',
    title: 'Astor Tracksuit',
    price: 2899, compareAt: null,
    type: 'Track Set',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'suit'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/6_92cd8667-64c9-4b1f-8f27-3efe7a9a3256.jpg?v=1769687510',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_537427d0-b4f2-4a5b-98e3-489c86d5225c.jpg?v=1769687510',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_de1b8dab-fd84-4722-b671-224d07d7e7a8.jpg?v=1769687510',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_88c340ed-ee0d-4932-8859-900658b39836.jpg?v=1769687510',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_99e4f67c-246f-469a-9112-66edaf885005.jpg?v=1769687510'
    ],
    colors: ['Black', 'Dark Grey', 'Teal'],
    description: 'The playR Astor Tracksuit is designed for men who want comfort, flexibility, and an all-day active fit. Made with a high-quality blend of 92% polyester and 8% spandex, this daily wear men’s tracksuit delivers the perfect balance of stretch, breathability, and durability. It functions as a workout tracksuit for gym sessions, a running tracksuit for outdoor activity, and a reliable training suit who demand performance during every routine. The lightweight fabric combined with its athletic silhouet',
    details: ['✔️ Comfortable & Stylish Tracksuit :The playR Astor Track suit delivers a comfortable, Lightweight designed for training, running, gym sessions, and daily wear with a flexible stretch fit.', '✔️ Designed for Activewear Performance : This outfit supports movement, agility, and all-season comfort, making it ideal for workouts, warm-ups, and active routines.', '✔️ Perfect Men’s Athleisure & Daily Style : A great choice for men’s athleisure, offering a modern sporty look that fits seamlessly as sportswear or casual clothing for everyday activities.', '✔️ Ideal Gym & Fitness Wear : Works perfectly as gym clothes for men prefer for training and is reliable fitness wear use for high-energy activities like running, cardio, and strength workouts.'],
  },
  {
    handle: 'prckt-club-set-jr',
    title: 'playR Cricket Set Junior',
    price: 1699, compareAt: null,
    type: 'Track Set',
    collections: ['cricket', 'running-training', 'suit'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRCKT-CLUB-SET-JR3.jpg?v=1770841661',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRCKT-CLUB-SET-JR1.jpg?v=1770841661',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRCKT-CLUB-SET-JR2.jpg?v=1770841661'
    ],
    description: 'The playR Unisex-Kids Cricket Set Junior Regular Fit Polyester Crafted from DRIVENT for All Season is the ideal choice for young cricket enthusiasts. Designed to be worn in any weather, this set is made from high-quality polyester, ensuring comfort and durability. The regular fit provides ample room for movement, allowing kids to play freely and confidently. This cricket set includes a shirt and trousers, both crafted to with stand the rigors of the game while maintaining their shape and Comfort',
    details: ['All-Season Versatility: The playR cricket set is designed for year-round use, making it suitable for all weather conditions. Whether it\'s a hot summer day or a chilly autumn afternoon, the breathable polyester fabric ensures that young players stay comfortable. The material wicks away sweat, keeping the body dry and cool during intense matches.', 'Durable Polyester Fabric: Crafted from high-quality polyester, the playR cricket set is built to last. This durable material is resistant to wear and tear, making it ideal for active kids who play hard. The fabric holds up well against frequent washing, maintaining its shape, color, and integrity over time. Polyester is also lightweight, allowing for easy movement and agility on the field.', 'Regular Fit for Comfort: The playR cricket set features a regular fit design that provides a comfortable and relaxed feel. This fit allows for a full range of motion, crucial for executing cricket shots and fielding plays. The shirt and trousers are designed to be neither too tight nor too loose, offering the perfect balance of comfort and functionality. Elasticated waistbands and adjustable features ensure a secure fit without restricting movement.', 'Unisex Design for Boys and Girls: With its unisex design, the playR cricket set is suitable for both boys and girls. The versatile design caters to all junior players, making it a great option for mixed-gender teams and training sessions. The stylish and neutral color scheme appeals to kids of all preferences, ensuring everyone feels confident and proud wearing the set.'],
  },
  {
    handle: 'prhd24-180-1',
    title: 'Crew Hood',
    price: 2999, compareAt: null,
    type: 'Hoodie',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled_design_27.jpg?v=1767966705',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_41ea9674-078f-43fa-b476-37b8bbafaee8.jpg?v=1767966705',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_9ca8c421-eabf-497c-b776-f67514f45019.jpg?v=1767966705',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_94a08d8b-7029-46f4-bad7-b18bf63ba806.jpg?v=1767966705',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_a4e0e0a1-f5d9-4f26-9dc8-cbf226def449.jpg?v=1767966705'
    ],
    colors: ['Grey', 'Olive'],
    description: 'Elevate your casual wardrobe with the playR Men Lifestyle Crew Hood Regular Fit Polyester blend Hoodie, designed to offer both comfort and style for the fall and winter seasons. Crafted from high-quality polyester, this hoodie provides excellent durability and warmth, making it a perfect addition to your seasonal wardrobe. The regular fit design ensures a comfortable and relaxed feel, while the crew hood adds a trendy touch to your look. Whether you\'re heading out for a workout, running errands,',
    details: ['Versatile Everyday Hoodie for Men Who Live in Motion : Crafted for the modern man, this playR hoodie combines laid-back street style with practical comfort. Whether you\'re running errands, meeting friends, traveling, or heading to college, this hoodie fits seamlessly into your routine. The crew hood design adds a sporty, contemporary edge that effortlessly pairs with joggers, denim, or even layered under jackets. It’s not just a hoodie — it’s your go-to piece for casual confidence every day of the week.', 'Polyester blend Fabric – Lightweight, Soft & Travel-Friendly : Made with high-quality polyester, this hoodie brings together the perfect balance of warmth, softness, and breathability. Unlike cotton hoodies that can feel bulky or trap moisture, this piece stays dry, dries fast, and retains its shape over time. It’s ideal for men who are always on the go and need clothes that can keep up — whether you\'re commuting, hitting the gym, or just chilling at home.', 'Micro-Fiber Fabric with Advanced Sweat Management: Feature high-performance micro-fiber fabric that is ultra-breathable, quick-drying, and moisture-wicking. The sweat-release mechanism ensures you stay cool and dry during intense workouts. Anti-static properties reduce friction, while the skin-friendly construction provides all-day comfort—even during high-movement activities or hot weather.', 'Essential Layer for Fall & Winter Seasons : This hoodie is a seasonal must-have — lightweight enough for autumn, and warm enough for chilly winter mornings. It offers great insulation when worn under a jacket, yet stands strong as a solo piece on cool days. From bonfire nights to airport lounges, this pullover ensures you stay comfortable and stylish all through the colder months. It’s breathable, non-clingy, and keeps you looking effortlessly put-together.'],
  },
  {
    handle: 'prup24-182-3',
    title: 'Astor Jacket',
    price: 1999, compareAt: null,
    type: 'Jacket',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_2f0816b1-64dd-4d09-a887-bd30de9b849a.jpg?v=1767560164',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_0d647ec8-c4f4-4ece-99df-36aa8bf4354c.jpg?v=1767560224',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_c0b08a6d-fe43-4fac-aa5c-7784fdb6ebb5.jpg?v=1767560224',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_44ce3733-744f-4bde-999c-9fb31594a8b2.jpg?v=1767560224',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_113404e2-8022-425e-8ac5-eb35281ddec2.jpg?v=1767560224'
    ],
    colors: ['Black', 'DK Grey', 'Dk Grey', 'Teal'],
    description: 'The playR Astor Men\'s Jacket is designed to move with you—from your early morning workouts to casual evenings out. FLEXVENT with lightweight, breathable polyester, it keeps you warm without weighing you down. Its regular fit ensures easy layering, while the mock collar and full zip closure provide extra protection against the cold. Whether you\'re hitting the gym, heading for a jog, or simply relaxing, this jacket offers the perfect mix of style, comfort, and functionality. Built to handle fall a',
    details: ['Regular Fit for Everyday Comfort – The playR Astor Jacket offers a clean, modern silhouette with a regular fit that provides comfort during workouts or daily routines.', 'Lightweight and Warm Polyester Fabric – FLEXVENT with High-quality polyester, this jacket is breathable, moisture-resistant, and perfect for fall and winter layering.', 'Mock Collar with Zip Closure – Features a stylish mock neck and secure front zip to help block wind and retain warmth during outdoor activities.', 'Versatile Use for Active and Casual Wear – Ideal for gym, running, travel, or casual outings—this jacket is built to match your active lifestyle.'],
  },
  {
    handle: 'pwjkt22-134-1',
    title: 'Tron Jacket',
    price: 1999, compareAt: null,
    type: 'Jacket',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_7cf8d5ee-f738-4386-b87a-43ccb2912b44.jpg?v=1756796541',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_af133807-27eb-4c24-9512-fa56c10651ad.jpg?v=1756796541',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_e7c7676d-b971-4dd3-93ba-8f70743061c3.jpg?v=1756796541',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_661ab113-64a2-4b84-b504-9be9f11b2026.jpg?v=1756796541',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_fd51f3e7-2a78-4ae0-a67b-94601c549aa4.jpg?v=1756796541'
    ],
    description: 'Introducing the playR Tron Jacket After Sport — an advanced, high-performance jacket built for athletes and active individuals who demand protection, comfort, and versatility in all weather conditions. Styled in a sharp colorway and crafted with cutting-edge DRIVENT, Dry-Fit, and Dry-Tech, this jacket is designed to perform. Whether you’re cooling down after a workout, heading out on a hike, or braving unpredictable weather, the Tron Jacket delivers exceptional moisture-wicking, breathability, a',
    details: ['Multi-Weather Protection with DRIVENT, Dry-Fit & Dry-Tech Layers : Built to tackle changing climates, this jacket’s advanced fabric work together to create a windproof, water-resistant shell that keeps you dry in light rain while its inner layers wick away sweat and regulate body temperature.', 'Perfect After Sport Layer for Recovery and Casual Wear: The playR Tron Jacket was thoughtfully designed for athletes seeking a reliable, lightweight jacket to wear after training, runs, or workouts. Its ergonomic, non-restrictive fit ensures ease of movement, making it ideal for warm-ups, cooldowns, or as a casual streetwear staple on off-days. It’s the one jacket you’ll reach for before and after every session.', 'Breathable, Quick-Drying, and Lightweight Comfort: Featuring Dry-Fit and Dry-Tech moisture management systems, this jacket actively draws sweat away from the skin while allowing airflow to circulate, keeping you cool and dry. The lightweight fabric ensures a barely-there feel, reducing bulk and heat retention, making it suitable for layering in colder months or wearing solo in spring and autumn.', 'Sleek Athletic Fit with Contemporary Styling: Tailored to complement an active silhouette, the Tron Jacket features an athletic cut with articulated sleeves and modern design lines. while adjustable elements and zippered pockets enhance both function and style.'],
  },
  {
    handle: 'spr-mp-101-1',
    title: 'Milan jacket',
    price: 4499, compareAt: null,
    type: 'Jacket',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled-1_4.jpg?v=1768545598',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled-2_4.jpg?v=1768545598',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled-4_3.jpg?v=1768545598',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled-5_3.jpg?v=1768545598',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled-2_7.jpg?v=1768545598'
    ],
    colors: ['Black', 'Blue', 'Green', 'Khaki'],
    description: 'The playR STREET Milan City Series Jacket is built with a 100% polyester shell and 100% polyester lining that feels light, smooth, and easy to wear through long winter days. Its lightweight, comfortable, smooth finish, easy care, wind-resistance, soft interior and versatile, keeping you comfortable during work, travel, and daily movement. it\'s giving you a relaxed feel even when layered over winter clothes. it reliable in cold or slightly humid weather. Designed for men who prefer a clean street',
    details: ['✔️ Lightweight Comfort with Soft Interior Feel : Made with a 100% polyester shell and lining, this men’s jacket feels light on the body while offering a soft interior touch for daily comfort. It’s ideal for long city travel, daily wear, and men’s winter wear without making you feel bulky or heavy.', '✔️ Easy-Care, Smooth Finish : The smooth finish polyester fabric gives the jacket a clean, refined look while being easy to care for in daily use. It\'s built for long-term use. This makes it a low-maintenance jacket for regular office wear, travel, and everyday routines.', '✔️ Stylish & Versatile for Everyday Lifestyle : Designed to match different looks, this modern jacket works well for travel, casual outings, street wear, coffee runs, and daily city life. the playR Milan Warm Jacket adapts effortlessly. Its stylish design and versatile nature make it easy to pair with t-shirts, hoodies, jeans, or sneakers, giving you a balanced and modern everyday outfit.', '✔️ Durable & Wind-Resistant Layer : The strong polyester outer shell offers good durability with basic wind resistance, making it suitable for mild cold, breezy evenings, and urban weather conditions. this men\'s zip jacket works as a reliable for office use, outdoor plans.'],
  },
  {
    handle: 'spr-ppj-102-1',
    title: 'Paris jacket',
    price: 4999, compareAt: null,
    type: 'Jacket',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/third.jpg?v=1768547057',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/fifth.jpg?v=1768547057',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2nd_8829a5c3-2b85-411d-804d-63466f0986a5.jpg?v=1768547057',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/fourth.jpg?v=1768547057',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/frontimage_jpg.jpg?v=1768547057'
    ],
    colors: ['Green', 'Grey', 'Khaki'],
    description: 'The playR STREET Paris City Series Hooded Jacket is designed to give you steady comfort through daily winter routines with ottoman textured fabric. Its shell blends 45% PU and 55% polyester for strength, while the 100% polyester lining stays soft and comfortable for long hours of wear. The jacket keeps you warm without adding weight, making it easy to use for travel, office, or regular city movement. Its hooded streetwear look works well with casual outfits and layered winter clothes. The fabric',
    details: ['✔️ Soft & Comfort Features : This jacket is made with ottoman fabric and 45% PU + 55% polyester shell and 100% polyester lining, giving you a durable, soft-lining, warm, lightweight, skin-friendly, and comfort-fit experience—perfect for anyone looking for a reliable men’s fall winter jacket for everyday use.', '✔️ Durable & Lightweight for Daily Comfort : This Durable jacket stays strong on the outside and light on the body, giving you smooth, easy comfort whether you\'re traveling, stepping out in the city, or layering up for winter.', '✔️ Travel-Ready & Easy to Carry : Compact and light enough for backpack or luggage, this jacket is ideal for metro rides, weekend getaways, or city travel without adding bulk or burden. giving you steady insulation during cold days.', '✔️ Stylish & Versatile for Everyday Lifestyle : Designed to match different looks, this modern jacket works well for travel, casual outings, street wear, coffee runs, and daily city life. the playR Milan Warm Jacket adapts effortlessly. Its stylish design and versatile nature make it easy to pair with t-shirts, hoodies, jeans, or sneakers, giving you a balanced and modern everyday outfit.'],
  },
  {
    handle: 'prp23-137-1',
    title: 'Dirk Polo',
    price: 1299, compareAt: null,
    type: 'T-Shirt Polo',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_b7594f9b-3e55-438c-9d46-d0e4cca27722.jpg?v=1767390485',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_3ac9bf55-1a91-4b85-bc90-8a2212968d9e.jpg?v=1767390485',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_9093cde7-059e-4442-a916-f5c04ac745e5.jpg?v=1767390485',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_35be99a8-55a8-4763-a4dc-fe1b488cdd5c.jpg?v=1767390485',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_df07a298-3e3a-4c4e-9537-f1eb68bc01ab.jpg?v=1767390485'
    ],
    colors: ['Navy', 'Royal'],
    description: 'playR Men’s Solid Dirk Polo T-Shirt is built for movement, made for effortless style, and designed to perform in any setting. Crafted from high-quality, all-season polyester fabric, this polo offers a perfect balance of durability, stretch, and moisture-wicking to keep you feeling fresh and comfortable all day long. The regular fit cut delivers a flattering, athletic without restricting movement, making it an essential addition to every active wardrobe. Whether you’re hitting the gym, playing a ',
    details: ['Crafted with high-grade polyester, this polo t-shirt is engineered to deliver breathable comfort and maximum flexibility. Its advanced moisture-wicking DRIVENT efficiently pulls sweat away from your skin, keeping you cool and dry during intense summer workouts while offering light insulation for comfort in cooler weather — making it the perfect all-season choice for training, sports, gym sessions, and casual wear.', 'Regular Fit with Polo Neck : Engineered for a relaxed & comfortable this solid polo t-shirt comes with a regular fit cut that suits all body types. The classic polo collar with button placket adds a refined touch, letting you switch seamlessly from workouts to meet-ups without compromising comfort or style.', 'Ideal for Multiple Activities : Whether you’re at the gym, going for a run, on the court, or simply heading out for the day, this versatile t-shirt performs under pressure. It offers maximum breathability and mobility, making it ideal for football, cricket, badminton, or a casual hangout.', 'Low Maintenance, Quick Dry : Say goodbye to ironing and long drying times. This t-shirt is machine washable, wrinkle-resistant, and quick-drying — perfect for men who are always on the move. It maintains shape and color even after multiple washes, saving you time and effort.'],
  },
  {
    handle: 'prp23-141-1',
    title: 'Golfer Polo',
    price: 1299, compareAt: null,
    type: 'T-Shirt Polo',
    collections: ['fitness-gym-yoga', 'golf', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard_4.jpg?v=1774959546',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard_5.jpg?v=1774959546',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard_3.jpg?v=1774959546',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard_2_c980cd7d-a47a-4aaa-b555-3113b8c01004.jpg?v=1774959546',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRP23-141-3_1_c69279b8-770f-40ec-aaaf-40d553e4159b.jpg?v=1774959417'
    ],
    colors: ['Anthra', 'Navy', 'Off White', 'Red', 'White'],
    description: 'Introducing the playR Men Solid Golfer Polo T-shirt, designed for both style and performance. This regular fit, all-season polo is crafted from 100% cotton, ensuring comfort and breathability during your game. The classic polo neck design and solid color make it a versatile addition to any wardrobe, perfect for both on and off the golf course. Whether you\'re teeing off or enjoying a casual day out, this polo shirt combines functionality with timeless fashion. Upgrade your activewear collection w',
    details: ['COTTON FABRIC FOR MAXIMUM COMFORT : Crafted from high-grade cotton, this polo t-shirt is lightweight, breathable, and perfect for extended wear. Whether you\'re on the golf course or at a casual hangout, the soft fabric ensures day-long comfort without compromising on performance.', 'SOLID DESIGN WITH MODERN FUNCTIONALITY : Featuring a solid pattern and polo neck collar with button placket, this t-shirt delivers a timeless, elegant look while ensuring ease of movement. Perfect for both sporty activities and everyday casual wear.', 'REGULAR FIT FOR A RELAXED YET TAILORED LOOK : The regular fit is designed to suit all body types, giving you room to move while maintaining a structured silhouette. Ideal for golf, gym, walking, casual wear, and travel.', 'ALL-SEASON WEARABILITY: Designed to be worn year-round, the fabric keeps you cool in summer and provides a comfortable layer during cooler months. A perfect wardrobe staple for every season.'],
  },
  {
    handle: 'prp23-142-1',
    title: 'Basico',
    price: 1199, compareAt: null,
    type: 'T-Shirt Polo',
    collections: ['fitness-gym-yoga', 'lifestyle-after-sports', 'running-training', 'topwear'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_c5189a95-d87d-420e-8d25-9371c91c564f.jpg?v=1756796126',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_76c2c40c-aac0-4ece-928f-0f6884d980e6.jpg?v=1756796126',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_e19ee196-379a-4700-a88c-c982f6792576.jpg?v=1756796126',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_3d027847-8e91-40f3-abcd-61cb0e850814.jpg?v=1756796126',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_63f51be2-d2c0-49b3-a679-0defc76da489.jpg?v=1756796127'
    ],
    colors: ['Blue Melange', 'D.K Green', 'Grey Melange', 'White'],
    description: 'Elevate your everyday style with the playR Men Solid Lifestyle Basico Polo T-shirt. This regular fit polo combines comfort and sophistication, making it a versatile addition to your wardrobe. Crafted from a blend of cotton and polyester, this polo shirt is designed to keep you comfortable and stylish in all seasons. The classic polo neck and solid color ensure a timeless look that pairs effortlessly with jeans, chinos, or shorts. Whether you\'re heading to a casual outing or a relaxed day at work',
    details: ['Cotton Blend with All-Season Comfort: Crafted using high-quality, absorbent cotton-blend fabric, this polo t-shirt ensures all-day comfort in any season. Whether you\'re working out in the summer heat or layering up in cooler months, the fabric adapts to your body\'s needs—keeping you dry, fresh, and active.', 'Regular Fit with Athletic Elegance: Designed in a regular fit that flatters a wide range of body types, this half-sleeve polo offers an ideal blend of structured style and relaxed wearability. Its tailored silhouette provides a polished, athletic look—perfect for both performance and casual outings.', 'Breathable & Sweat-Release Fabric : With enhanced ventilation and moisture-wicking capabilities, the Basico Polo helps manage sweat efficiently during training or sports. Its breathable weave promotes airflow, preventing overheating and offering superior comfort even during intense physical activity.', 'Hypo-Allergenic & Skin-Friendly Material: Ideal for sensitive skin, the t-shirt features hypo-allergenic properties and a smooth texture that reduces irritation and friction. The soft, skin-friendly finish ensures chafe-free movement, making it suitable for prolonged wear during workouts or day-to-day routines.'],
  },
  {
    handle: 'kbt-1001',
    title: 'Player Kit Bag',
    price: 6999, compareAt: null,
    type: 'Kitbag',
    collections: ['bag', 'cricket'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_32.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_29.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_28.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_25.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_31.jpg?v=1767378432'
    ],
    description: 'Take your cricket game on the road with the playR Cricket Kit Bag - KBT-1001, your ultimate companion for matches, training, and travel. This kit bag combines durability with moisture-resistance, ensuring your gear stays protected and organized. Its spacious main compartment, multi-functional pockets, and dedicated bat holder give you plenty of room for everything from pads and helmets to shoes and water bottles. The padded straps and ergonomic handle make carrying comfortable and effortless. Bu',
    details: ['Heavy-Duty Construction: Built with high-grade, this cricket kit bag ensures exceptional durability, tear resistance, and weather protection. Designed to endure the demands of frequent travel, training sessions, and tough match days.', 'Spacious Multi-Compartment Storage: Thoughtfully designed with a large main compartment, multiple side pockets, and a separate bat holder, it offers ample space for carrying all your cricket gear — including pads, gloves, helmets, shoes, bottles, and personal essentials — keeping everything organized and easily accessible.', 'Comfortable & Ergonomic Carry Design: Featuring padded, adjustable shoulder straps and a cushioned grab handle, this kit bag provides multiple convenient carrying options for players on the move. The ergonomic design reduces strain and ensures easy transport, even when fully loaded.', 'Quick-Dry & Moisture-Resistant Fabric: The fabric helps repel sweat and dampness while promoting airflow, keeping your cricket gear dry and fresh during intense sessions and unpredictable weather.'],
  },
  {
    handle: 'kbt-1002',
    title: 'Player Kitbag',
    price: 6999, compareAt: null,
    type: 'Kitbag',
    collections: ['bag', 'cricket'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_32.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_29.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_28.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_25.jpg?v=1767378432',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_31.jpg?v=1767378432'
    ],
    description: 'Take your cricket game on the road with the playR Cricket Kit Bag - KBT-1002, your ultimate companion for matches, training, and travel. This kit bag combines durability with moisture-resistance, ensuring your gear stays protected and organized. Its spacious main compartment, multi-functional pockets, and dedicated bat holder give you plenty of room for everything from pads and helmets to shoes and water bottles. The padded straps and ergonomic handle make carrying comfortable and effortless. Bu',
    details: ['Heavy-Duty Construction: Built with high-grade, this cricket kit bag ensures exceptional durability, tear resistance, and weather protection. Designed to endure the demands of frequent travel, training sessions, and tough match days.', 'Spacious Multi-Compartment Storage: Thoughtfully designed with a large main compartment, multiple side pockets, and a separate bat holder, it offers ample space for carrying all your cricket gear — including pads, gloves, helmets, shoes, bottles, and personal essentials — keeping everything organized and easily accessible.', 'Comfortable & Ergonomic Carry Design: Featuring padded, adjustable shoulder straps and a cushioned grab handle, this kit bag provides multiple convenient carrying options for players on the move. The ergonomic design reduces strain and ensures easy transport, even when fully loaded.', 'Quick-Dry & Moisture-Resistant Fabric: The fabric helps repel sweat and dampness while promoting airflow, keeping your cricket gear dry and fresh during intense sessions and unpredictable weather.'],
  },
  {
    handle: 'pr-pbr-40',
    title: 'Pickleball Professional Precise 40 Hole Rotational No Seam PE 74mm',
    price: 299, compareAt: null,
    type: 'Pe',
    collections: ['ball', 'pickleball'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_8bf37df1-bc2e-4c70-ab2c-1d44aea31200.jpg?v=1771058376',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/asdccccccccc.jpg?v=1771058376',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Minimalist_premium_product_4k_202602101714-2.jpg?v=1771058376',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_046e2f46-0cff-4bbd-8852-e4b38b48b664.jpg?v=1771058376',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_dadc8358-d5dd-4f31-9c7d-6c587ea63ede.jpg?v=1771058376'
    ],
    description: 'Official playR Pickleball Professional Precise 40 Hole Rotational No Seam PE 74mm.',
    details: ['PE'],
  },
  {
    handle: 'pr-pbi-26',
    title: 'Pickleball Essential Precise TPE Balls 26 Hole 72mm - Set of 4',
    price: 699, compareAt: null,
    type: 'Tpe',
    collections: ['ball', 'pickleball'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_5372a9ff-b553-4140-9d82-1138570c8dc9.jpg?v=1771057878',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_6ab06b9c-a4e7-4f1f-9263-ba1c29ac6ce9.jpg?v=1771057878',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_2ec63b0a-f831-4ea3-81df-e7549ae8d631.jpg?v=1771057878',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Highend_cinematic_image_4k_202602101625.jpg?v=1771057878',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_3b615b69-da44-4726-8f75-d1d6074e4deb.jpg?v=1771057878'
    ],
    colors: ['Orange', 'Yellow'],
    description: 'The playR Indoor Pickleball Ball 72mm – Pack of 4 is designed for players of all levels who want consistent, reliable performance on indoor courts. Made with high-quality TPE using dual-piece injection molding, these orange 26-hole balls are lightweight, stable, and easy to handle. Each ball delivers smooth, predictable flight and a consistent bounce, making them perfect for practice, training drills, recreational games, or competitive indoor matches. The bright orange color with a grey printed ',
    details: ['✔️ Pack of 4 Indoor Pickleball Balls – 72mm, 26 Holes – This set includes four high-quality orange TPE balls, specially designed for indoor pickleball play. Perfect for kids, adults, casual games, practice sessions, and competitive matches. A complete set for indoor pickleball enthusiasts.', '✔️ Premium TPE Dual-Construction – Made with high-quality TPE using dual-piece injection molding, these balls are lightweight, stable, and easy to handle. They provide smooth flight, consistent bounce, and reliable performance for indoor games, training, and practice.', '✔️ Stable Flight & Consistent Bounce – The engineered 26-hole design ensures predictable flight and controlled bounce for precise shots and repeatable performance, making them ideal for indoor rallies, skill practice, and focused gameplay.', '✔️ Power-Focused & Sporty Performance – Lightweight and well-balanced for fast-paced indoor play. These balls deliver excellent control, speed, and smooth energy transfer, suitable for casual matches, training sessions, and competitive indoor play.'],
  },
  {
    handle: 'pr-hmrb-blueg',
    title: 'Heavy Muscle Resistance Band Dual Blue Grey color Pack of 1pc 60-75 Kg',
    price: 699, compareAt: null,
    type: 'Resistance',
    collections: ['band', 'fitness-gym-yoga'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_c78710ac-c195-406c-be00-e78996eb646d.jpg?v=1771224335',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_4d3253df-283f-4e2f-8f0d-8c8136ca63dc.jpg?v=1771224335',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_6e02f87d-f79a-40d2-a4cf-462b1dc12e83.jpg?v=1771224335',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_b2990ae7-eb5c-43fa-b442-cce1a185b47b.jpg?v=1771224335',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_be0e4420-9acf-4872-9ae8-afd12f8ffb6e.jpg?v=1771224335'
    ],
    colors: ['Blue/Grey', 'Green/Grey', 'Purple/Grey', 'Red/Grey', 'Yellow/Grey'],
    description: 'The playR Muscle Resistance Band 2080 TPE Band (Blue + Grey, 60–75 KG) is engineered for advanced users and athletes who require maximum resistance for intense strength and power training. With its extra-heavy resistance level, it supports high-load workouts that push muscle performance and endurance to the next level. Constructed from premium latex-free TPE material, this band delivers exceptional durability, smooth elasticity and consistent resistance even under extreme tension. The dual-color',
    details: ['✔ Extra-Heavy Resistance (60–75 KG) for Maximum Strength & Power – Designed for advanced athletes and heavy strength training, ideal for building maximum muscle power and high-load resistance workouts.', '✔ High-Intensity Full Body Workout Support – Perfect for demanding exercises targeting chest, back, shoulders, arms, core, glutes and legs including heavy squats, pulls, presses and functional strength movements.', '✔ Premium Dual-Color Latex-Free TPE Material (Blue + Grey) – Ultra-durable, skin-safe and odor-free TPE material with strong elasticity, consistent tension and excellent tear resistance under extreme load.', '✔ Ideal for Gym, Strength Training & Professional Use – Built for gym workouts, advanced home training, functional fitness, strength conditioning and professional-level resistance training.'],
  },
  {
    handle: 'pr-hmrb-yrg-set',
    title: 'Heavy Muscle Resistance Band Yellow, Red & Green Combo Set of 3',
    price: 2999, compareAt: null,
    type: 'Resistance',
    collections: ['band', 'fitness-gym-yoga', 'home-office'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/main_0c847532-09aa-44df-9613-31032893d505.jpg?v=1772527077',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_247efe3b-4545-4542-b822-2e9a60ee88c4.jpg?v=1772527077',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_207996c3-14ba-4fda-8087-a5b2d8efe58a.jpg?v=1772527077',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_d3ab85c1-4206-4961-b7f5-2d9133b7ef08.jpg?v=1772527077',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_be123c30-c691-4e57-aeff-20299759db1b.jpg?v=1772527077'
    ],
    description: 'The playR Premium 2080 TPE Latex Free Resistance Band Set includes three progressive levels – Red (7–15 Kg X-Light), Green (15–30 Kg Light) and Yellow (30–45 Kg Medium) – designed for beginners to intermediate users. This resistance bands set is ideal for strength training, muscle toning, endurance building and progressive overload workouts. Made from durable TPE latex free material, these exercise bands are skin-safe, odor-free and provide smooth elasticity with consistent tension. Perfect for ',
    details: ['✔ 3-Level Progressive Resistance Set – Includes X-Light (Red), Light (Green) and Medium (Yellow) bands to support gradual strength improvement. Ideal for beginners, home fitness users and intermediate trainers looking for progressive overload, muscle toning and controlled resistance training.', '✔ Beginner-Friendly to Strength-Control Training – Perfect for warm-up exercises, mobility drills, muscle activation, flexibility training and endurance building. Supports strength toning, stability focus and balanced muscle development without excessive joint stress.', '✔ Premium TPE Latex-Free Material – Made from high-quality 100% TPE latex-free material, these exercise bands deliver excellent tear resistance, strong elasticity, smooth stretch and consistent tension under heavy load. Durable construction ensures tear resistance and long stretch life even during intense workouts.', '✔ Full Body Workout Support for Gym, Home, Yoga & Rehab – Designed for chest, back, shoulders, arms, core, glutes and leg exercises including squats, lunges, presses, rows and functional training movements. Suitable for gym workouts, home workouts, yoga sessions, pilates and physiotherapy exercises.'],
  },
  {
    handle: 'pr-mlrb',
    title: 'Mini Loop Resistance Bands Set of 5 colors - 5 Levels',
    price: 499, compareAt: null,
    type: 'Resistance',
    collections: ['band', 'fitness-gym-yoga', 'home-office'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_866ee6d9-9ed0-4c67-82a5-9c1474ed5eb6.jpg?v=1771198835',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_d670b68b-ee86-4494-be04-b9d1fe24194e.jpg?v=1771198835',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_d21e4bac-d4b5-4795-b6b7-6591ee334377.jpg?v=1771198835',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_d86df202-cf71-437f-a167-ca7ba8bd4fc9.jpg?v=1771198835',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_3d25d9bf-9355-4c4c-ac13-150c512b8e48.jpg?v=1771198835'
    ],
    colors: ['Green/Blue/Yellow/Red/Black', 'Pantone Shades'],
    description: 'Upgrade your fitness routine with the playR Mini Loop Resistance Band Set (5 Levels) designed for full body workout, strength training, muscle toning and physiotherapy rehabilitation. Made from TPE latex-free material, these exercise bands are durable, skin-friendly and tear resistant for long-term daily use. This complete resistance band kit includes 5 color coded strength levels for progressive training: Green X-Light (4–5 kg) 600×50×0.35mm, Blue Light (6–7 kg) 600×50×0.5mm, Yellow Medium (9–1',
    details: ['✔ 5 COLOR CODED RESISTANCE LEVELS WITH POWER & WEIGHT RANGE – Green (X-Light – approx 4–5 kg) 600×50×0.35mm, Blue (Light – approx 6–7 kg) 600×50×0.5mm, Yellow (Medium – approx 9–10 kg) 600×50×0.7mm, Red (Heavy – approx 11–12 kg) 600×50×0.9mm, Black (X-Heavy – approx 13–14 kg) 600×50×1.1mm — beginners to advanced for progressive strength training support.', '✔ Multi Exercise Full Body Workout Resistance Bands – Perfect for glute workouts, leg training, squats, lunges, arms, shoulder strengthening, abs/core exercises, stretching, warm-ups and physiotherapy rehabilitation programs.', '✔ Complete Fitness Resistance Band Set – Includes latex-free TPE mini loop bands, rainbow color coding for easy resistance selection, exercise instruction manual and transparent zip carry pouch for easy storage and travel', '✔ Ideal for Gym, Home Workout, Yoga & Physiotherapy Use – Designed for home gym workouts, professional gym training, muscle toning, yoga routines, rehab therapy sessions, outdoor fitness and portable workout anywhere convenience.'],
  },
  {
    handle: 'prew-1004-1',
    title: 'Centaur B',
    price: 8499, compareAt: null,
    type: 'English Willow',
    collections: ['bat', 'cricket'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_37.jpg?v=1756796375',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_29.jpg?v=1756796375',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_33.jpg?v=1756796375',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_32.jpg?v=1756796375'
    ],
    description: 'Elevate your cricketing game with the playR Centaur English Willow Bat Cricket, a premium-quality bat designed for players who value both power and precision. Handcrafted from top-grade English Willow, this bat features a traditional profile blended with modern aesthetics, ensuring outstanding performance on every shot. Perfect for club matches, practice sessions, and competitive games, the Centaur series offers an ideal combination of a generous sweet spot, superior balance, and exceptional dur',
    details: ['Superior English Willow Construction: Crafted from premium English Willow known for its fine grain and natural strength, this bat ensures durability, excellent rebound, and a smooth, powerful stroke-making experience.', 'Classic Design with Balanced Profile: Features a traditional bat shape with a well-distributed weight profile, mid-to-low sweet spot, and thick edges, providing optimum control for front-foot drives and effortless boundary hitting.', 'Enhanced Sweet Spot for Big Shots: Engineered with an expanded sweet spot area, making it easier to time your shots perfectly and generate maximum power, even on slightly mistimed strokes.', 'High-Quality Handle and Premium Grip: Fitted with a durable, shock-absorbing cane handle and a comfortable rubber grip to reduce hand strain, improve control, and deliver consistent handling throughout long innings.'],
  },
  {
    handle: 'prew-1004-2',
    title: 'Centaur A',
    price: 9999, compareAt: null,
    type: 'English Willow',
    collections: ['bat', 'cricket'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_38.jpg?v=1756796373',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_30.jpg?v=1756796373',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_34.jpg?v=1756796373',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_33.jpg?v=1756796373'
    ],
    description: 'Elevate your cricketing game with the playR Centaur English Willow Bat Cricket, a premium-quality bat designed for players who value both power and precision. Handcrafted from top-grade English Willow, this bat features a traditional profile blended with modern aesthetics, ensuring outstanding performance on every shot. Perfect for club matches, practice sessions, and competitive games, the Centaur series offers an ideal combination of a generous sweet spot, superior balance, and exceptional dur',
    details: ['Superior English Willow Construction: Crafted from premium English Willow known for its fine grain and natural strength, this bat ensures durability, excellent rebound, and a smooth, powerful stroke-making experience.', 'Classic Design with Balanced Profile: Features a traditional bat shape with a well-distributed weight profile, mid-to-low sweet spot, and thick edges, providing optimum control for front-foot drives and effortless boundary hitting.', 'Enhanced Sweet Spot for Big Shots: Engineered with an expanded sweet spot area, making it easier to time your shots perfectly and generate maximum power, even on slightly mistimed strokes.', 'High-Quality Handle and Premium Grip: Fitted with a durable, shock-absorbing cane handle and a comfortable rubber grip to reduce hand strain, improve control, and deliver consistent handling throughout long innings.'],
  },
  {
    handle: 'prew-1004-3',
    title: 'Centaur C',
    price: 7999, compareAt: null,
    type: 'English Willow',
    collections: ['bat', 'cricket'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_39.jpg?v=1756796372',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_31.jpg?v=1756796372',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_35.jpg?v=1756796372',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_34.jpg?v=1756796372'
    ],
    description: 'Elevate your cricketing game with the playR Centaur English Willow Bat Cricket, a premium-quality bat designed for players who value both power and precision. Handcrafted from top-grade English Willow, this bat features a traditional profile blended with modern aesthetics, ensuring outstanding performance on every shot. Perfect for club matches, practice sessions, and competitive games, the Centaur series offers an ideal combination of a generous sweet spot, superior balance, and exceptional dur',
    details: ['Superior English Willow Construction: Crafted from premium English Willow known for its fine grain and natural strength, this bat ensures durability, excellent rebound, and a smooth, powerful stroke-making experience.', 'Classic Design with Balanced Profile: Features a traditional bat shape with a well-distributed weight profile, mid-to-low sweet spot, and thick edges, providing optimum control for front-foot drives and effortless boundary hitting.', 'Enhanced Sweet Spot for Big Shots: Engineered with an expanded sweet spot area, making it easier to time your shots perfectly and generate maximum power, even on slightly mistimed strokes.', 'High-Quality Handle and Premium Grip: Fitted with a durable, shock-absorbing cane handle and a comfortable rubber grip to reduce hand strain, improve control, and deliver consistent handling throughout long innings.'],
  },
  {
    handle: 'prew-1005-1',
    title: 'Striker B',
    price: 12999, compareAt: null,
    type: 'English Willow',
    collections: ['bat', 'cricket'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_41.jpg?v=1756796370',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_33.jpg?v=1756796370',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_37.jpg?v=1756796370',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_36.jpg?v=1756796371'
    ],
    description: 'Upgrade your cricketing gear with the playR Striker English Willow Cricket Bat, meticulously handcrafted from premium-grade English willow to deliver professional-level performance and durability. Designed for players who value power, precision, and versatility, this bat features an expansive sweet spot and perfectly balanced profile for superior control and shot-making ability. Its lightweight pickup allows effortless stroke play, while the high-quality construction ensures reliable performance',
    details: ['Handcrafted Grade English Willow: Meticulously crafted using selected, high-quality English willow renowned for its superior grain structure, delivering powerful performance, long-lasting durability, and an exceptional feel at the crease.', 'Massive Sweet Spot for Effortless Boundary Shots: Designed with an extra-wide and well-positioned sweet spot that maximizes power output, allowing players to clear boundaries with ease while maintaining precision and control on every stroke.', 'Perfectly Balanced Profile with Feather-Light Pickup: Features a finely tuned, evenly balanced blade with a lightweight pickup, providing players with enhanced maneuverability and quicker bat speed for aggressive shot-making and deft touches alike.', 'Engineered for All-Season, All-Condition Play: Built to perform consistently across varied playing surfaces and weather conditions — from dry turf to damp outfields — making it an ideal choice for both practice sessions and high-pressure matches throughout the year.'],
  },
  {
    handle: 'pre-sgea3-07',
    title: 'Adult Swimming Silicone PolyCarbonate Goggles Essentials UV Protection Anti Fog',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'swimming-goggles'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard57.jpg?v=1782730450',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard58.jpg?v=1782730449',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard63.jpg?v=1782730450',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard59.jpg?v=1782730450',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard62.jpg?v=1782730450'
    ],
    colors: ['BLACK GREY', 'LIGHT BLUE', 'PINK BLUE', 'SILVER GREY'],
    description: 'Official playR Adult Swimming Silicone PolyCarbonate Goggles Essentials UV Protection Anti Fog.',
    details: ['Clear Vision & Anti-Fog: High-definition polycarbonate lenses with an anti-fog coating deliver fog-free clarity for daily training and recreational swims.', 'Mirrored Finish: A subtle mirrored lens cuts glare and adds a clean, sporty look in and out of the water.', 'Leakproof & Comfort Fit: A 100% silicone gasket forms a watertight seal around the eyes, holding secure without pressure marks or leaks.', 'Adjustable Strap: The elastic silicone strap and adjustable buckles tune the fit precisely for any head size.'],
  },
  {
    handle: 'pre-sgek1-01',
    title: 'Kids Swimming Silicone Polycarbonate Goggles Essentials UV Protection Anti Fog - Pink Blue',
    price: 799, compareAt: null,
    type: 'Goggles',
    collections: ['swimming', 'swimming-goggles'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard33.jpg?v=1782730295',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard34.jpg?v=1782730296',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard35.jpg?v=1782730296',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard39.jpg?v=1782730296',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard36.jpg?v=1782730296'
    ],
    colors: ['Green Blue', 'Lt. Grey', 'Pink Blue'],
    description: 'Kids Swimming Silicone Polycarbonate Goggles Essentials UV Protection Anti Fog - Pink Blue',
    details: ['Clear Vision & Anti-Fog: High-definition polycarbonate lenses with an anti-fog coating for sharp, uninterrupted vision underwater, so kids stay focused on every lap.', 'Sporty Twin-Lens Design: A lightweight, low-profile racing silhouette in bright colour combinations — built to move fast and look great at the pool.', 'Leakproof & Comfort Fit: A soft silicone gasket seals gently around the eyes for a watertight, leakproof fit without pinching or irritation.', 'Adjustable Secure Strap: The flexible silicone strap adjusts quickly to lock in a custom fit across different head sizes.'],
  },
  {
    handle: 'prbg-1016-l',
    title: 'Test-80 Batting Gloves',
    price: 4999, compareAt: null,
    type: 'Batting',
    collections: ['cricket', 'gloves'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRBG-1016-R_1.jpg?v=1756796107',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_15.jpg?v=1756796107',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_18.jpg?v=1756796107',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_2263590c-851d-4f7e-a8c1-625570d543ba.jpg?v=1756796107'
    ],
    description: 'Gear up for confident performances at the crease with the playR Test-80 Batting Gloves. Crafted with a durable PU outer shell and a leather palm, these gloves offer the perfect balance of protection, comfort, and control. The soft leather palm ensures a firm, non-slip grip on the bat handle, while the high-density foam padding shields your hands against fast deliveries. Designed with pre-curved fingers and breathable ventilation panels, this gloves deliver a comfortable, ergonomic fit and keep y',
    details: ['High Impact Protection: Built with a durable outer layer, these gloves offer outstanding protection against ball impact and abrasions, maintaining durability and strength throughout tough match conditions.', 'Superior Grip Constructed with a high-quality Material, these gloves offer unmatched grip and control on the bat handle, allowing cricketers to play precise shots with full confidence in all conditions.', 'All-Season Comfort and Ventilation: Made with breathable materials and moisture-wicking design, these gloves keep your hands cool and dry in all weather conditions, preventing discomfort during long sessions.', 'Ergonomic Fit with Enhanced Flexibility: Designed to support natural hand movement, the gloves feature a flexible build and ergonomic shaping for unrestricted batting performance and reduced fatigue.'],
  },
  {
    handle: 'prkg-1031',
    title: 'MS-7 Keeping Gloves',
    price: 5499, compareAt: null,
    type: 'Keeping',
    collections: ['cricket', 'gloves'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRKG-1031_1.jpg?v=1756796350',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_17.jpg?v=1756796351',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_21.jpg?v=1756796351',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_18.jpg?v=1756796351'
    ],
    description: 'The playR MS-7 Leather Keeping Gloves with Grit Rubber Palm are engineered to meet the demanding needs of cricket wicketkeepers who require superior grip, protection, and comfort. Constructed from High Quality leather, these gloves combine durability with flexibility, allowing wicketkeepers to maintain agility and confidence throughout the game. The advanced grit rubber palm enhances ball control by providing exceptional grip, crucial for handling fast deliveries and tricky catches. Designed wit',
    details: ['High Impact Protection: Built with a durable outer layer, these gloves offer outstanding protection against ball impact and abrasions, maintaining durability and strength throughout tough match conditions.', 'Superior Grip Constructed with a high-quality Material, these gloves offer unmatched grip and control on the bat handle, allowing cricketers to play precise shots with full confidence in all conditions.', 'All-Season Comfort and Ventilation: Made with breathable materials and moisture-wicking design, these gloves keep your hands cool and dry in all weather conditions, preventing discomfort during long sessions.', 'Ergonomic Fit with Enhanced Flexibility: Designed to support natural hand movement, the gloves feature a flexible build and ergonomic shaping for unrestricted batting performance and reduced fatigue.'],
  },
  {
    handle: 'prblg-1017-r-w',
    title: 'Forward Batting Pad',
    price: 2299, compareAt: null,
    type: 'Batting',
    collections: ['cricket', 'guard'],
    images: [
      'https://lh3.googleusercontent.com/d/1DrD8kJ5b099YPTkysSCxfbsdwOs2kZKy=w1200',
      'https://lh3.googleusercontent.com/d/1YVLJ83jRhBrO9QDVQOdtwuvcpg_3p5LD=w1200',
      'https://lh3.googleusercontent.com/d/1Y6MQaO7tcLH5nxGtNTiRMxwSBPSQ10Gz=w1200'
    ],
    description: 'Experience next-level comfort and dependable protection with the playR Unisex Batting Pad – a high-performance cricket essential engineered for batters who demand consistency, style, and safety at the crease. Crafted with durable, lightweight PU material, this batting pad is tailored to withstand high-speed deliveries while maintaining a snug, ergonomic fit that moves naturally with your stance and stride. The cushioned inner lining ensures all-day comfort, while the ventilated mesh backing prom',
    details: ['Train and compete with confidence wearing the playR Batting Leg Guard, designed to offer reliable front-leg protection, cushioned comfort, and unrestricted movement for every level of cricket play.', 'Lightweight Yet High-Protection Construction: Engineered with lightweight materials, this batting pad offers maximum protection against fast deliveries while allowing players to stay agile and comfortable at the crease.', 'Durable, All-Season Performance: Built to endure the rigors of year-round cricket, whether under blazing summer sun or in humid monsoon conditions, ensuring long-lasting durability without compromising on protection.', 'Breathable, Comfort-Focused Fit: Fitted with an mesh lining on the inside, these pads help regulate temperature and reduce sweat build-up. The soft cushioned inner provides excellent comfort, while adjustable straps deliver a secure, personalized fit to keep the pad in place through every run and defensive block.'],
  },
  {
    handle: 'prblg-1020-l-w',
    title: 'Pro-2200 Batting Pad',
    price: 3999, compareAt: null,
    type: 'Batting',
    collections: ['cricket', 'guard'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitleddesign_1542e251-9443-4589-9558-31df24c7443e.jpg?v=1756796104',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_d193004a-9ba7-4827-bf55-069141212d79.jpg?v=1756796104',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_25_f762a9a3-4c0e-4a04-a11d-dadeb020893d.jpg?v=1756796104',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_382aa8bd-5962-42ad-b274-01dfa3dabc59.jpg?v=1756796104'
    ],
    description: 'Experience next-level comfort and dependable protection with the playR Unisex Batting Pad – a high-performance cricket essential engineered for batters who demand consistency, style, and safety at the crease. Crafted with durable, lightweight PU material, this batting pad is tailored to withstand high-speed deliveries while maintaining a snug, ergonomic fit that moves naturally with your stance and stride. The cushioned inner lining ensures all-day comfort, while the ventilated mesh backing prom',
    details: ['Train and compete with confidence wearing the playR Batting Leg Guard, designed to offer reliable front-leg protection, cushioned comfort, and unrestricted movement for every level of cricket play.', 'Lightweight Yet High-Protection Construction: Engineered with lightweight materials, this batting pad offers maximum protection against fast deliveries while allowing players to stay agile and comfortable at the crease.', 'Durable, All-Season Performance: Built to endure the rigors of year-round cricket, whether under blazing summer sun or in humid monsoon conditions, ensuring long-lasting durability without compromising on protection.', 'Breathable, Comfort-Focused Fit: Fitted with an mesh lining on the inside, these pads help regulate temperature and reduce sweat build-up. The soft cushioned inner provides excellent comfort, while adjustable straps deliver a secure, personalized fit to keep the pad in place through every run and defensive block.'],
  },
  {
    handle: 'pre-sck1-01',
    title: 'Kids Swimming Silicone Cap Wave Essentials',
    price: 499, compareAt: null,
    type: 'Cap',
    collections: ['headwear', 'swimming'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard13.jpg?v=1782731299',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard15.jpg?v=1782731299',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard14.jpg?v=1782731299',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard16.jpg?v=1782731299',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard17.jpg?v=1782731299'
    ],
    colors: ['Blue', 'Pink'],
    description: 'Official playR Kids Swimming Silicone Cap Wave Essentials.',
    details: ['Fun Wave Design: A playful embossed wave pattern makes this kids\' cap a pool favourite while keeping hair tucked away neatly.', 'Snug, Comfortable Fit: Soft, stretchy 100% silicone fits little heads comfortably without pulling hair, holding secure throughout the swim.', 'Streamlined & Leak-Resistant: A smooth silicone surface reduces drag and helps keep hair dry and out of the face.', 'Durable & Easy-Care: Tear-resistant silicone holds its shape and colour and rinses clean in seconds after every session.'],
  },
  {
    handle: 'pre-sck2-03',
    title: 'Kids Swimming Silicone Cap Fish Essentials',
    price: 599, compareAt: null,
    type: 'Cap',
    collections: ['headwear', 'swimming'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard50.jpg?v=1782731482',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard53.jpg?v=1782731483',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard55.jpg?v=1782731482',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard56.jpg?v=1782731483',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard52.jpg?v=1782731482'
    ],
    colors: ['Blue', 'Pink'],
    description: 'Official playR Kids Swimming Silicone Cap Fish Essentials.',
    details: ['Playful Fish Design: A fun fish-themed cap with character details kids love — turning every pool session into playtime.', 'Snug, Comfortable Fit: Soft, stretchy 100% silicone hugs the head gently without pulling hair, staying secure in the water.', 'Streamlined & Leak-Resistant: The smooth silicone surface reduces drag and helps keep hair dry and away from the eyes.', 'Durable & Easy-Care: Tough, tear-resistant silicone keeps its bright colour and rinses clean after every swim.'],
  },
  {
    handle: 'prym-10-01',
    title: 'playR Yoga Mat 6 MM',
    price: 1299, compareAt: null,
    type: 'Yoga Mat',
    collections: ['fitness-gym-yoga', 'home-office', 'yoga-mat'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_ebea2b49-39ef-437e-b483-1422f5a3126f.jpg?v=1767362650',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_855954af-677e-4ad6-93fa-06c562ae5794.jpg?v=1767362650',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_1cb1df0e-211b-452f-a5d1-98d26853ae94.jpg?v=1767362650',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_37d4fbc3-2982-4896-8918-11fe4de46709.jpg?v=1767362650',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_a475bc73-9eb8-4cd7-86d3-3f3aae574dbc.jpg?v=1767362650'
    ],
    colors: ['Charcoal', 'Green', 'Grey', 'Olive', 'Orange', 'Pink'],
    description: 'The playR EVA Yoga Mat is crafted for performance, comfort, and convenience. With 6MM thickness, this anti-slip yoga mat offers superior joint protection, grip, and balance for yoga poses, gym workouts, or meditation. Its durable EVA construction makes it easy to clean and ideal for daily use at home, gym, or outdoors. Lightweight, rollable, and stylish – this yoga mat is made for both men and women who want to elevate their fitness journey. Say goodbye to slipping and discomfort with playR.',
    details: ['Made with Premium EVA Material for Comfort and Durability The playR yoga mat is crafted from high-quality EVA foam, offering a perfect combination of durability and lightweight design. Its 6MM thickness provides exceptional cushioning and comfort, reducing pressure on your knees, elbows, and spine. Whether you\'re practicing yoga or doing strength training, this mat ensures long-lasting support without compromising on portability.', 'Anti-Slip Textured Surface for Maximum Grip and Safety Stay secure and focused during every pose or movement with the mat’s anti-slip, textured surface. Designed to provide excellent traction even during sweaty sessions, this mat prevents sliding and shifting on both hard floors and carpeted surfaces. It\'s ideal for power yoga, pilates, HIIT workouts, and core routines where stability is key.', 'Lightweight, Easy to Roll, and Travel-Friendly Design Whether you’re working out at home, heading to the gym, or doing yoga in the park, this mat is easy to carry and store. It rolls up quickly and fits comfortably in most gym bags or with a carry strap (not included), making it a great fitness companion for those constantly on the move.', 'Moisture-Resistant and Easy to Clean for Everyday Use The sweat-resistant surface repels moisture and stays hygienic even after intense use. Simply wipe it down with a damp cloth or mild soap solution after each session. Its easy maintenance makes it perfect for daily fitness routines, whether you’re using it indoors or outdoors.'],
  },
  {
    handle: 'pr-pbpcf-p',
    title: 'Pickleball Paddle Performance Carbon Fiber 16 mm',
    price: 4999, compareAt: null,
    type: 'Carbon Fiber',
    collections: ['paddle', 'pickleball'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/main_a108cb9d-5a2c-4a8c-8005-0b2ffbc0430e.jpg?v=1771051318',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_b312a87b-5278-4a99-b91c-311a184b5cc8.jpg?v=1771050814',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_15071840-9476-482a-9d46-3e094a5c3682.jpg?v=1771050814',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_39bef156-5415-43d7-8d50-0382dfb16f70.jpg?v=1771050814',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_017b0853-49b8-4765-9129-49c38567f6b7.jpg?v=1771050814'
    ],
    description: 'The playR Pickleball Paddle Performance Carbon Fiber 16mm is designed for players who want controlled power, precision, and long-lasting durability in every game. Built with T300 carbon fiber + PP honeycomb core and a full UV printing face, this pickle Ball paddle delivers lightweight strength, balanced control, and stable performance for both beginners and professional players. With a standard performance size of 415 × 190 × 16mm and a 16mm thick core, the paddle creates a large sweet spot that',
    details: ['✔️ Carbon Fiber Performance Construction – Cold pressed T300 carbon fiber With full UV printing face pickleball paddle with PP honeycomb core delivers high strength, lightweight feel, and long-lasting durability. The carbon structure provides excellent stability, vibration control, and consistent performance, making it ideal for professional players, beginners, training sessions, and competitive outdoor pickleball games with balanced power and control.', '✔️ Consistent Sweet Spot & Balanced Control – Engineered with a 16mm thick core and precision face design to create a wide, consistent sweet spot. This carbon fiber pickleball paddle offers smooth ball contact, controlled power, and accurate shot placement. Perfect for players who want precision, stability, and confidence in fast rallies, match play, and daily practice sessions.', '✔️ Strong Dual-Color Edge Guard Protection – Built with a black to grey dual color edge guard that protects the paddle from court impact, surface damage, and accidental drops. The reinforced structure increases durability and long product life, making it a reliable outdoor pickleball paddle for kids, adults, training use, and professional match play.', '✔️ Non-Slip PU Handle Grip Comfort – Features a grey PU non-slip grip without stitching, designed for firm hold, comfort, and reduced hand fatigue. The ergonomic handle ensures stable grip control, smooth handling, and better balance during long matches, intense rallies, and extended practice sessions for kids and adults.'],
  },
  {
    handle: 'pr-pbpcf-pro',
    title: 'Pickleball Paddle Professional Carbon Fiber 16 mm',
    price: 6999, compareAt: null,
    type: 'Carbon Fiber',
    collections: ['paddle', 'pickleball'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Untitled-2_a4765793-473c-4e41-9985-6c00527fe784.jpg?v=1771052439',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_e3ac478f-99a5-4890-8e63-6fec0ae86b64.jpg?v=1771052486',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_a4c36e20-1802-4be3-86e8-4342f6f9de52.jpg?v=1771052486',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_93f9e6d0-69c7-4656-8777-3a470d57362f.jpg?v=1771052486',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_4f99d7b1-be23-4c1f-9cf1-fddc977534f8.jpg?v=1771052486'
    ],
    description: 'The playR Pickleball Paddle Professional Carbon Fiber 16mm is built for players who want high control, high power, sharp precision, and long-lasting durability in every game. Made with T700 carbon fiber and a PP honeycomb core, this pickleball paddle delivers lightweight strength, a strong structure, and stable performance for both beginners and professional players. The full UV printing face improves surface durability and maintains consistent ball contact. With a standard performance size of 4',
    details: ['✔️ Carbon Fiber Professional Construction – Cold pressed T700 carbon fiber pickleball paddle with full UV printing face and PP honeycomb core delivers lightweight strength, high durability, and stable performance. The strong structure improves control, power balance, and long-term use, making it ideal for professional pickleball players, beginners, and training sessions. Designed for indoor and outdoor pickleball games with high power and sharp precision.', '✔️ Consistent Sweet Spot & High Control – Engineered with a 16mm thick core and optimized face design for a consistent sweet spot, this pickleball paddle offers smooth ball response, sharp precision, and high control. Perfect for players who want accurate shots, controlled power, and stable handling in competitive matches, practice sessions, and casual outdoor games.', '✔️ Strong Dual-Color Edge Guard Protection – Built with a durable black to beige dual-color edge guard, this pickleball racket provides strong protection against surface impact, court contact, and accidental drops. The reinforced structure increases product life, making it a reliable outdoor and indoor pickleball paddle for kids and adults.', '✔️ Non-Slip PU Handle Grip Comfort – Features a beige PU non-slip grip without stitching for better comfort, firm hold, and stable control. The ergonomic handle reduces hand fatigue and ensures strong grip stability during long matches, intense rallies, and extended training sessions for kids and adults.'],
  },
  {
    handle: 'prpb-set-cf',
    title: 'Pickleball Performance Carbon Fiber Paddle & TPE Ball with Carry Bag Combo - Set of 4 Items',
    price: 3499, compareAt: null,
    type: 'Combo',
    collections: ['pickleball'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/sdfasfaasf.jpg?v=1771053924',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/2_8785a21e-d574-47ae-aebc-96b7ffcd4053.jpg?v=1771053924',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/3_84a9e117-3230-4dc9-a208-8c2fa4ffb870.jpg?v=1771053924',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/4_9200bb8f-d1ea-4c65-a1c8-0ec8bb2326e3.jpg?v=1771053924',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/5_da7b8a27-3a2a-4985-afa5-1a64c656f67b.jpg?v=1771053924'
    ],
    description: 'The playR Performance Carbon Fiber Pickleball Kit – 4 Items is a complete set for kids and adults, including 1pc Carbon Fiber Paddle (16mm), 1pc Outdoor 40-Hole TPE Ball, 1pc Indoor 26-Hole TPE Ball, and 1pc Professional Carry Bag. The paddle is built with T300 carbon fiber and a PP honeycomb core, featuring a dual-color black-to-grey edge guard, grey PU non-slip handle, black rubber ring, and black end cap for precision, control, and a consistent sweet spot. The yellow outdoor TPE ball and oran',
    details: ['✔️ Complete Carbon Fiber Pickleball Set – 4 Items Included – This kit includes 1pc Performance Carbon Fiber Pickleball Paddle (16mm), 1pc Outdoor 40-Hole TPE Ball, 1pc Indoor 26-Hole TPE Ball and 1pc Professional Carry Bag, providing a ready-to-play set for kids and adults. Perfect for indoor/outdoor games, training sessions, practice, and competitive matches.', '✔️ Perfromance Carbon Fiber Pickleball Paddle (16mm) – Constructed with T300 carbon fiber and a PP honeycomb core, featuring a dual-color black-to-grey edge guard, grey PU non-slip handle, black rubber ring with printed logos, and black end cap with sil gel logo. Lightweight, Balance Control, and professional, offering precision, controlled power, and a consistent sweet spot for accurate and smooth shots.', '✔️ Outdoor TPE Balls (40 Holes, 74mm) – Premium yellow TPE material ensures stable flight, consistent bounce, and controlled performance. Designed for outdoor pickleball, these durable balls provide power-focused play, precision, and long-lasting use for kids and adults.', '✔️ Indoor TPE Balls (26 Holes, 72mm) – High-quality orange TPE balls with 26-hole design offer controlled bounce, consistent performance, and lightweight handling. Perfect for indoor pickleball training, practice drills, fitness play, and competitive indoor matches.'],
  },
  {
    handle: 'pre-adult-com-5',
    title: 'playR Performance Swim Cap, Goggle & Nose Clip Set for Adults',
    price: 1599, compareAt: null,
    type: 'Combo',
    collections: ['swimming'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRE-COM-51.jpg?v=1787655707',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRE-COM-55.jpg?v=1787655706',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRE-COM-52.jpg?v=1787655706',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRE-COM-53.jpg?v=1787655706',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRE-COM-54.jpg?v=1787655706'
    ],
    colors: ['BLACK GREY', 'Lt. Blue Black', 'PINK BLUE BLACK', 'SILVER GREY'],
    description: 'playR Performance Swim Cap, Goggle & Nose Clip Set for Adults',
    details: ['Polycarbonate & Silicone'],
  },
  {
    handle: 'prbackc-csk-01',
    title: 'CSK Back Cushion (Big)',
    price: 699, compareAt: null,
    type: 'Back',
    collections: ['chennai-super-kings', 'cricket', 'cushion', 'home-office', 'lifestyle-after-sports'],
    images: [
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRBackC-CSK-01_1.jpg?v=1756796081',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRBackC-CSK-01_2.jpg?v=1756796081',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRBackC-CSK-02___2.jpg?v=1756796081',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRBackC-CSK-02___3.jpg?v=1756796081',
      'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/PRBackC-CSK-02_1_62c34f0d-77ed-4a80-b181-ae98327d9c94.jpg?v=1756796081'
    ],
    description: 'Roar like the kings of Chennai with the playR x Chennai Super Kings Back Cushion, designed for loyal fans of the Yellow Army. Whether you’re watching the match from your couch, decorating your fan zone, or gifting it to a fellow CSK supporter, this cushion brings legendary IPL energy into your space. Crafted using soft, High-quality Plush Velvet material, the cushion offers lasting back support and comfort throughout the seasons. The vibrant CSK logo and team-themed design turn this from a simpl',
    details: ['Official CSK Fan Merchandise – Celebrate your love for the Chennai Super Kings with this exclusive back cushion from playR. Designed for true IPL enthusiasts, it features official team branding and vibrant CSK colors that bring the stadium energy into your living space.', 'Soft & Durable Fabric – Crafted from high-quality materials that are soft to the touch yet highly durable, this back cushion ensures long-lasting support and comfort for daily use on sofas, chairs, or beds.', 'All-Season Comfort & Style – Designed to offer cozy back support throughout the year—whether you\'re watching cricket in summer or relaxing in the winter—this cushion adapts to every season without losing shape or softness.', 'Washable & Easy to Maintain – The fabric is fully washable, ensuring your cushion stays fresh and clean over time. Simply toss it in the wash to remove dust, spills, or stains without fading the iconic CSK print.'],
  },
];
products.push(...skuCatalog);
