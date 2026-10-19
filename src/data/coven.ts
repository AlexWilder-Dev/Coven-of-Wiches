// Everything the shop changes lives in this file: the weekly board, the bar,
// opening hours and contact details. Prices are pounds.

export type PhotoKey =
  | 'reuben'
  | 'agatha'
  | 'marg'
  | 'cocktail'
  | 'wiccan-liquor'
  | 'mr-bang'
  | 'spread'
  | 'shopfront-day'
  | 'shopfront-night'
  | 'door';

export interface Wich {
  name: string;
  /** The line under the name on the board */
  line: string;
  fillings?: string[];
  /** One price, or regular + smaller */
  price: number | { reg: number; sml: number };
  photo?: PhotoKey;
}

export interface Extra {
  name: string;
  note?: string;
  price: number | { label: string; price: number }[];
}

/* ==========================================================================
   THIS WEEK'S BOARD: the weekly edit. Copy the new board in here.
   `from` / `to` are the dates printed on the board (YYYY-MM-DD).
   ========================================================================== */

export const THIS_WEEK = {
  from: '2026-10-14',
  to: '2026-10-17',

  specials: [
    {
      name: 'The Club',
      line: 'Double decker tasty',
      fillings: ['lemon pepper chkn', 'smokey vastrami', 'tomato', 'avocado', 'letty', 'baconnaise', 'crisps'],
      price: 13,
    },
    {
      name: 'Vish Finger',
      line: 'Childhood classsic',
      fillings: ['white tin', 'iceberg', 'twofold pickles', 'tartar', 'hot sauce'],
      price: 8,
    },
  ] as Wich[],

  /** Below the dashed line on the board */
  cauldron: [
    {
      name: 'The Smack',
      line: "Shampain truffle mac n' cheese",
      fillings: ['cauldron side', 'smoked lardon', 'synthetic truffle shroom', 'edible glitter'],
      price: 7,
    },
  ] as Wich[],

  sides: [
    { name: 'Fries', note: 'salt & pepper', price: 4 },
    { name: 'Hash browns', note: 'w/ chilli jam or ask for !! DEATH JAM !!', price: 6 },
    { name: 'Kimchi', price: 5 },
    { name: 'Slaw', price: 4 },
    { name: 'Potatty salad', price: 5 },
    { name: 'Dips', price: 2 },
    {
      name: 'Mr. Bang hot sauce',
      price: [
        { label: 'btl', price: 8 },
        { label: 'dip', price: 2.5 },
      ],
    },
  ] as Extra[],

  floats: {
    name: 'Soda float',
    note: 'w/ ice cream, caramel gloop',
    options: [
      { label: 'Coke', price: 6 },
      { label: 'Root beer', price: 7 },
      { label: "Jimmy's oat coffee", price: 7 },
    ],
  },
};

/* ==========================================================================
   STALWARTS: on every board, whatever else rotates.
   ========================================================================== */

export const STALWARTS: Wich[] = [
  {
    name: 'The Reuben',
    line: 'Rye sourdough & vastrami',
    price: { reg: 12, sml: 7 },
    photo: 'reuben',
  },
];

/* Past specials, for the "previously on the board" strip. Not orderable. */
export const PAST_SPECIALS: { name: string; line: string; photo?: PhotoKey }[] = [
  { name: 'A.G.A.T.H.A', line: 'Aubergine schnitzel, hot raclette, avocado, gremoulata, on middle eastern bread', photo: 'agatha' },
  { name: 'The Stevil', line: 'Lasagne on confit garlic ciabatta' },
  { name: 'The Philly', line: "Seared 'beev', charred peppers and onions, cheese sauce, French dip" },
  { name: 'The Dawg', line: '8in frank under 12hr chilli sin carne, crispy onions, jalapeños, tortilla chips' },
  { name: 'The Parmy', line: 'Panko chkn schnitzel, marinara, mac & three cheese raclette' },
];

/* ==========================================================================
   THE BAR
   ========================================================================== */

export const BAR = {
  /** Their A-board, word for word */
  aBoard: ['Dive bar', 'Craft beer', 'Vegan food'],
  feature: {
    name: 'Wiccan Liquor',
    what: '5% NZ-forward pale ale, brewed with Gravity Well Brewing',
    how: 'On keg and in 440ml cans',
    photo: 'wiccan-liquor' as PhotoKey,
  },
  pours: [
    { name: 'Frozen margaritas', photo: 'marg' as PhotoKey },
    { name: 'Pickleback & kimchiback shots' },
    { name: 'The Gravity Well fridge', note: 'a rotating selection from the brewery' },
    { name: 'Craft beers & spirits', photo: 'cocktail' as PhotoKey },
  ],
};

/* ==========================================================================
   HOURS (Europe/London). Sessions are [open, close] in 24h "HH:MM".
   Days with no sessions are closed.
   ========================================================================== */

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const HOURS: Record<DayKey, [string, string][]> = {
  mon: [],
  tue: [],
  wed: [['12:00', '15:00'], ['17:00', '21:00']],
  thu: [['12:00', '15:00'], ['17:00', '21:00']],
  fri: [['12:00', '15:00'], ['17:00', '21:00']],
  sat: [['12:00', '22:00']],
  sun: [['12:00', '16:00']],
};

/** "PEAK TIME 12-3" on the board */
export const PEAK: [string, string] = ['12:00', '15:00'];

/** From this time the site leads with the bar, on days that have an evening */
export const EVENING_FROM = '17:00';

/* ==========================================================================
   CONTACT & LOCATION
   ========================================================================== */

export const CONTACT = {
  name: 'THE COVEN of WICHES',
  instagram: { handle: '@covenofwiches', url: 'https://www.instagram.com/covenofwiches/' },
  email: 'covenofwiches@gmail.com',
  address: {
    unit: '14D Market Row',
    market: 'Brixton Village',
    city: 'London',
    postcode: 'SW9 8LD',
  },
  /** Pin from Brixton Village's own trader map */
  geo: { lat: 51.461944, lng: -0.113375 },
  where: "On the short arm of Market Row that runs in from Coldharbour Lane, opposite Esme's.",
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=51.461944%2C-0.113375',
  brixtonVillageMapUrl:
    'https://viewer.mapme.com/80ad6a16-ff8c-42ee-92ce-94b3b61587eb/location/7e919dbb-2f8b-4ada-9d1a-6cd378b5af02',
};
