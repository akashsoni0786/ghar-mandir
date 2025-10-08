"use client";
import { environment } from "@/environment/environment";
import { pushToDataLayer } from "@/lib/gtm";
import { simpleDecrypt, simpleEncrypt } from "@/utils/cryption";
import axios from "axios";
import { countryCodes } from "./countrycode";
import { getLocalStorage, getLocalStorageUtm } from "@/services/storage";

export function generateId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
export const validateAddressField = (
  value: string,
  fieldName: string,
  t: any
) => {
  if (!value.trim()) return `${t(fieldName)} ${t("IS_REQUIRED")}`;
  if (fieldName === "Postal code" && value.length !== 6) {
    return t("POSTAL_CODE_ERROR");
  }
  if (value?.length > 80 && fieldName === "Street address") {
    return `${t("STREET_ADDRESS")} ${t("SHDNT_EXCEED_20_CHAR")}`;
  }
  if (value?.length > 20 && fieldName !== "Street address") {
    return `${t(fieldName)} ${t("SHDNT_EXCEED_20_CHAR")}`;
  }
  return "";
};

export const validatePhone = (
  phone: string,
  countryCode: string,
  t: (key: string) => string
) => {
  // Check if phone number is provided
  if (!phone) return t("PHN_REQ");

  // Find the country in countryCodes array
  const country = countryCodes.find((c) => c.code === countryCode);
  if (!country) return t("INVALID_COUNTRY_CODE") || "Invalid country code";

  // Calculate the length of the phone number (only digits)
  const phoneLength = phone.replace(/\D/g, "").length;

  // Calculate the expected min and max lengths (excluding country code length)
  const countryCodeLength = country.code.replace(/\D/g, "").length;
  const minLength = country.minlen - countryCodeLength;
  const maxLength = country.maxlen - countryCodeLength;

  // Validate that the phone number contains only digits
  if (!/^\d+$/.test(phone.replace(/\D/g, ""))) {
    return t("PHN_DIGITS_ONLY");
  }

  // Validate phone number length
  if (phoneLength < minLength) {
    return (
      `Phone number must be at least ${minLength} digits`
    );
  }
  if (phoneLength > maxLength) {
    return (
       `Phone number cannot exceed ${maxLength} digits`
    );
  }

  return "";
};

export const validateMember = (name: string, t: any) => {
  if (!name.trim()) return t("MEMBER_SHDNT_EMPTY");
  if (name && name?.length > 20) return t("MEMBER_SHDNT_EMPTY_EXCEED_20_CHAR");
  return "";
};
export const validatePitru = (name: string, t: any) => {
  if (!name.trim()) return "Pitru name field should not be empty";
  if (name && name?.length > 20)
    return "Pitru name should not exceed 20 characters";
  return "";
};
export const validateName = (name: string, t: any) => {
  if (!name.trim() || name?.trim() == "") return t("NAME_SHDNT_EMPTY");
  if (name && name?.length > 25)
    return "Name name should not exceed 25 characters";
  return "";
};

export const validateEmail = (email: string, t: any) => {
  const currency_name = getCurrencyName();
  if (currency_name == "USD") {
    if (!email.trim() || email?.trim() == "") return t("EMAIL_REQUIRED");
    else if (!/^\S+@\S+\.\S+$/.test(email)) return t("INVALID_EMAIL");
    return "";
  }
  return "";
};
export const validateGotra = (name: string) => {
  // if (!name.trim()) return "Member field should not be empty";
  if (name && name?.length > 20) return "Gotra should not exceed 20 characters";
  return "";
};

export const validatePrayer = (name: string) => {
  // if (!name.trim()) return "Member field should not be empty";
  if (name && name?.length > 200)
    return "Prayer should not exceed 200 characters";
  return "";
};

export const validateAll = (
  userData: any,
  setErrors: any,
  showAddress: boolean,
  t: any
) => {
  let newErrors: any = { members: {} };
  if (showAddress) {
    newErrors = {
      phone_no: validatePhone(userData.phone_no, userData.phone_code, t),
      members: {},
      pitruNames: {},
      gotra: validateGotra(userData?.gotra),
      address: {
        street_address: validateAddressField(
          userData.address.street_address,
          "Street address",
          t
        ),
        city: validateAddressField(userData.address.city, "City", t),
        state: validateAddressField(userData.address.state, "State", t),
        pincode: validateAddressField(
          userData.address.pincode,
          "Postal code",
          t
        ),
      },
      // prayer: validatePrayer(userData?.prayer ?? ""),
      username: validateName(userData?.username ?? "", t),
      email: validateEmail(userData?.email ?? "", t),
    };
  } else {
    newErrors = {
      phone_no: validatePhone(userData.phone_no, userData.phone_code, t),
      members: {},
      pitruNames: {},
      gotra: validateGotra(userData?.gotra),
      // prayer: validatePrayer(userData?.prayer ?? ""),
      username: validateName(userData?.username ?? "", t),
      address: {
        street_address: "",
        city: "",
        state: "",
        pincode: "",
      },
      email: validateEmail(userData?.email ?? "", t),
    };
  }
  Object.keys(userData.members).forEach((key) => {
    newErrors.members[key] = validateMember(userData.members[key], t);
  });

  Object.keys(userData.pitruNames).forEach((key) => {
    newErrors.pitruNames[key] = validatePitru(userData.pitruNames[key], t);
  });

  setErrors(newErrors);

  const errorExist = !Object.values(newErrors).some((error) =>
    typeof error === "string"
      ? error
      : Object.values(error as Record<string, unknown>).some((nestedError) =>
          typeof nestedError === "string"
            ? nestedError
            : typeof nestedError === "object" && nestedError !== null
            ? Object.values(nestedError).some((deepError) => deepError)
            : false
        )
  );
  return [errorExist, newErrors]; // Error and complete state value
};

export function formatPrasad(prasadItems) {
  const counts = {};
  prasadItems.forEach((item) => {
    if (item.count && item.count > 0)
      counts[item.title.trim()] = (counts[item.title.trim()] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([title, count]) => `${count} ${title}`)
    .join(", ");
}

// Helper function to format offerings (counts unique offerings)
export function formatOfferings(offerings) {
  const uniqueTitles = [...new Set(offerings.map((item) => item.title.trim()))];
  return uniqueTitles.join(", ");
}

export function getPackageCount(countObj, packageName) {
  // Convert both to lowercase for case-insensitive comparison
  const lowerPackageName = packageName.toLowerCase();

  // Find the key in countObj that matches (case-insensitive)
  const matchingKey = Object.keys(countObj).find(
    (key) => key.toLowerCase() === lowerPackageName
  );

  // Return the count if found, otherwise return undefined
  return matchingKey ? countObj[matchingKey] : undefined;
}

export function getFamilyPackageCount(packageName, countObj) {
  const allpackage = { ...packageName.chadhava, ...packageName.puja };
  let maxcount = 0;
  Object.keys(allpackage).forEach((val: any) => {
    maxcount = Math.max(countObj[allpackage[val].package.name], maxcount);
  });
  return isNaN(maxcount) ? 1 : maxcount;
}

export const getUtmData = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utm = {
    source: urlParams.get("utm_source") || "Direct",
    medium: urlParams.get("utm_medium") || "Direct",
    campaign: urlParams.get("utm_campaign") || "Direct",
  };
  return utm;
};

export const resetStorage = () => {
  // localStorage.removeItem("persist:root");
  const persistedData = JSON.parse(
    localStorage.getItem("persist:root_data") ?? "{}"
  );
  delete persistedData.checkout;
  delete persistedData.common;
  delete persistedData.order;
  localStorage.setItem("persist:root_data", JSON.stringify(persistedData));
};

export const addToCartDataLayer = (
  data: any,
  details: any,
  id: string,
  type: string
) => {
  pushToDataLayer("view_item", {
    ecommerce: {
      currency: getCurrencyName(),
      affiliation: "Ghar Mandir app",
      value: data?.price,
      items: [
        {
          item_brand: "Ghar Mandir",
          // an array with a product that was clicked
          item_name: details?.heading, // insert an actual product name
          item_id: id, // insert an actual product ID
          price: data?.price, // insert an actual product price. Number or a string. Don't include currency code
          item_category: type, // insert an actual product top-level category
          // item_category2: "T-shirt", // if it is possible to drill down the categories (e.g. Apparel, then T-shirt, then Men), use item_category2, item_category3, etc. Can use from item_category up to item_category5
          item_variant: data?.name, // insert an actual product variant
          // item_list_name: "Search results", // insert the name of the list where the product is currently displayed
          // item_list_id: "search_results", // insert the list id where the product is currently displayed
          index: data?.index ?? 1, // insert product's position in that list
          quantity: "1", // product quantity. In this case, it will usually be equal to 1
        },
      ],
    },
  });
};

export const removeExtraKeys = (data: any, details: any, image: any) => {
  const temp = structuredClone(data);
  if (temp?.sub_name) temp.name = temp.name + " " + temp?.sub_name;
  delete temp.active;
  delete temp.image;
  delete temp.img_class;
  delete temp.index;
  delete temp.sub_name;
  return { ...temp, ...details, image };
};

export const packData = (prasad_count: number, offering_count: number) => {
  let str = "";
  if (prasad_count > 0) {
    if (prasad_count > 1) str += `${prasad_count} Prasad`;
    else str += `Prasad `;
  }
  if (offering_count > 0) {
    if (prasad_count == 0) {
      str += `${offering_count} Ad Ons`;
    } else str += `+${offering_count} Ad Ons`;
  }
  return str;
};
export function extractCategoryAndName(path) {
  if (!path) return { category: null, name: null, rawName: null };

  // Trim slashes from both ends and split
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;
  const finalPath = trimmedPath.endsWith("/")
    ? trimmedPath.slice(0, -1)
    : trimmedPath;
  const parts = finalPath.split("/");

  if (parts.length < 2) {
    return { category: null, name: null, rawName: null };
  }

  const category = parts[0];
  const rawName = parts[1];

  // Replace underscores with spaces for the display name
  const name = rawName.split("_").join(" ");

  return {
    category,
    name,
    rawName,
  };
}

export function findPoojaOrChadhavaByName(data, name, category) {
  if (category == "puja") {
    for (const key in data?.puja) {
      if (data.puja[key].poojaName === name) {
        return data.puja[key];
      }
    }
  } else
    for (const key in data.chadhava) {
      if (data.chadhava[key].chadhaavaName === name) {
        return data.chadhava[key];
      }
    }
  if (category == "puja") {
    const firstKey = Object?.keys(data?.puja)[0];
    return data?.puja[firstKey];
  } else {
    const firstKey = Object?.keys(data?.chadhava)[0];
    const firstpujaKey = Object?.keys(data?.puja)[0];

    return data?.chadhava[firstKey]
      ? data?.chadhava[firstKey]
      : data?.puja[firstpujaKey];
  }

  return null; // Not found
}

export function trimObjectToCount(obj, count) {
  if (typeof obj !== "object" || obj === null) return { ...obj };

  return Object.keys(obj)
    .slice(0, count)
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

export function formatTitles(data, maxTitles = 3) {
  if (!data || data.length === 0) return "";

  const titles = data.map((item) => item.title);

  if (titles.length <= maxTitles) {
    return titles.join(", ");
  }

  return `${titles.slice(0, maxTitles).join(", ")} etc`;
}

export function getActiveFilters(filters) {
  if (Object.keys(filters ?? {})?.length == 0) return {};
  const result: any = {};

  // Process Time (include all keys regardless of value)
  result.time = Object.entries(filters.Time)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  // Process Deity (only include keys with true values)
  result.deity = Object.entries(filters.Deity)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  // Process Benefits (only include keys with true values)
  result.benefits = Object.entries(filters.Benefits)
    .filter(([_, value]) => value)
    .map(([key]) => key);
  if (result.time?.length == 0) delete result.time;
  if (result.deity?.length == 0) delete result.deity;
  if (result.benefits?.length == 0) delete result.benefits;
  return result;
}

export function transformData(inputData, userInfo: any, type: string) {
  // Calculate total amount
  const calculateTotal = (data) => {
    let total = 0;

    // Add package price if exists
    if (data.activePackage?.price) {
      total += data.activePackage.price;
    }

    // Add moreOffer prices
    if (data.moreOffer) {
      data.moreOffer.forEach((offer) => {
        if (offer.count && offer.count > 0)
          total += (offer.price || 0) * (offer.count || 1);
      });
    }

    // Add prasad prices
    if (data.prasad) {
      data.prasad.forEach((prasad) => {
        if (prasad.count && prasad.count > 0)
          total += (prasad.price || 0) * (prasad.count || 1);
      });
    }

    return total;
  };

  // Transform the package information
  const transformPackage = (pkg) => {
    if (!pkg) return null;
    return {
      name: pkg.name ?? "",
      price: pkg.price ?? 0,
    };
  };

  // Transform the product information
  const transformProduct = (pkg) => {
    if (!pkg) return null;
    return {
      ...(inputData?.poojaId
        ? { poojaId: inputData?.poojaId }
        : { chadhaavaId: inputData?.chadhaavaId }),
      subHeading: pkg.subHeading,
      heading: pkg.heading,
      poojaTemple: pkg.poojaTemple,
      poojaDay: pkg.poojaDay,
      description: pkg.description,
      image: pkg.image || [],
    };
  };
  // Prepare user info with defaults
  const user = {
    userId: userInfo?.authToken ?? "",
    userName: userInfo?.username ?? "",
    mobileNumber: userInfo?.mobile ?? "",
  };

  return {
    totalAmount: calculateTotal(inputData),
    offerings: inputData.moreOffer
      ? inputData.moreOffer.filter((offer) => {
          // if (offer.count && offer.count > 0)
          return {
            offeringId: offer.offeringId,
            image: offer.image,
            title: offer.title,
            description: offer.description,
            price: offer.price,
            ...(offer.count ? { count: offer.count } : {}),
          };
        })
      : [],
    prasad: inputData.prasad
      ? inputData.prasad.filter((prasad) => {
          // if (prasad.count && prasad.count > 0)
          return {
            prasadId: prasad.prasadId,
            image: prasad.image,
            title: prasad.title,
            description: prasad.description,
            price: prasad.price,
            ...(prasad.count ? { count: prasad.count } : {}),
          };
        })
      : [],
    package: transformPackage(inputData.activePackage),
    product: transformProduct(inputData.activePackage),
    userId: user.userId,
    userName: user.userName,
    mobileNumber: user.mobileNumber,
    ...(inputData?.poojaName
      ? { poojaName: inputData?.poojaName }
      : { chadhaavaName: inputData?.chadhaavaName }), // This seems to be hardcoded in example
    type: type, // This seems to be hardcoded in example
  };
}

export function transformToListingDataLayer(
  responseData,
  listName,
  listId,
  type
) {
  // Transform each item in the response
  const items = responseData.map((item, index) => ({
    item_name: item.heading,
    item_id: item.poojaId ?? item.chadhaavaId,
    price: item.offerings?.[0]?.price?.toString() || "0", // Using first offering price or 0
    item_brand: item.poojaTemple,
    item_category: type, // Top-level category
    item_variant: item.offerings?.[0]?.title || "Standard", // First offering as variant
    item_list_name: listName,
    item_list_id: listId,
    index: index + 1, // 1-based index
    quantity: "1",
  }));

  return {
    event: "view_item_list",
    ecommerce: {
      currency: getCurrencyName(), // Assuming Indian Rupees based on the data
      items: items,
    },
  };
}

export function transformToSelectItemEvent(
  selectedProduct,
  listName,
  listId,
  position,
  type
) {
  // Get the first offering price or default to 0
  const price = selectedProduct.offerings?.[1]?.price || 0;

  // Create the item object
  const item = {
    item_name: selectedProduct.heading,
    item_id: selectedProduct.poojaId ?? selectedProduct.chadhaavaId,
    price: price.toString(),
    item_brand: selectedProduct.poojaTemple,
    item_category: type,
    item_variant: selectedProduct.offerings?.[0]?.title || "Standard",
    item_list_name: listName,
    item_list_id: listId,
    index: position, // Position in the list (1-based)
    quantity: "1",
  };

  return {
    event: "select_item",
    ecommerce: {
      currency: getCurrencyName(), // Assuming Indian Rupees based on the data
      value: price, // The monetary value of the item
      items: [item], // Must be an array with one item
    },
  };
}

export function transformToViewItemEvent(poojaData, type) {
  // Get the first package price or default to 0
  const price = poojaData.packages?.[0]?.price || 0;

  // Create the item object
  const item = {
    item_name: poojaData.details.heading,
    item_id: poojaData.poojaId ?? poojaData.chadhaavaId,
    price: price.toString(),
    item_brand: poojaData.details.poojaTemple,
    item_category: type,
    item_variant: poojaData.packages?.[0]?.title || "Standard",
    quantity: "1",
  };

  return {
    event: "view_item",
    ecommerce: {
      currency: getCurrencyName(), // Assuming Indian Rupees based on the data
      value: price, // The monetary value of the item
      items: [item], // Must be an array with one item
    },
  };
}

export function transformToAddToCartEvent(cartData, userData = {}) {
  // Create items array
  const items: any = [];
  let totalAmount = 0;

  // Add package item if exists
  if (cartData.package) {
    const packagePrice = parseFloat(cartData.package.price.toString());
    totalAmount += packagePrice;

    items.push({
      item_name: cartData.package.name,
      item_id: `${
        cartData?.product?.chadhaavaId ?? cartData?.product?.poojaId
      }`,
      price: cartData.package.price.toString(),
      item_brand: cartData.product.poojaTemple,
      item_category: cartData.type,
      ...(cartData?.product?.chadhaavaId
        ? {}
        : { item_variant: cartData.package.name }),
      quantity: "1",
    });
  }

  // Add offerings items
  if (cartData.offerings) {
    cartData.offerings.forEach((offering) => {
      const offeringPrice = parseFloat(offering.price.toString());
      const quantity = offering?.count
        ? parseInt(offering?.count?.toString())
        : 0;
      totalAmount += offeringPrice * quantity;

      // items.push({
      //   item_name: offering.title,
      //   item_id: offering.offeringId,
      //   price: offering.price.toString(),
      //   item_brand: cartData.product.poojaTemple,
      //   item_category: cartData.type,
      //   item_variant: offering.title,
      //   quantity: quantity.toString(),
      // });
    });
  }

  // Add prasad items
  if (cartData.prasad) {
    cartData.prasad.forEach((prasad) => {
      const prasadPrice = parseFloat(prasad?.price?.toString());
      const quantity = prasad?.count ? parseInt(prasad?.count?.toString()) : 0;
      totalAmount += prasadPrice * quantity;

      // items.push({
      //   item_name: prasad.title,
      //   item_id: prasad.prasadId,
      //   price: prasad.price.toString(),
      //   item_brand: cartData.product.poojaTemple,
      //   item_category: cartData.type,
      //   item_variant: prasad.title,
      //   quantity: quantity.toString(),
      // });
    });
  }

  return {
    event: "add_to_cart",
    ecommerce: {
      currency: getCurrencyName(),
      value: totalAmount,
      items: items,
    },
  };
}

export function transformToAddToCartEventChadhava(cartData) {
  // Create items array
  const items: any = [];
  let totalAmount = 0;

  // Add package item if exists
  if (cartData.data) {
    items.push({
      item_name: cartData.data.details.heading,
      item_id: `${cartData?.data?.chadhaavaId ?? cartData?.data?.poojaId}`,
      price: cartData.priceData.total_price.toString(),
      item_brand: cartData.data.details.poojaTemple,
      item_category: cartData.data.type,
      ...(cartData?.data?.chadhaavaId
        ? {}
        : { item_variant: cartData.data.chadhaavaName }),
      quantity: "1",
    });
  }

  // Add offerings items
  if (cartData.offerings) {
    cartData.offerings.forEach((offering) => {
      const offeringPrice = parseFloat(offering.price.toString());
      const quantity = offering?.count
        ? parseInt(offering?.count?.toString())
        : 0;
      totalAmount += offeringPrice * quantity;

      // items.push({
      //   item_name: offering.title,
      //   item_id: offering.offeringId,
      //   price: offering.price.toString(),
      //   item_brand: cartData.product.poojaTemple,
      //   item_category: cartData.type,
      //   item_variant: offering.title,
      //   quantity: quantity.toString(),
      // });
    });
  }

  // Add prasad items
  if (cartData.prasad) {
    cartData.prasad.forEach((prasad) => {
      const prasadPrice = parseFloat(prasad?.price?.toString());
      const quantity = prasad?.count ? parseInt(prasad?.count?.toString()) : 0;
      totalAmount += prasadPrice * quantity;

      // items.push({
      //   item_name: prasad.title,
      //   item_id: prasad.prasadId,
      //   price: prasad.price.toString(),
      //   item_brand: cartData.product.poojaTemple,
      //   item_category: cartData.type,
      //   item_variant: prasad.title,
      //   quantity: quantity.toString(),
      // });
    });
  }

  return {
    event: "add_to_cart",
    ecommerce: {
      currency: getCurrencyName(),
      value: totalAmount,
      items: items,
    },
  };
}

export function transformToAddToCartEventPuja(cartData) {
  // Create items array
  const items: any = [];
  const totalAmount = Number(cartData?.activePackage?.price) ?? 0;

  // Add package item if exists
  if (cartData.data) {
    items.push({
      item_name: cartData.data.details.heading,
      item_id: `${cartData?.data?.chadhaavaId ?? cartData?.data?.poojaId}`,
      price: cartData.activePackage.price.toString(),
      item_brand: cartData.data.details.poojaTemple,
      item_category: cartData.data.type,
      item_variant: cartData.activePackage.name,
      quantity: "1",
    });
  }
  return {
    event: "add_to_cart",
    ecommerce: {
      currency: getCurrencyName(),
      value: totalAmount,
      items: items,
    },
  };
}

export function transformToViewCartEvent(cartItems) {
  let cartValue = 0;
  const items: any = [];

  cartItems.forEach((item, index) => {
    let itemTotal = 0;

    // Add package if exists
    if (item.package) {
      const packagePrice = parseFloat(item.package.price?.toString() || "0");
      itemTotal += packagePrice;
      let curr_price = 0;
      if (item.product.chadhaavaId) {
        item.offerings.map((val) => {
          curr_price += (val?.count ?? 0) * val?.price;
        });
      }
      items.push({
        item_name: item.product.heading,
        item_id: item.product.poojaId || item.product.chadhaavaId,
        price: item.product.chadhaavaId
          ? curr_price
          : item.package.price || "0",
        item_brand: "Ghar Mandir", //item.product.poojaTemple,
        item_category: item.type,
        item_variant: item.package.name,
        quantity: "1",
        index: index + 1,
      });
    }

    // Add offerings if exists
    if (item.offerings) {
      item.offerings.forEach((offering) => {
        const offeringPrice = parseFloat(offering.price.toString());
        const quantity = offering.count
          ? parseInt(offering.count.toString())
          : 0;
        itemTotal += offeringPrice * quantity;

        // items.push({
        //   item_name: offering.title,
        //   item_id: offering.offeringId,
        //   price: offering.price.toString(),
        //   item_brand: item.product.poojaTemple,
        //   item_category: item.type,
        //   item_variant: offering.title,
        //   quantity: quantity.toString(),
        //   index: index + 1,
        // });
      });
    }

    // Add prasad if exists
    if (item.prasad) {
      item.prasad.forEach((prasad) => {
        const prasadPrice = parseFloat(prasad.price.toString());
        const quantity = prasad.count ? parseInt(prasad.count.toString()) : 0;
        itemTotal += prasadPrice * quantity;

        // items.push({
        //   item_name: prasad.title,
        //   item_id: prasad.prasadId,
        //   price: prasad.price.toString(),
        //   item_brand: item.product.poojaTemple,
        //   item_category: item.type,
        //   item_variant: prasad.title,
        //   quantity: quantity.toString(),
        //   index: index + 1,
        // });
      });
    }

    cartValue += itemTotal;
  });

  // Limit items to first 3 if needed (optional)
  // const limitedItems = items.slice(0, 3);

  return {
    event: "view_cart",
    ecommerce: {
      currency: getCurrencyName(),
      value: cartValue,
      items: items, // or limitedItems if you want to limit
    },
  };
}

// export function transformToBeginCheckoutEvent(cartItems) {
//   // Calculate total cart value (sum of all package prices)
//   const cartValue = cartItems.reduce((total, item) => {
//     return total + (item.package?.price || 0);
//   }, 0);

//   // Create items array with only the main packages (limit to 3 items)
//   const items = cartItems.slice(0, 3).map((item) => ({
//     item_name: item.package?.name || item.product.heading,
//     item_id: item.product.poojaId || item.product.chadhaavaId,
//     price: item.package?.price?.toString() || "0",
//     item_brand: item.product.poojaTemple,
//     item_category: item.type,
//     item_variant: item.package?.name || "Standard",
//     quantity: "1",
//   }));

//   return {
//     event: "begin_checkout",
//     ecommerce: {
//       currency: getCurrencyName(),
//       value: cartValue,
//       items: items,
//     },
//   };
// }

export function transformToBeginCheckoutEvent(cartItems) {
  let cartValue = 0;
  const items: any = [];

  cartItems.forEach((item, index) => {
    let itemTotal = 0;

    // Add package if exists
    if (item.package) {
      const packagePrice = parseFloat(item.package.price?.toString() || "0");
      itemTotal += packagePrice;
      let curr_price = 0;

      if (item.product.chadhaavaId) {
        item.offerings?.forEach((val) => {
          curr_price += (val?.count ?? 0) * val?.price;
        });
      }

      items.push({
        item_name: item.product.heading,
        item_id: item.product.poojaId || item.product.chadhaavaId,
        price: item.product.chadhaavaId
          ? curr_price.toString()
          : item.package.price?.toString() || "0",
        item_brand: "Ghar Mandir",
        item_category: item.type,
        item_variant: item.package.name,
        quantity: "1",
        index: index + 1,
      });
    }

    // Calculate offerings total
    if (item.offerings) {
      item.offerings.forEach((offering) => {
        const offeringPrice = parseFloat(offering.price.toString());
        const quantity = offering.count
          ? parseInt(offering.count.toString())
          : 0;
        itemTotal += offeringPrice * quantity;
      });
    }

    // Calculate prasad total
    if (item.prasad) {
      item.prasad.forEach((prasad) => {
        const prasadPrice = parseFloat(prasad.price.toString());
        const quantity = prasad.count ? parseInt(prasad.count.toString()) : 0;
        itemTotal += prasadPrice * quantity;
      });
    }

    cartValue += itemTotal;
  });

  return {
    event: "begin_checkout",
    ecommerce: {
      currency: getCurrencyName(),
      value: cartValue,
      items: items,
    },
    utm_source: getLocalStorageUtm("utm_source") ?? "",
    utm_medium: getLocalStorageUtm("utm_medium") ?? "",
    utm_campaign: getLocalStorageUtm("utm_campaign") ?? "",
    utm_content: getLocalStorageUtm("utm_content") ?? "",
    utm_term: getLocalStorageUtm("utm_term") ?? "",
  };
}

export function generatePurchaseEvents(cartdata, redux, totalAmout) {
  try{
    const [firstName = "", lastName = ""] = (redux?.auth?.username || "").split(" ");
    
    const billing = {
      first_name: firstName,
      last_name: lastName,
      company: "Ghar Mandir", // Add if available
      ...(redux?.checkout?.address?.address?.street_address && {
        address_1: redux?.checkout?.address?.address?.street_address || "",
      }),
      ...(redux?.checkout?.address?.address?.city && {
        city: redux?.checkout?.address?.address?.city || "",
      }),
      ...(redux?.checkout?.address?.address?.state && {
        state: redux?.checkout?.address?.address?.state || "",
      }),
      ...(redux?.checkout?.address?.address?.pincode && {
        postcode: redux?.checkout?.address?.address?.pincode || "",
      }),
      ...(redux?.checkout?.address?.address?.country && {
        country: redux?.checkout?.address?.address?.country || "India",
      }),
      email: redux?.auth?.email || "", // Add if available in redux
      phone: redux?.auth?.mobile || "",
    };
    
    const transactionId =
    redux?.common?.transactionId?.paymentId || `${Date.now()}`;
    
    const items: any = [];
    
    cartdata.forEach((item) => {
      const product = item?.product;
      
      // Base item
      items.push({
        item_id: product?.poojaId || product?.chadhaavaId || "",
        item_name: product?.heading || "",
        sku: product?.poojaId || product?.chadhaavaId || "",
        price: item?.package?.price || 0,
        stocklevel: null,
        stockstatus: "instock",
        google_business_vertical: "retail",
        item_category: item?.temple || "", // e.g., "Banke Bihari, Vrindavan"
        id: product?.poojaId || product?.chadhaavaId || "",
        quantity: 1,
      });
    });
    let totalValue = items.reduce(
      (sum, item) => sum + item.price * (item?.quantity || 1),
      0
    );
    cartdata?.forEach((price_val: any) => {
      if (price_val?.offerings && price_val?.offerings?.length) {
        price_val?.offerings?.map((prc: any) => {
          if (prc.count && prc.count > 0) totalValue += prc.count * prc.price;
        });
      }
      if (price_val?.prasad && price_val?.prasad?.length) {
        price_val?.prasad?.map((prc: any) => {
          if (prc.count && prc.count > 0) totalValue += prc.count * prc.price;
        });
      }
    });
    return {
      event: "purchase",
      orderData: {
        customer: {
          billing,
        },
      },
      ecommerce: {
        currency: getCurrencyName(),
        transaction_id: transactionId,
        affiliation: "",
        value: totalAmout,
        tax: 0,
        shipping: 0,
        coupon: "",
        items,
      },
    };
  }catch(e){
      console.error("Event:Error:", e, { username: redux?.auth?.username  || "" })
  }
}

export function formatMembersWithButton(members) {
  const result: any = [];

  // Create pairs of members (2 per sub-array)
  for (let i = 0; i < members?.length; i += 2) {
    const pair = members.slice(i, i + 2);
    result.push(pair);
  }

  // Handle the "Add-button" placement
  if (result.length === 0) {
    // Empty case: [ [empty, 'Add-button'] ]
    return [[null, "Add-button"]];
  }

  const lastPair = result[result.length - 1];

  if (lastPair.length === 1) {
    // Single member in last pair: [ [mem1, 'Add-button'] ]
    lastPair.push("Add-button");
  } else {
    // Full pair, add new sub-array: [ [empty, 'Add-button'] ]
    result.push([null, "Add-button"]);
  }

  return result;
}
export function reverseFormattedMembers(formattedMembers) {
  const members: any = [];

  for (const row of formattedMembers) {
    for (const item of row) {
      if (item !== null && item !== "Add-button") {
        members.push(item);
      }
    }
  }

  return members;
}
export const fetchCurrency = async () => {
  try {
    const response = await axios.get(
      `${environment?.API_ENDPOINT}userIpDetails`
    );
    return response?.data;
  } catch (error) {
    console.error("IP error:", error);
    throw error;
  }
};
export const encryptStorageKey = (key: string) =>
  simpleEncrypt(`storage_${key}`);
export const decryptStorageValue = (value: string | null) => {
  if (!value) return null;
  try {
    return simpleDecrypt(value);
  } catch {
    return null;
  }
};

export const getSign = () => {
  const currencyKey = encryptStorageKey("currency");
  const encryptedCurrency = localStorage.getItem(currencyKey);
  const currency = decryptStorageValue(encryptedCurrency) ?? "INR";

  if (currency === "USD") return "$";
  return "₹";
};

export const getCurrencyName = () => {
  const currencyKey = encryptStorageKey("currency");
  const encryptedCurrency = localStorage.getItem(currencyKey);
  return decryptStorageValue(encryptedCurrency) ?? "INR";
};
export const uploadImage = async (baseUrl, toast, file, section = "") => {
  const formData = new FormData();
  formData.append("images", file);
  try {
    const response = await axios.post(`${baseUrl}image/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success && response.data.imageUrls?.length > 0) {
      toast.show(
        response.data.message || "Image uploaded successfully!",
        "success"
      );
      return response.data.imageUrls[0];
    } else {
      toast.show("Failed to upload image: No URL returned.", "error");
      throw new Error("Upload failed");
    }
  } catch (error) {
    toast.show("Error uploading image.", "error");
    console.error("Image upload error:", error);
    throw error;
  }
};
export function arrayToIdObject(arr) {
  const result = {};
  arr.forEach((item, index) => {
    result[`id${index + 1}`] = item;
  });
  return result;
}
export function extractIdsAdvanced(encodedString: string) {
  const params = new URLSearchParams(
    encodedString.replace(/%26/g, "&").replace(/%3D/g, "=")
  );
  return {
    orderId: params.get("booking_id") || encodedString.split("%26")[0],
    ...(params.get("poojaId")
      ? { poojaId: params.get("poojaId") }
      : { chadhavaId: params.get("chadhavaId") }),
  };
}

// This handles all cases including when the parameters are in different orders
export function capitalizeWord(word: string) {
  if (!word) return word; // handle empty string
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function chadhavaSpell(word: string) {
  if (word.includes("hadha") || word.includes("HADHA")) return "Chadhava";
  else return word;
}

export const filterResult = (allPujaClone: any, params: any) => {
  let filteredPujas = [...allPujaClone];

  if (params?.search && params?.search?.length > 0) {
    const searchTerm = params.search.toLowerCase();
    filteredPujas = filteredPujas.filter(
      (puja: any) =>
        puja.heading.toLowerCase().includes(searchTerm) ||
        (puja.description &&
          puja.description.toLowerCase().includes(searchTerm))
    );
  }

  // Filter based on tags (Deity and Benefits)
  if (params && Object.keys(params).length > 0) {
    // Get all active filters from Deity and Benefits
    const activeFilters: any = [];

    if (params.Deity) {
      for (const deity in params.Deity) {
        if (params.Deity[deity] === true) {
          activeFilters.push(deity);
        }
      }
    }

    if (params.Benefits) {
      for (const benefit in params.Benefits) {
        if (params.Benefits[benefit] === true) {
          activeFilters.push(benefit);
        }
      }
    }

    // If there are any active filters, apply them
    if (activeFilters.length > 0) {
      filteredPujas = filteredPujas.filter((puja: any) => {
        return activeFilters.some(
          (filter) => puja.tag && puja.tag.includes(filter)
        );
      });
    }
  }

  // setAllPuja(filteredPujas);
  return filteredPujas;
};

export function transformToRemoveItemCartEvent(removed_id) {
  return {
    event: "remove_from_cart",
    ecommerce: {
      currency: getCurrencyName(),
      items: [
        {
          item_id: removed_id,
        },
      ],
    },
  };
}

export const visitedUserDataLayerCheck = () => {
  const persistedData = JSON.parse(
    localStorage.getItem("persist:root_data") ?? "{}"
  );
  return {
    ...JSON.parse(persistedData?.auth || "{}"),
  };
};

export function transformEventPayloadFailPaymentEvent(evendData) {
  return {
    event: "fail_payment_web",
    ...evendData,
  };
}

export function deepEqualObject(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqualObject(a[key], b[key])) return false;
  }

  return true;
}
export function formatOfferingsMax(offerings, recomPrice) {
  if ((!offerings || !Array.isArray(offerings)) && recomPrice == 0)
    return false;

  const countedItems = offerings
    .filter((offering) => offering?.count > 0)
    .map((offering) => `${offering.count} ${offering.title?.trim() || "Item"}`);

  if (countedItems.length === 0 && recomPrice == 0) return "No offerings";
  if (countedItems.length === 0 && recomPrice > 0) return "Add ons price";
  let result = countedItems.join(", ");

  // Truncate to 15 chars (including the ...) if needed
  const MAX_LENGTH = 25;
  if (result.length > MAX_LENGTH) {
    // Find the last space before MAX_LENGTH-3 to avoid breaking words
    let truncateAt = result.lastIndexOf(" ", MAX_LENGTH - 3);
    if (truncateAt <= 0) truncateAt = MAX_LENGTH - 3;
    result = result.substring(0, truncateAt) + "...";
  }
  if (countedItems.length > 0 && recomPrice > 0) return "Add ons +" + result;
  return result;
}

export function hasOfferingsWithCountOrMultiplePujas(data) {
  // Check if Puja array exists and has more than one item
  const hasMultiplePujas = data.Puja && data.Puja.length > 0;
  if (hasMultiplePujas) return hasMultiplePujas;
  // Check offerings in Puja array (if exists)
  const pujaHasValidOfferings =
    data.Puja &&
    data.Puja.some((puja) => {
      return (
        puja.offerings &&
        Array.isArray(puja.offerings) &&
        puja.offerings.some(
          (offering) =>
            typeof offering === "object" &&
            offering !== null &&
            "count" in offering &&
            offering.count > 0
        )
      );
    });

  // Check offerings in Chadhava array (if exists)
  const chadhavaHasValidOfferings =
    data.Chadhava &&
    data.Chadhava.some((chadhava) => {
      return (
        chadhava.offerings &&
        Array.isArray(chadhava.offerings) &&
        chadhava.offerings.some(
          (offering) =>
            typeof offering === "object" &&
            offering !== null &&
            "count" in offering &&
            offering.count > 0
        )
      );
    });
  return hasMultiplePujas || pujaHasValidOfferings || chadhavaHasValidOfferings;
}
export function needOfAddresss(data) {
  // Check offerings in Puja array (if exists)
  const pujaHasValidOfferings =
    data.Puja &&
    data.Puja.some((puja) => {
      return (
        puja.prasad &&
        Array.isArray(puja.prasad) &&
        puja.prasad.some(
          (offering) =>
            typeof offering === "object" &&
            offering !== null &&
            "count" in offering &&
            offering.count > 0
        )
      );
    });

  // Check prasad in Chadhava array (if exists)
  const chadhavaHasValidprasad =
    data.Chadhava &&
    data.Chadhava.some((chadhava) => {
      return (
        chadhava.prasad &&
        Array.isArray(chadhava.prasad) &&
        chadhava.prasad.some(
          (offering) =>
            typeof offering === "object" &&
            offering !== null &&
            "count" in offering &&
            offering.count > 0
        )
      );
    });
  return pujaHasValidOfferings || chadhavaHasValidprasad;
}

export function needOfPitruNames(data) {
  if (
    (!data.Puja || data.Puja.length === 0) &&
    (!data.Chadhava || data.Chadhava.length === 0)
  ) {
    return 0; // No Puja or Chadhava data
  }
  let result = 0;

  if (data.Chadhava?.length > 0) {
    result = data.Chadhava.some((chad) => chad?.pitruNameIncluded) ? 1 : 0;
  }
  if (data.Puja?.length > 0) {
    result = data.Puja.some((puja) => puja.pitruNameIncluded) ? 2 : result;
  }
  return result;
}

export function needOfNormalNames(data) {
  if (
    (!data.Puja || data.Puja.length === 0) &&
    (!data.Chadhava || data.Chadhava.length === 0)
  ) {
    return 0; // No Puja or Chadhava data
  }
  let result = 0;

  if (data.Chadhava?.length > 0) {
    result = data.Chadhava.some((chad) => !chad?.pitruNameIncluded) ? 1 : 0;
  }
  if (data.Puja?.length > 0) {
    result = data.Puja.some((puja) => !puja.pitruNameIncluded) ? 2 : result;
  }
  return result;
}

export function needForMemberAndPitruNames(data) {
  if (
    (!data.Puja || data.Puja.length === 0) &&
    (!data.Chadhava || data.Chadhava.length === 0)
  ) {
    return false; // No Puja or Chadhava data
  }

  let chadhavaRes = true;
  let pujaResult = true;

  if (data.Chadhava?.length > 0) {
    chadhavaRes = data.Chadhava.every((chad) => chad?.pitruNameIncluded);
  }

  if (data.Puja?.length > 0) {
    pujaResult = data.Puja.every((puja) => puja.pitruNameIncluded);
  }
  return chadhavaRes && pujaResult;
}
/**
 * Checks if a date string is in the past compared to today's date
 * @param {string} dateString - Date string in various formats
 * @returns {boolean} - True if date is in the past or if date cannot be parsed
 */
export function isDateInPast(dateString: string) {
  if (!dateString || dateString.trim() === "") {
    return true; // Consider empty dates as past
  }

  const months: Record<string, number> = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  try {
    // Remove commas for easier splitting
    const normalized = dateString.replace(/,/g, "").trim();
    const parts = normalized.split(/\s+/);

    if (parts.length < 2) return true;

    // Day → remove suffixes like 7th, 21st, 22nd, 23rd
    const day = parseInt(parts[0].replace(/(st|nd|rd|th)$/i, ""), 10);

    // Month (2nd part)
    const monthName = parts[1];

    // Year → look for a valid 4-digit year anywhere
    let year: number | null = null;
    for (const p of parts) {
      const maybeYear = parseInt(p, 10);
      if (!isNaN(maybeYear) && maybeYear > 999) {
        year = maybeYear;
        break;
      }
    }

    // If year missing → assume current year
    if (!year) {
      year = new Date().getFullYear();
    }

    // Validate
    if (isNaN(day)) return true;
    if (!months.hasOwnProperty(monthName)) return true;

    // Build date
    const inputDate = new Date(year, months[monthName], day);
    const today = new Date();

    // Normalize both
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  } catch {
    return true; // Any parsing error → consider past
  }
}


export function formatTimestampToReadableDate(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // "Aug"
  const year = date.getFullYear();
  const weekday = date.toLocaleString("en-US", { weekday: "long" }); // "Monday"

  return `${day} ${month}, ${year} ${weekday}`;
}
