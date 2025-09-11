export function simpleEncrypt(text: string): string {
  const password = "1234567890";
  // Simple XOR-based encryption (not highly secure but works for basic needs)
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode =
      text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Convert to base64 for safe string representation
}

export function simpleDecrypt(encryptedText: string): string {
  // Decode base64 first
  const password = "1234567890";
  const decoded = atob(encryptedText);
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const charCode =
      decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}
