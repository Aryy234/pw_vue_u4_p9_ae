<template>
  <div class="container">
    <h2>Consultar Estudiante por ID</h2>
    <form @submit.prevent="consultarPorId">
      <input v-model="id" type="number" min="1" placeholder="ID" class="input" required />
      <button class="btn">Consultar</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="estudiante">
      <p><b>Nombre:</b> {{ estudiante.nombre }}</p>
      <p><b>Apellido:</b> {{ estudiante.apellido }}</p>
      <p><b>Fecha Nacimiento:</b> {{ estudiante.fechaNacimiento }}</p>
    </div>
  </div>
</template>

<script>
import { consultarPorIdFachada } from '@/client/matriculaClient.js'
export default {
  data() {
    return {
      id: '',
      estudiante: null,
      error: ''
    }
  },
  methods: {
    async consultarPorId() {
      this.error = ''
      this.estudiante = null
      try {
        this.estudiante = await consultarPorIdFachada(this.id);
        if (!this.estudiante) this.error = 'No encontrado.';
      } catch (e) {
        this.error = 'No se pudo consultar.';
      }
    }
  }
}
</script>

<style scoped>
.container { max-width: 500px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; }
.input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; margin-right: 1rem; }
.btn { background: #222; color: #fff; border: none; padding: 0.5rem 1.5rem; border-radius: 4px; cursor: pointer; }
.error { color: #c00; margin-top: 1rem; }
</style>
