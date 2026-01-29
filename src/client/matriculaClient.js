import axios from 'axios';

const consultarTodos = () => {
  const data = axios.get('http://localhost:8081/matricula/api/v1.0/estudiantes')
  .then(r=> r.data);

  return data;
}