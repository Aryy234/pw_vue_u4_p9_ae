import axios from 'axios';

const consultarTodos = () => {
  const data = axios.get('http://localhost:8081/matricula/api/v1.0/estudiantes')
  .then(r=> r.data);

  return data;
}

const consultarPorId = (id) => {
  const data = axios.get(`http://localhost:8081/matricula/api/v1.0/estudiantes/${id}`)
  .then(r=> r.data);
  return data;

}

const guardar = (estudiante) => {
  const data = axios.post('http://localhost:8081/matricula/api/v1.0/estudiantes', estudiante)
  .then(r=> r.data);
  return data;
}

const actualizar = (estudiante) => {
  const data = axios.put(`http://localhost:8081/matricula/api/v1.0/estudiantes/${estudiante.id}`, estudiante)
  .then(r=> r.data);
  return data;
}

const actualizarParcial = (id, campos) => {
  const data = axios.patch(`http://localhost:8081/matricula/api/v1.0/estudiantes/${id}`, campos)
  .then(r=> r.data);
  return data;
}

const borrar = (id) => {
  const data = axios.delete(`http://localhost:8081/matricula/api/v1.0/estudiantes/${id}`)
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
