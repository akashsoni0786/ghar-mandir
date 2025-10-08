import { GetIcon1, GetIcon2, GetIcon3 } from "@/assets/svgs";
const rev_1 =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600828092-zm723g.webp";
const rev_2 =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600874755-tcxpjw.webp";
const rev_3 =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600892593-kgwsii.webp";
const rev_4 =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600913835-sz9vjv.webp";
const rev_5 =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600934610-s3frzi.webp";
const rev_6 =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757600955497-fbqr84.webp";
export const Single =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757403618519-j5fof.webp";
export const Couple =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757403650249-y700c.webp";
export const FourMember =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757403675936-45np45.webp";
export const SixMember =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757403694219-hvafz.webp";
export const Single_P =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757409754446-58m88a.webp";
export const Couple_P =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757409628252-4jpns8.webp";
export const FourMember_P =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757409500723-sdvsn.webp";
export const SixMember_P =
  "https://d28wmhrn813hkk.cloudfront.net/uploads/1757403554405-7hepw.webp";
export const chadhavaPackageList = [
  {
    name: "Couple",
    sub_name: "Puja",
    name_p: "1 Member &",
    sub_name_p: "1 Pitru",
    image: Couple,
    image_p: Couple_P,
    price: 501,
    active: false,
    popular: false,
    img_class: "package-box--img-2",
    img_class_p: "package-box--img-2_p",
    member: 2,
  },
  {
    name: "4 Family",
    sub_name: "Member",
    name_p: "1 Member &",
    sub_name_p: "3 Pitru",
    image: FourMember,
    image_p: FourMember_P,
    price: 1199,
    active: false,
    popular: true,
    img_class: "package-box--img-3",
    img_class_p: "package-box--img-3_p",
    member: 4,
  },
  {
    name: "6 Family",
    sub_name: "Member",
    name_p: "1 Member &",
    sub_name_p: "5 Pitru",
    image: SixMember,
    image_p: SixMember_P,
    price: 1599,
    active: false,
    popular: false,
    img_class: "package-box--img-4",
    img_class_p: "package-box--img-4_p",
    member: 6,
  },
];
export const packageList = [
  {
    name: "Individual",
    sub_name: "Puja",
    name_p: "1 Member",
    sub_name_p: "Puja",
    image: Single,
    image_p: Single_P,
    price: 301,
    active: false,
    popular: false,
    img_class: "package-box--img-1",
    img_class_p: "package-box--img-1_p",
    member: 1,
  },
  ...chadhavaPackageList,
];

export const packageNameObj = {
  "Individual Puja": "1 Member Puja",
  "Couple Puja": "1 Member & 1 Pitru",
  "4 Family Member": "1 Member & 3 Pitru",
  "6+ Family Member": "1 Member & 5 Pitru",
  "6 Family Member": "1 Member & 5 Pitru",
};

export const boxes = (t) => {
  return [
    {
      icon: <GetIcon1 />,
      heading: `${t("WHY_PERFORM_HEAD_1")}`,
      description: t("WHY_PERFORM_DESC_1"),
    },
    {
      icon: <GetIcon2 />,
      heading: `${t("WHY_PERFORM_HEAD_2")}`,
      description: t("WHY_PERFORM_DESC_1"),
    },
    {
      icon: <GetIcon3 />,
      heading: `${t("WHY_PERFORM_HEAD_3")}`,
      description: t("WHY_PERFORM_DESC_1"),
    },
  ];
};

export const filters = {
  // Time: {
  //   All: true,
  //   Today: false,
  //   Tomorrow: false,
  //   Weekend: false,
  //   "Todays Special": false,
  // },
  // Deity: {
  //   Shiva: false,
  //   Hanuman: false,
  //   "Shani dev": false,
  //   Durga: false,
  //   Lakshmi: false,
  //   Krishna: false,
  //   Ganesha: false,
  //   Rama: false,
  //   Brahma: false,
  //   Saraswati: false,
  //   Vishnu: false,
  //   Kali: false,
  //   Surya: false,
  //   Jyotirling: false,
  // },
  // Benefits: {
  //   "Financial Abundance": false,
  //   Health: false,
  //   Prosperity: false,
  //   Peace: false,
  //   Creativity: false,
  //   Stability: false,
  //   Growth: false,
  //   Fullfillment: false,
  //   "Happy Family": false,
  // },
};
export const bookings = {
  Type: {
    Puja: false,
    Chadhava: false,
  },
  Status: {
    "Active Booking": false,
    "Past Booking": false,
  },
};

export const static_review = [
  { img: rev_1, likes: 14 },
  { img: rev_4, likes: 15 },
  { img: rev_5, likes: 20 },
  { img: rev_6, likes: 24 },
  { img: rev_3, likes: 34 },
  { img: rev_2, likes: 20 },
];

export const language_short = {
  en: "En",
  hi: "हि",
};
export const dummyImages = [
  "https://c4.wallpaperflare.com/wallpaper/741/711/759/krishna-hindu-gods-bhagwan-vishnu-narayan-hd-wallpaper-preview.jpg",
];
