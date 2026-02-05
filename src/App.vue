<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    
    <!-- Mostrar solo si está autenticado -->
    <template v-if="isAuthenticated">
       |
      <router-link to="/estudiantes/consultar-todos">Consultar Todos</router-link> |
      <router-link to="/estudiantes/consultar-por-id">Consultar por ID</router-link> |
      <router-link to="/estudiantes/guardar">Guardar</router-link> |
      <router-link to="/estudiantes/actualizar">Actualizar</router-link> |
      <router-link to="/estudiantes/actualizar-parcial">Actualizar Parcial</router-link> |
      <router-link to="/estudiantes/borrar">Borrar</router-link>
    </template>

    <!-- Información del usuario y logout -->
    <div class="user-section">
      <template v-if="isAuthenticated">
        <span class="user-info">
          👤 {{ currentUser?.username }}
          <span v-if="isAdmin" class="admin-badge">Admin</span>
        </span>
        <button @click="handleLogout" class="logout-button">Cerrar Sesión</button>
      </template>
      <template v-else>
        <router-link to="/login" class="login-link">Iniciar Sesión</router-link>
      </template>
    </div>
  </nav>
  <router-view/>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const { 
      isAuthenticated, 
      currentUser, 
      isAdmin, 
      logout, 
      initializeAuth 
    } = useAuth();

    // Inicializar autenticación al cargar la app
    onMounted(() => {
      initializeAuth();
    });

    const handleLogout = async () => {
      await logout();
      router.push('/login');
    };

    return {
      isAuthenticated,
      currentUser,
      isAdmin,
      handleLogout
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  position: relative;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

nav a:hover {
  background-color: #f0f0f0;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.user-section {
  position: absolute;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  color: #2c3e50;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-badge {
  background-color: #42b983;
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.logout-button {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #c82333;
}

.login-link {
  padding: 8px 16px;
  background-color: #42b983;
  color: white !important;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;
}

.login-link:hover {
  background-color: #359268;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
  }
  
  .user-section {
    position: static;
    margin-top: 15px;
  }
}
</style>
