<template>
  <div class="container">
    <h2>Actualizar Parcial por ID</h2>
    <form @submit.prevent="actualizarParcial">
      <input v-model="id" type="number" min="1" placeholder="ID" class="input" required />
      <input v-model="campos.nombre" placeholder="Nombre" class="input" />
      <input v-model="campos.apellido" placeholder="Apellido" class="input" />
      <input v-model="campos.fechaNacimiento" type="datetime-local" class="input" />
      <input v-model="campos.provincia" placeholder="Provincia" class="input" />
      <select v-model="campos.genero" class="input">
        <option disabled value="">Género</option>
        <option value="masculino">Masculino</option>
        <option value="femenino">Femenino</option>
      </select>
      <button class="btn">Actualizar Parcial</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">Actualización parcial exitosa.</div>
  </div>
</template>

<script>
import { actualizarParcialFachada } from '@/client/matriculaClient.js'
export default {
  data() {
    return {
      id: '',
      campos: {
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
      return fecha.length === 16 ? fecha + ':00' : fecha.substring(0, 19);
    },
    async actualizarParcial() {
      this.error = ''
      this.success = false
      try {
        // Solo enviar los campos que el usuario llenó
        const camposActualizados = {};
        for (const key in this.campos) {
          if (this.campos[key]) {
            if (key === 'fechaNacimiento') {
              camposActualizados[key] = this.formatFecha(this.campos[key]);
            } else {
              camposActualizados[key] = this.campos[key];
            }
          }
        }
        if (Object.keys(camposActualizados).length === 0) {
          this.error = 'Debes ingresar al menos un campo a actualizar.';
          return;
        }
        await actualizarParcialFachada(this.id, camposActualizados);
        this.success = true;
      } catch (e) {
        this.error = 'No se pudo actualizar.';
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
