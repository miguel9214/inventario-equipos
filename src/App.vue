<template>
  <div id="app">
    <!-- Navbar se incluye en todas las vistas -->
    <Navbar />

    <!-- Aquí se renderizarán las vistas según la ruta actual -->
    <router-view/>
  </div>
</template>

<script>
// Importar el componente Navbar
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f9f9f9; /* Color de fondo para una apariencia más suave */
}

/* Estilos para el Navbar */
nav {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
