import { createRouter, createWebHistory } from 'vue-router';

// Importar las vistas
import HomeView from '@/views/HomeView.vue';
import ListaEquipos from '@/components/ListaEquipos.vue';
import AgregarEquipo from '@/components/AgregarEquipo.vue';

// Configurar las rutas
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/equipos',
    name: 'ListaEquipos',
    component: ListaEquipos
  },
  {
    path: '/agregar',
    name: 'AgregarEquipo',
    component: AgregarEquipo
  },
  {
    path: '/:pathMatch(.*)*', // Manejar rutas no encontradas
    redirect: '/'
  }
];

// Crear el enrutador
const router = createRouter({
  history: createWebHistory(), // Usar el historial de HTML5
  routes
});

export default router;
