import crypto from "crypto";

export const getFacebookCookies = () => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {});

  return {
    _fbp: cookies._fbp || "",
    _fbc: cookies._fbc || "",
  };
};

export async function getIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}
// Frontend fetch solution
export async function getClientIP() {
  try {
    const response = await fetch(
      // 'http://ip-api.com/json',
      'https://api.ipify.org?format=json',
       {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.ip ?? 'Not-found';
  } catch (error) {
    console.error("Error fetching IP:", error);
    // Fallback option
    return await fetch('http://ip-api.com/json/').then(res => res.json()).then(data => data.query);
  }
}
export function hash_create(data) {
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}
