import { ref, computed } from 'vue';
import { loginFachada, logoutFachada } from '@/client/authorizationClient';
import { isTokenExpired, getUserFromToken } from '@/utils/jwtHelper';

// Estado global reactivo
const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  
  // Computed properties
  const isAuthenticated = computed(() => {
    if (!token.value) return false;
    if (isTokenExpired(token.value)) {
      clearAuthData();
      return false;
    }
    return true;
  });

  const currentUser = computed(() => user.value);
  
  const userRoles = computed(() => user.value?.roles || []);
  
  const isAdmin = computed(() => userRoles.value.includes('admin'));

  /**
   * Guarda los datos de autenticación en localStorage y estado
   */
  const saveAuthData = (authData) => {
    token.value = authData.token;
    user.value = {
      username: authData.username,
      email: authData.email,
      roles: authData.roles,
      enabled: authData.enabled
    };
    
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  /**
   * Limpia los datos de autenticación
   */
  const clearAuthData = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Realiza el login
   */
  const login = async (username, password) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await loginFachada(username, password);
      saveAuthData(response);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      error.value = errorMessage;
      clearAuthData();
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cierra la sesión
   */
  const logout = async () => {
    loading.value = true;
    
    try {
      await logoutFachada();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      clearAuthData();
      loading.value = false;
    }
  };

  /**
   * Verifica si el token actual es válido
   */
  const checkTokenExpiration = () => {
    if (token.value && isTokenExpired(token.value)) {
      clearAuthData();
      return false;
    }
    return !!token.value;
  };

  /**
   * Obtiene el token actual
   */
  const getToken = () => token.value;

  /**
   * Inicializa el estado de autenticación al cargar la app
   */
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      token.value = storedToken;
      user.value = JSON.parse(localStorage.getItem('user') || 'null');
    } else {
      clearAuthData();
    }
  };

  return {
    // State
    loading,
    error,
    
    // Computed
    isAuthenticated,
    currentUser,
    userRoles,
    isAdmin,
    
    // Methods
    login,
    logout,
    checkTokenExpiration,
    getToken,
    initializeAuth
  };
}
