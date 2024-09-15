<template>
  <div class="home">
    <div class="container mt-4">
      <h1 class="mb-4">Bienvenido al Sistema de Inventario de Equipos</h1>
      <p>
        Esta aplicación te permite gestionar el inventario de equipos de cómputo, 
        manteniendo un registro detallado de cada equipo con sus características técnicas y detalles adicionales.
      </p>
      <b-button variant="primary" @click="$router.push('/equipos')">Ver Inventario</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #2c3e50;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
