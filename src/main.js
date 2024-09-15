import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el router para manejar las rutas

// Importar Bootstrap y BootstrapVue CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Importar BootstrapVue
import { BootstrapVue3, IconsPlugin } from 'bootstrap-vue-3';

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons'; // Añadir más íconos si los necesitas
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Importar Firebase
import { db } from './firebase'; // Archivo donde configuramos Firebase

// Configurar SweetAlert2 (opcional, se puede usar directamente en los componentes)
import Swal from 'sweetalert2';
window.Swal = Swal; // Hacemos Swal global para facilitar su uso

// Crear la aplicación Vue
const app = createApp(App);

// Instalar BootstrapVue
app.use(BootstrapVue3);
app.use(IconsPlugin);

// Añadir los íconos de FontAwesome a la biblioteca
library.add(faTrash, faPlus, faEdit);

// Registrar el componente FontAwesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

// Configurar la instancia de Vue
app.use(router); // Añadir el router a la instancia de Vue

// Montar la aplicación
app.mount('#app');
