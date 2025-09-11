import { GetHashed } from "@/services/Helper";

/**
 * A utility object for managing global state using web storage.
 */
export const GlobalState = {
  /**
   * Sets a key-value pair in the specified storage.
   * @returns {Function} A function that sets a key-value pair in the specified storage.
   */
  set: () => 
    /**
     * @param {string} key - The key to set
     * @param {string} value - The value to set
     * @param {Storage} [storage_type=sessionStorage] - The storage type to use (default: sessionStorage)
     * @returns {void}
     */
    (key: string, value: string, storage_type: Storage = sessionStorage): void => 
      storage_type.setItem(GetHashed(key), value),

  /**
   * Retrieves the value associated with the given key from the specified storage.
   * @returns {Function} A function that gets a value from storage
   */
  get: () =>
    /**
     * @param {string} key - The key to retrieve
     * @param {Storage} [storage_type=sessionStorage] - The storage type to use (default: sessionStorage)
     * @returns {string|null} The retrieved value
     */
    (key: string, storage_type: Storage = sessionStorage): string | null => 
      storage_type.getItem(GetHashed(key)),

  /**
   * Clears all key-value pairs from the specified storage.
   * @returns {Function} A function that clears storage
   */
  reset: () =>
    /**
     * @param {Storage} [storage_type=sessionStorage] - The storage type to clear (default: sessionStorage)
     */
    (storage_type: Storage = sessionStorage): void => 
      storage_type.clear(),

  /**
   * Removes the key-value pair associated with the given key from the specified storage.
   * @returns {Function} A function that removes a key from storage
   */
  remove: () =>
    /**
     * @param {string} key - The key to remove
     * @param {Storage} [storage_type=sessionStorage] - The storage type to use (default: sessionStorage)
     */
    (key, storage_type: Storage = sessionStorage) => 
      storage_type.removeItem(GetHashed(key))
};