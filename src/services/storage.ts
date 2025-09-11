// Check if running in browser environment
export const isBrowser = typeof window !== "undefined";

// Safe sessionStorage access
export const getSessionStorage = (key: string) => {
  if (!isBrowser) return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.error("sessionStorage access error:", error);
    return null;
  }
};

export const setSessionStorage = (key: string, value: string) => {
  if (!isBrowser) return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.error("sessionStorage access error:", error);
  }
};

// Safe localStorage access
export const getLocalStorage = (key: string) => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("localStorage access error:", error);
    return null;
  }
};

export const setLocalStorage = (key: string, value: string) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error("localStorage access error:", error);
  }
};

// Safe window object access
export const getWindow = () => {
  if (!isBrowser) return null;
  return window;
};

export const getLocalStorageUtm = (key: string) => {
  if (!isBrowser) return null;
  let value = localStorage.getItem(key);
  if (!value) return ""; // default empty string

  try {
    let parsed = JSON.parse(value);
    return parsed.value ?? value; // return `value` if inside JSON, else raw
  } catch {
    return value; // not JSON, return as is
  }
};