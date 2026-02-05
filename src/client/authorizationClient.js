import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8082/auth/api/v1.0/auth';

/**
 * Realiza el login del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Promesa con los datos de autenticación
 */
const login = (username, password) => {
  const data = axios.post(`${AUTH_BASE_URL}/login`, {
    username,
    password
  })
  .then(r => r.data);
  
  return data;
}

/**
 * Cierra la sesión del usuario
 * @returns {Promise} Promesa resuelta
 */
const logout = () => {
  // Por ahora solo limpia el localStorage
  // Si tu API tiene endpoint de logout, puedes agregarlo aquí
  return Promise.resolve();
}

/**
 * Fachada para login
 */
const loginFachada = async (username, password) => {
  return await login(username, password);
}

/**
 * Fachada para logout
 */
const logoutFachada = async () => {
  return await logout();
}

export { loginFachada, logoutFachada };
