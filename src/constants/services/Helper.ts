/* eslint-disable */
"use client";
import { environment } from "../../../src/environment/environment";
import md5 from "md5";
// utils/crypto.js
import CryptoJS from "crypto-js";

// 1. Set a default salt if none is provided
const DEFAULT_SALT = "default-secure-salt-123"; // Change this in production!

// 2. Safe MD5 hashing with salt
export const md5Hash = (input, salt = DEFAULT_SALT) => {
  if (!input) throw new Error("Input cannot be empty");
  if (!salt) salt = DEFAULT_SALT; // Fallback if salt is null/undefined

  return CryptoJS.MD5(input + salt).toString();
};

// 3. Safe AES encryption/decryption
const SECRET_KEY = "fallback-secret-key-456";

export const encrypt = (data) => {
  return data
  // if (!data) throw new Error("Data to encrypt cannot be empty");
  // return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (encryptedData) => {
  return encryptedData
  // if (!encryptedData) throw new Error("Encrypted data cannot be empty");
  // try {
  //   const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  //   return bytes.toString(CryptoJS.enc.Utf8);
  // } catch (error) {
  //   console.error("Decryption failed:", error);
  //   return null;
  // }
};
/**
 * Prepares headers for API requests
 * @param {object} store - The Redux store object
 * @param {string[]} [excludeKeys=[]] - Keys to exclude from headers
 * @returns {object} The  headers object
 */
export const prepareHeaders = (store, excludeKeys = []) => {
  let Bearer = "";
  Bearer = store?.userDetails?.authToken ?? localStorage.getItem("auth_token");

  if (Bearer === null || Bearer === undefined) {
    Bearer = `${environment.Bearer}`;
  }

  const temp = {
    Authorization: `Bearer ${Bearer}`,
    appCode: environment?.appCode,
    appTag: environment.appTag,
  };

  excludeKeys.forEach((key) => delete temp[key]);
  return temp;
};
