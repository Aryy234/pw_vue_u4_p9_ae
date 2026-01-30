<template>
  <div class="container">
    <h2>Borrar Estudiante por ID</h2>
    <form @submit.prevent="borrar">
      <input v-model="id" type="number" min="1" placeholder="ID" class="input" required />
      <button class="btn">Borrar</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Estudiante borrado correctamente.</div>
  </div>
</template>

<script>
import { borrarFachada } from '@/client/matriculaClient.js'
export default {
  data() {
    return {
      id: '',
      error: '',
      success: false
    }
  },
  methods: {
    async borrar() {
      this.error = ''
      this.success = false
      try {
        await borrarFachada(this.id);
        this.success = true;
      } catch (e) {
        this.error = 'No se pudo borrar.';
      }
    }
  }
}
</script>

<style scoped>
.container { max-width: 500px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; }
.input { display: block; width: 100%; margin-bottom: 1rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
.btn { background: #c00; color: #fff; border: none; padding: 0.5rem 1.5rem; border-radius: 4px; cursor: pointer; }
.error { color: #c00; margin-top: 1rem; }
.success { color: #080; margin-top: 1rem; }
</style>
