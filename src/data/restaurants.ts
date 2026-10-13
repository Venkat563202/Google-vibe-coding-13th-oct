import { RestaurantSpot, HyderabadiQuote } from '../types';

/**
 * ============================================================================
 * ⚠️ IMPORTANT CHALLENGE RULE:
 * DO NOT INVENT OR PRE-POPULATE THIS LIST WITH RESTAURANTS.
 * This array is reserved for the user to manually populate with real
 * Hyderabad restaurants in the next step!
 *
 * UNTIL POPULATED:
 * When this array is empty ([]), the app displays an attractive, dedicated
 * Hyderabadi empty state explaining that local spots need to be added.
 * ============================================================================
 */
export const SECRET_LOCAL_SPOTS: RestaurantSpot[] = [
  // ⬇️ Paste your authentic Hyderabad restaurant list here! ⬇️
  // Example spot format:
  // {
  //   id: 'spot-1',
  //   name: 'Cafe Bahar',
  //   area: 'Basheerbagh',
  //   distanceKm: 3.5,
  //   votes: 0,
  //   specialty: 'Special Mutton Dum Biryani',
  //   parkingAlert: 'Arey bhai, parking ich nahi miling wahan, auto leko jao!',
  //   trafficAlert: 'Abids signal pe heavy traffic rehta sham mein.',
  //   spiceLevel: 'Kirrak Teekha',
  //   priceRange: '₹₹',
  //   khansamaNote: 'Double masala aur extra mirchi ka salan maango!'
  // }
];

/**
 * Curated authentic Hyderabadi victory messages
 */
export const HYDERABADI_VICTORY_MESSAGES: HyderabadiQuote[] = [
  {
    headline: 'Khaike Dekho Mawa! Dum Biryani ka Baap!',
    subtext: 'Faisla hogaya ustaad. Ab baigan ke baatan nakko karo, sidha adda pohncho aur toot pado!',
    context: 'victory'
  },
  {
    headline: 'Dawat Paki! Pot se Zafrani Dhuan Nikal Gaya!',
    subtext: 'Unanimous majority mil gayi miyan! Table pakad ke baitho, Khansama ko dum kholne bolo!',
    context: 'victory'
  },
  {
    headline: 'Kirrak Scene! Ek Number Choice Hai!',
    subtext: 'Mutton itna naram ke muh mein pighal jaye. Aakhiri mein double ka meetha khana mat bhoolo!',
    context: 'victory'
  },
  {
    headline: 'Jeet Gaya Re Baap! Ab Bill Kaun Dera?',
    subtext: 'Voting toh jeet gaye, ab payment Google Pay pe kiski baari hai faisla karo!',
    context: 'victory'
  }
];

/**
 * Authentic street slang warnings for parking and traffic in Hyderabad
 */
export const HYDERABADI_PARKING_ALERTS: string[] = [
  'Arey bhai, parking ich nahi miling wahan, auto leko jao!',
  'Gadi kahan lagate miyan? Valet wala bhi haath utha deta!',
  'Two-wheeler pe gaye toh theek, char pahiya le gaye toh rona padta!',
  'Parking ke chakkar mein biryani thandi ho jati, paidal chalo aakhiri 200m!'
];

export const HYDERABADI_TRAFFIC_ALERTS: string[] = [
  'Gachibowli flyover pe full jam hai ustaad, patience hona!',
  'Begumpet signal pe 3 bar red hota miyan, sambhalke niklo!',
  'Charminar ke galliyan mein car phas gayi toh kal subah nikalte!',
  'Panjagutta flyover pe bumper-to-bumper hai, metro better choice hai!'
];

export const HYDERABADI_EMPTY_STATE = {
  headline: 'Arey Ustaad! SECRET_LOCAL_SPOTS Khali Hai!',
  subtext: 'Friends ladne ko tayyar hain par biryani addas kahan hain? Code ke `SECRET_LOCAL_SPOTS` array mein restaurants daalo ya neeche diye button se abhi add karo!',
  slangPunch: 'Baigan ke baatan nakko miyan, pehle adda add karo!'
};

/**
 * Optional Test Preset for immediate demo testing if desired.
 * This is ONLY loaded when the user explicitly clicks "Load Test Spots Preview".
 * By default, SECRET_LOCAL_SPOTS remains strictly empty!
 */
export const OPTIONAL_HYDERABAD_TEST_PRESET: RestaurantSpot[] = [
  {
    id: 'spot-sample-1',
    name: 'Hotel Shadab',
    area: 'Ghansi Bazaar, Near Charminar',
    distanceKm: 2.3,
    votes: 4,
    specialty: 'Special Mutton Biryani & Zafrani Chai',
    parkingAlert: 'Arey bhai, Madina circle pe parking ich nahi miling, auto leko sidha jao!',
    trafficAlert: 'Charminar galliyan mein shaam ko bumper-to-bumper rehta ustaad!',
    spiceLevel: 'Kirrak Teekha',
    priceRange: '₹₹',
    khansamaNote: 'Extra Mirchi ka Salan aur Dahi ki Chutney zarur maangna!'
  },
  {
    id: 'spot-sample-2',
    name: 'Cafe Bahar',
    area: 'Hyderguda / Basheerbagh',
    distanceKm: 3.8,
    votes: 6,
    specialty: 'Special Double Gosht Biryani',
    parkingAlert: 'Road side parking lottery jaisi hai miyan, do round lagana padta!',
    trafficAlert: 'Abids & Basheerbagh flyover route thoda busy rehta 8 baje.',
    spiceLevel: 'Kirrak Teekha',
    priceRange: '₹₹',
    khansamaNote: 'Khaane ke baad Bahar ki special Irani chai peena lazmi hai!'
  },
  {
    id: 'spot-sample-3',
    name: 'Shah Ghouse Special',
    area: 'Tolichowki',
    distanceKm: 4.7,
    votes: 3,
    specialty: 'Authentic Kachi Akhni Dum Biryani',
    parkingAlert: 'Valet parking mil jati lekin weekend pe lambi line lagti!',
    trafficAlert: 'Tolichowki main road pe traffic chalti rehti, flyover se aao!',
    spiceLevel: 'Fire 🔥',
    priceRange: '₹₹',
    khansamaNote: 'Double Masala boliye khansama ko, maza double ho jata!'
  },
  {
    id: 'spot-sample-4',
    name: 'Meridian Restaurant',
    area: 'Panjagutta',
    distanceKm: 6.2,
    votes: 2,
    specialty: 'Mutton Dum Biryani with Thick Salan',
    parkingAlert: 'Basement parking full tight rehti, thoda dhyan se lagao!',
    trafficAlert: 'Panjagutta cross roads pe hamesha signal jam rehta!',
    spiceLevel: 'Kirrak Teekha',
    priceRange: '₹₹',
    khansamaNote: 'Extra raita maangne par debate nakko karo, enjoy the mutton!'
  },
  {
    id: 'spot-sample-5',
    name: 'Bawarchi',
    area: 'RTC X Roads, Musheerabad',
    distanceKm: 7.9,
    votes: 5,
    specialty: 'Legendary Chicken & Mutton Biryani',
    parkingAlert: 'RTC X Roads pe car lagana matlab himmat ka kaam!',
    trafficAlert: 'Theatre traffic aur metro work se route thoda slow chalta.',
    spiceLevel: 'Medium',
    priceRange: '₹',
    khansamaNote: 'Duplicate board dekh ke confuse nakko ho jao, main branch pe jao!'
  },
  {
    id: 'spot-sample-6',
    name: 'Jewel of Nizam',
    area: 'The Golkonda, Masab Tank',
    distanceKm: 9.4,
    votes: 1,
    specialty: 'Shahi Zafrani Dum Biryani & Anokhi Kheer',
    parkingAlert: 'Valet parking ekdum smooth hai, tension nakko lo.',
    trafficAlert: 'Masab Tank bridge pe shaam 7 se 9 thoda slow traffic rehta.',
    spiceLevel: 'Medium',
    priceRange: '₹₹₹',
    khansamaNote: 'Royal Nizami ambience, family dawat ke liye number one!'
  }
];
