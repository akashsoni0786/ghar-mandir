export function convertOldToNewFormat(oldData) {
  const updatedData = [];

  // Iterate through each entry in the old data
  for (const [key, value] of Object.entries(oldData)) {
    const newEntry = {
      _id: generateObjectId(), // You might want to generate a new ID or keep the old one if available
      cartId: value.product.chadhaavaId ?? value.product.poojaId, //?? generateUUID(), // Generate a new cart ID
      createdAt: {
        timestamp: Date.now(),
        localTime: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      },
      userId: value.userId || 0, // Use the existing userId or default to 0
      product: value.product,
      package: value.package,
      prasad: value.prasad || [],
      offerings: value.offerings || [],
      totalAmount: value.totalAmount || 0,
      mobileNumber: value.mobileNumber || "",
      type: value.type,
      isInternational: false,
      poojaOrChadhavaName: value.poojaName || value.chadhaavaName || "",
      status: "ACTIVE",

      prasadIncluded: value.prasadIncluded || false,
      pitruNameIncluded: value.pitruNameIncluded || false,
    };

    // Add member_package_list if it exists in the old data
    if (value.member_package_list) {
      newEntry.member_package_list = value.member_package_list;
    }

    updatedData.push(newEntry);
  }

  return updatedData;
}

// Helper function to generate a MongoDB-like ObjectId
function generateObjectId() {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const randomValue = Math.floor(Math.random() * 16777215).toString(16);
  return (
    timestamp +
    "0".repeat(24 - timestamp.length - randomValue.length) +
    randomValue
  );
}

// Helper function to generate a UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function convertEditDataToCartData(oldData) {
  // Generate current timestamp
  const currentTimestamp = Date.now();
  const currentDate = new Date();

  // Format local time as "dd/mm/yyyy, hh:mm:ss am/pm"
  const formattedLocalTime = currentDate
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(",", "");

  // Create the new format structure
  const newFormat = {
    _id: generateObjectId(),
    cartId: oldData.package_param.cartId || generateUUID(),
    createdAt: {
      timestamp: currentTimestamp,
      localTime: formattedLocalTime,
    },
    userId: oldData.package_param.userId || 0,
    product: {
      poojaId: generateUUID(),
      subHeading: "",
      heading: "",
      poojaTemple: "",
      poojaDay: "",
      description: "",
      image: [],
    },
    package: oldData.package_param.package || { name: "", price: 0 },
    prasad: oldData.package_param.prasad || [],
    offerings: oldData.package_param.offerings
      ? oldData.package_param.offerings.map((offering) => ({
          _id: generateObjectId(),
          offeringId: offering.offeringId || generateUUID(),
          title: offering.title || "",
          description: offering.description || "",
          image: offering.image || "",
          temple: "",
          price: offering.price || 0,
          status: "ACTIVE",
          createdAt: {
            timestamp: currentTimestamp,
            localTime: formattedLocalTime,
          },
          type: "MORE_OFFERING",
          __v: 0,
          ...(offering.count ? { count: offering.count } : {}),
        }))
      : [],
    totalAmount: oldData.package_param.totalAmount || 0,
    mobileNumber: "",
    type: "PUJA",
    isInternational: false,
    poojaOrChadhavaName: "",
    status: "ACTIVE",
    __v: 0,
  };

  // Add member_package_list if it exists in the old data
  if (oldData.package_param.member_package_list) {
    newFormat.member_package_list = oldData.package_param.member_package_list;
  }

  return newFormat;
}

export function convertEarlyDataToaddtocartdata(oldData) {
  // Extract the selected package (assuming the first package is selected in this example)
  // In a real scenario, you might need to know which package was selected
  const selectedPackage = oldData.data.packages[0] || { title: "", price: 0 };

  // Create the new format object
  const newFormat = {
    totalAmount: oldData.priceData.total_price,
    offerings: oldData.offerings,
    prasad: oldData.prasad,
    package: {
      name: selectedPackage.title,
      price: selectedPackage.price,
    },
    product: {
      chadhaavaId: oldData.data.chadhaavaId,
      subHeading: oldData.data.details.subHeading,
      heading: oldData.data.details.heading,
      poojaTemple: oldData.data.details.poojaTemple,
      poojaDay: oldData.data.details.poojaDay,
      description: oldData.data.details.description,
      image: oldData.data.image,
    },
    userId: oldData?.redux?.auth?.authToken ?? "", // This would typically come from user data
    userName: oldData?.redux?.auth?.username ?? "", // This would typically come from user data
    mobileNumber: "", // This would typically come from user data
    chadhaavaName: oldData?.data?.chadhaavaName,
    type: oldData?.data?.type,
  };

  return newFormat;
}

export function transformCartData(input) {
  return Object.values(input).map((item) => {
    const tempobj = structuredClone(item);
    // Create a new object without the unwanted properties
    delete tempobj?.userId;
    delete tempobj?.userName;
    delete tempobj?.mobileNumber;
    // const { userId, userName, mobileNumber, ...rest } = item;
    return tempobj;
  });
}
