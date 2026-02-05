import axios from 'axios';

const BASE_URL = 'http://localhost:8081/matricula/api/v1.0/estudiantes';

// Configurar interceptor para añadir el token JWT a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (no autorizado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }
    return Promise.reject(error);
  }
);

const consultarTodos = () => {
  const data = axios.get(BASE_URL)
  .then(r=> r.data);

  return data;
}

const consultarPorId = (id) => {
  const data = axios.get(`${BASE_URL}/${id}`)
  .then(r=> r.data);
  return data;

}

const guardar = (estudiante) => {
  const data = axios.post(BASE_URL, estudiante)
  .then(r=> r.data);
  return data;
}

const actualizar = (estudiante) => {
  const data = axios.put(`${BASE_URL}/${estudiante.id}`, estudiante)
  .then(r=> r.data);
  return data;
}

const actualizarParcial = (id, campos) => {
  const data = axios.patch(`${BASE_URL}/${id}`, campos)
  .then(r=> r.data);
  return data;
}

const borrar = (id) => {
  const data = axios.delete(`${BASE_URL}/${id}`)
  .then(r=> r.data);
  return data;
}


const consultarTodosFachada = async () => {
  return await consultarTodos();
}

const consultarPorIdFachada  = async (id) => {
  return await consultarPorId(id);

}

const guardarFachada  = async (estudiante) => {
  return await guardar(estudiante);
}

const actualizarFachada  = async (estudiante) => {
  return await actualizar(estudiante);
}

const actualizarParcialFachada  = async (id, campos) => {
  return await actualizarParcial(id, campos);
}


const borrarFachada = async (id) => {
  return await borrar(id);
}

export {
  consultarTodosFachada,
  consultarPorIdFachada,
  guardarFachada,
  actualizarFachada,
  actualizarParcialFachada,
  borrarFachada
};
