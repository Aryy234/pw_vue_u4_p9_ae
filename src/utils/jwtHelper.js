/**
 * Decodifica un token JWT
 * @param {string} token - Token JWT
 * @returns {Object|null} Payload del token decodificado o null si hay error
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

/**
 * Verifica si un token ha expirado
 * @param {string} token - Token JWT
 * @returns {boolean} true si el token está expirado, false en caso contrario
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Obtiene el tiempo restante hasta la expiración en segundos
 * @param {string} token - Token JWT
 * @returns {number} Segundos hasta la expiración (negativo si ya expiró)
 */
export const getTokenExpirationTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp - currentTime;
}

/**
 * Extrae información del usuario del token
 * @param {string} token - Token JWT
 * @returns {Object|null} Datos del usuario
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    username: decoded.upn || null,
    email: decoded.email || null,
    roles: decoded.groups || [],
    uid: decoded.uid || null
  };
}
