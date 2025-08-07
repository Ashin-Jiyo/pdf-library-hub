// ImageKit Signature Helper
// Note: In production, signature generation should be done server-side for security

import CryptoJS from 'crypto-js';

export const generateImageKitSignature = (token: string, expire: number, privateKey: string): string => {
  const stringToSign = token + expire;
  return CryptoJS.HmacSHA1(stringToSign, privateKey).toString();
};

export const getImageKitAuthParams = () => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('ImageKit private key not found in environment variables');
  }

  const signature = generateImageKitSignature(token, expire, privateKey);
  
  return {
    token,
    expire: expire.toString(),
    signature,
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
  };
};

export const getImageKitSmallAuthParams = () => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
  const privateKey = import.meta.env.VITE_IMAGEKIT_SMALL_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('ImageKit small account private key not found in environment variables');
  }

  const signature = generateImageKitSignature(token, expire, privateKey);
  
  return {
    token,
    expire: expire.toString(),
    signature,
    publicKey: import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY
  };
};
