export const gameTokenLength = 6;
export const generateToken = (length = gameTokenLength) => Math.random().toString(36).substring(2, 2 + length);