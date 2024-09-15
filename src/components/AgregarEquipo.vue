<template>
    <b-container>
      <b-form @submit.prevent="agregarEquipo">
        <b-form-group label="Dependencia" label-for="dependencia">
          <b-form-input id="dependencia" v-model="nuevoEquipo.dependencia" required></b-form-input>
        </b-form-group>
  
        <b-form-group label="Propiedad" label-for="propiedad">
          <b-form-input id="propiedad" v-model="nuevoEquipo.propiedad" required></b-form-input>
        </b-form-group>
  
        <b-form-group label="Nombre de equipo" label-for="nombreEquipo">
          <b-form-input id="nombreEquipo" v-model="nuevoEquipo.nombreEquipo" required></b-form-input>
        </b-form-group>
  
        <!-- Añadir el resto de los campos de la misma forma -->
  
        <b-button type="submit" variant="primary">
          <font-awesome-icon icon="plus" /> Agregar Equipo
        </b-button>
      </b-form>
    </b-container>
  </template>
  
  <script>
  import { collection, addDoc } from 'firebase/firestore'; // Importar funciones de Firebase
  import { db } from '@/firebase'; // Asegúrate de que la ruta sea correcta
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        nuevoEquipo: {
          dependencia: '',
          propiedad: '',
          nombreEquipo: '',
          so: '',
          paqueteOfimatica: '',
          marca: '',
          cpu: '',
          hdd: '',
          ram: '',
          ip: '',
          mac: '',
          serial: '',
          activoFijo: '',
          anydesk: '',
          impresora: '',
          activoFijoImpresora: '',
          escaner: '',
          activoFijoEscaner: ''
        }
      };
    },
    methods: {
      async agregarEquipo() {
        try {
          await addDoc(collection(db, 'equipos'), this.nuevoEquipo);
          // Mostrar alerta de éxito con SweetAlert
          Swal.fire({
            title: '¡Equipo agregado!',
            text: 'El equipo ha sido agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.$emit('equipo-agregado');
          // Limpiar el formulario
          this.nuevoEquipo = {
            dependencia: '',
            propiedad: '',
            nombreEquipo: '',
            so: '',
            paqueteOfimatica: '',
            marca: '',
            cpu: '',
            hdd: '',
            ram: '',
            ip: '',
            mac: '',
            serial: '',
            activoFijo: '',
            anydesk: '',
            impresora: '',
            activoFijoImpresora: '',
            escaner: '',
            activoFijoEscaner: ''
          };
        } catch (error) {
          // Mostrar alerta de error con SweetAlert
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al agregar el equipo.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Añade estilos si es necesario */
  </style>
  