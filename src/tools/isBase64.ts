export default function isBase64(str: string) {
    if (typeof str !== 'string') {
        return false;
    }
    // Remove data URL prefix if present
    if (str.indexOf('data:') === 0) {
        str = str.split(',')[1];
    }
    // Check if the string is valid Base64
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
  }
