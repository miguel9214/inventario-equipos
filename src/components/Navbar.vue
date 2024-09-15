<template>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="/">Inventario de Equipos</b-navbar-brand>
  
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
  
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/">Inicio</b-nav-item>
          <b-nav-item href="/equipos">Inventario</b-nav-item>
          <b-nav-item href="/agregar">Agregar Equipo</b-nav-item>
        </b-navbar-nav>
  
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" disabled>Usuario</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  };
  </script>
  
  <style scoped>
  /* Puedes personalizar el estilo del navbar aquí */
  </style>
  