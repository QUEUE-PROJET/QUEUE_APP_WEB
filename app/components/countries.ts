// utils/countries.ts
export interface Country {
  name: string;
  code: string;
  phoneCode: string;
  flag: string; // URL vers l'image du drapeau
}

export const countries: Country[] = [
  {
    name: "France",
    code: "FR",
    phoneCode: "+33",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FR.svg"
  },
  {
    name: "Belgique",
    code: "BE",
    phoneCode: "+32",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BE.svg"
  },
  {
    name: "Canada",
    code: "CA",
    phoneCode: "+1",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CA.svg"
  },
  {
    name: "Côte d'Ivoire",
    code: "CI",
    phoneCode: "+225",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CI.svg"
  },
  {
    name: "Sénégal",
    code: "SN",
    phoneCode: "+221",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SN.svg"
  },
  {
    name: "Cameroun",
    code: "CM",
    phoneCode: "+237",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CM.svg"
  },
  {
    name: "Tunisie",
    code: "TN",
    phoneCode: "+216",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TN.svg"
  },
  {
    name: "Togo",
    code: "TG",
    phoneCode: "+228",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TG.svg"
  },
  {
    name: "Bénin",
    code: "BJ",
    phoneCode: "+229",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BJ.svg"
  },
  {
    name: "Burkina Faso",
    code: "BF",
    phoneCode: "+226",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BF.svg"
  },
  {
    name: "Ghana",
    code: "GH",
    phoneCode: "+233",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GH.svg"
  },
  {
    name: "Nigeria",
    code: "NG",
    phoneCode: "+234",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NG.svg"
  },
  {
    name: "Mali",
    code: "ML",
    phoneCode: "+223",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ML.svg"
  },
  {
    name: "Guinée",
    code: "GN",
    phoneCode: "+224",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GN.svg"
  },
  {
    name: "Niger",
    code: "NE",
    phoneCode: "+227",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NE.svg"
  },
  {
    name: "RDC (Congo-Kinshasa)",
    code: "CD",
    phoneCode: "+243",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CD.svg"
  },
  {
    name: "Rwanda",
    code: "RW",
    phoneCode: "+250",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RW.svg"
  },
  {
    name: "Kenya",
    code: "KE",
    phoneCode: "+254",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KE.svg"
  },
  {
    name: "Afrique du Sud",
    code: "ZA",
    phoneCode: "+27",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ZA.svg"
  },
  {
    name: "Égypte",
    code: "EG",
    phoneCode: "+20",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EG.svg"
  },
  {
    name: "Maroc",
    code: "MA",
    phoneCode: "+212",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MA.svg"
  },
  {
    name: "États-Unis",
    code: "US",
    phoneCode: "+1",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg"
  },
  {
    name: "Royaume-Uni",
    code: "GB",
    phoneCode: "+44",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg"
  },
  {
    name: "Allemagne",
    code: "DE",
    phoneCode: "+49",
    flag: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg"
  }
];

// Alternative si vous préférez héberger les images vous-même :
// - Téléchargez les SVG depuis https://github.com/twitter/twemoji/tree/master/assets/svg
// - Placez-les dans votre dossier public
// - Utilisez des chemins relatifs comme flag: "/flags/fr.svg"