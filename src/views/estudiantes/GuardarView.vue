<template>
  <div class="container">
    <h2>Guardar Estudiante</h2>
    <form @submit.prevent="guardar">
      <input v-model="form.nombre" placeholder="Nombre" class="input" required />
      <input v-model="form.apellido" placeholder="Apellido" class="input" required />
      <input v-model="form.fechaNacimiento" type="datetime-local" class="input" required />
      <input v-model="form.provincia" placeholder="Provincia" class="input" required />
      <select v-model="form.genero" class="input" required>
        <option disabled value="">Género</option>
        <option value="masculino">Masculino</option>
        <option value="femenino">Femenino</option>
      </select>
      <button class="btn">Guardar</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Estudiante guardado correctamente.</div>
  </div>
</template>

<script>
import { guardarFachada } from '@/client/matriculaClient.js'
export default {
  data() {
    return {
      form: {
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        provincia: '',
        genero: ''
      },
      error: '',
      success: false
    }
  },
  methods: {
    formatFecha(fecha) {
      if (!fecha) return '';
      // fecha es tipo '2000-05-15T10:30'
      return fecha.length === 16 ? fecha + ':00' : fecha.substring(0, 19);
    },
    async guardar() {
      this.error = ''
      this.success = false
      try {
        const payload = { ...this.form, fechaNacimiento: this.formatFecha(this.form.fechaNacimiento) };
        await guardarFachada(payload);
        this.success = true;
      } catch (e) {
        this.error = 'No se pudo guardar.';
      }
    }
  }
}
</script>

<style scoped>
.container { max-width: 500px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; }
.input { display: block; width: 100%; margin-bottom: 1rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
.btn { background: #222; color: #fff; border: none; padding: 0.5rem 1.5rem; border-radius: 4px; cursor: pointer; }
.error { color: #c00; margin-top: 1rem; }
.success { color: #080; margin-top: 1rem; }
</style>
