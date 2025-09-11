/* eslint-disable */
"use client";
import { detectLanguage } from "@/utils/languageDetect";
import { environment } from "../environment/environment";
import { GlobalState } from "./GlobalState";
import md5 from "md5";
import { simpleDecrypt } from "@/utils/cryption";
import { getCurrencyName } from "@/constants/commonfunctions";

/**
 * Generates an MD5 hash for a given key with a predefined suffix.
 * @param {string} key - The key to hash.
 * @returns {string} The hashed key.
 */
export const GetHashed = (key) => {
  if (!environment.prod) {
    return key;
  }
  const encrypt = key + "_Need_To_Encrypt";
  return md5(encrypt);
};

/**
 * Prepares headers for API requests
 * @param {object} store - The Redux store object
 * @param {string[]} [excludeKeys=[]] - Keys to exclude from headers
 * @returns {object} The prepared headers object
 */
export const prepareHeaders = (store, excludeKeys = []) => {
  let Bearer = "";
  Bearer = store?.userDetails?.authToken ?? GlobalState.get()("auth_token");

  if (Bearer === null || Bearer === undefined) {
    Bearer = `${environment.Bearer}`;
  }

  const currency = getCurrencyName() ?? "INR";
  
  const lang = localStorage.getItem("language") ?? detectLanguage();
  const temp = {
    // Authorization: `Bearer ${Bearer}`,
    // appCode: environment?.appCode,
    // appTag: environment.appTag,
    "Content-Type": "application/json",
    language: lang,
    currency: currency,
  };

  excludeKeys.forEach((key) => delete temp[key]);
  return temp;
};
