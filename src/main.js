import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Importar BootstrapVue 3 CSS
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

// Importar BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Importar Firebase
import { db } from './firebase';

// Configurar SweetAlert2
import Swal from 'sweetalert2';
window.Swal = Swal;

// Crear la aplicación Vue
const app = createApp(App);

// Instalar BootstrapVue 3
app.use(BootstrapVue3);

// Añadir los íconos de FontAwesome a la biblioteca
library.add(faTrash, faPlus, faEdit);

// Registrar el componente FontAwesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

// Configurar la instancia de Vue
app.use(router);

// Montar la aplicación
app.mount('#app');
