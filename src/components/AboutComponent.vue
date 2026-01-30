<template>
    <div>
        <h1>About Us</h1>
        <p>This is the About Component of our application.</p>
        <div>
            <button @click="consultarTodos">Consultar Todos</button>
            <button @click="consultarPorId">Consultar por ID</button>
            <button @click="guardar">Guardar</button>
            <button @click="actualizar">Actualizar</button>
            <button @click="actualizarParcial">Actualizar Parcial</button>
            <button @click="borrar">Borrar</button>
        </div>
    </div>
  
</template>

<script>
import { consultarTodosFachada, consultarPorIdFachada, guardarFachada, actualizarFachada, actualizarParcialFachada, borrarFachada } from '@/client/matriculaClient.js'

export default {
    methods: {
        async consultarTodos() {
            try {
                const data = await consultarTodosFachada();
                console.log('Consultar Todos:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async consultarPorId() {
            try {
                const data = await consultarPorIdFachada(1); // ID hardcodeado
                console.log('Consultar por ID:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async guardar() {
            try {
                const estudiante = { nombre: 'Juan', apellido: 'Perez', edad: 20 }; // Ejemplo
                const data = await guardarFachada(estudiante);
                console.log('Guardar:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async actualizar() {
            try {
                const estudiante = { id: 1, nombre: 'Juan Actualizado', apellido: 'Perez', edad: 21 };
                const data = await actualizarFachada(estudiante);
                console.log('Actualizar:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async actualizarParcial() {
            try {
                const campos = { edad: 22 };
                const data = await actualizarParcialFachada(1, campos);
                console.log('Actualizar Parcial:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async borrar() {
            try {
                const data = await borrarFachada(1); // ID hardcodeado
                console.log('Borrar:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}
</script>

<style>

</style>