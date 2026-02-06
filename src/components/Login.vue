<template>
	<div class="login-container">
		<div class="login-card">
			<h2>Iniciar Sesión</h2>
      
			<form @submit.prevent="onSubmit">
				<div class="form-group">
					<label for="username">Usuario:</label>
					<input
						id="username"
						v-model="credentials.username"
						type="text"
						placeholder="Ingresa tu usuario"
						required
						:disabled="loading"
					/>
				</div>

				<div class="form-group">
					<label for="password">Contraseña:</label>
					<input
						id="password"
						v-model="credentials.password"
						type="password"
						placeholder="Ingresa tu contraseña"
						required
						:disabled="loading"
					/>
				</div>

				<div v-if="error" class="error-message">
					{{ error }}
				</div>

				<button 
					type="submit" 
					class="login-button"
					:disabled="loading || !isFormValid"
				>
					{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
				</button>
			</form>
		</div>
	</div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
	name: 'Login',
	props: {
		loading: { type: Boolean, default: false },
		error: { type: String, default: '' }
	},
	emits: ['submit'],
	setup(_, { emit }) {
		const credentials = ref({
			username: '',
			password: ''
		});

		const isFormValid = computed(() => {
			return credentials.value.username.trim() !== '' && 
						 credentials.value.password.trim() !== '';
		});

		const onSubmit = () => {
			emit('submit', { ...credentials.value });
		};

		return {
			credentials,
			isFormValid,
			onSubmit
		};
	}
};
</script>

<style scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 80vh;
	padding: 20px;
}

.login-card {
	background: white;
	padding: 40px;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 400px;
}

h2 {
	text-align: center;
	color: #2c3e50;
	margin-bottom: 30px;
}

.form-group {
	margin-bottom: 20px;
}

label {
	display: block;
	margin-bottom: 8px;
	color: #2c3e50;
	font-weight: 500;
}

input {
	width: 100%;
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 14px;
	box-sizing: border-box;
	transition: border-color 0.3s;
}

input:focus {
	outline: none;
	border-color: #42b983;
}

input:disabled {
	background-color: #f5f5f5;
	cursor: not-allowed;
}

.login-button {
	width: 100%;
	padding: 12px;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
	background-color: #359268;
}

.login-button:disabled {
	background-color: #ccc;
	cursor: not-allowed;
}

.error-message {
	background-color: #fee;
	color: #c33;
	padding: 12px;
	border-radius: 4px;
	margin-bottom: 20px;
	border-left: 4px solid #c33;
	font-size: 14px;
}
</style>

