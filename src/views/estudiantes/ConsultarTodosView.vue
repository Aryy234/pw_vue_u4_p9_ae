<template>
  <div class="container">
    <h2>Consultar Todos los Estudiantes</h2>
    <button @click="consultarTodos" class="btn">Consultar</button>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-if="estudiantes.length">
      <li v-for="est in estudiantes" :key="est.id">
        {{ est.nombre }} {{ est.apellido }} - {{ est.fechaNacimiento }}
      </li>
    </ul>
  </div>
</template>

<script>
import { consultarTodosFachada } from '@/client/matriculaClient.js'
export default {
  data() {
    return {
      estudiantes: [],
      error: ''
    }
  },
  methods: {
    async consultarTodos() {
      this.error = ''
      try {
        this.estudiantes = await consultarTodosFachada();
      } catch (e) {
        this.error = 'No se pudo consultar.';
      }
    }
  }
}
</script>

<style scoped>
.container { max-width: 500px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; }
.btn { background: #222; color: #fff; border: none; padding: 0.5rem 1.5rem; border-radius: 4px; cursor: pointer; margin-bottom: 1rem; }
.error { color: #c00; margin-top: 1rem; }
ul { padding-left: 1.2rem; }
</style>
