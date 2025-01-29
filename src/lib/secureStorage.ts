import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'marty-healthcare-secure-storage-key';

export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error encrypting data:', error);
      localStorage.removeItem(key);
    }
  },

  getItem: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        localStorage.removeItem(key);
        return null;
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};