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
        
        <b-form-group label="Sistema operativo" label-for="so">
          <b-form-input id="so" v-model="nuevoEquipo.so" required></b-form-input>
        </b-form-group>

        <b-form-group label="Paquete ofimatica" label-for="paqueteOfimatica">
          <b-form-input id="paqueteOfimatica" v-model="nuevoEquipo.paqueteOfimatica" required></b-form-input>
        </b-form-group>

        <b-form-group label="Marca" label-for="marca">
          <b-form-input id="marca" v-model="nuevoEquipo.marca" required></b-form-input>
        </b-form-group>

        <b-form-group label="Procesador" label-for="cpu">
          <b-form-input id="cpu" v-model="nuevoEquipo.cpu" required></b-form-input>
        </b-form-group>

        <b-form-group label="Almacenamiento (GB)" label-for="hdd">
          <b-form-input id="hdd" v-model="nuevoEquipo.hdd" required></b-form-input>
        </b-form-group>

        <b-form-group label="Memoria Ram (GB)" label-for="ram">
          <b-form-input id="ram" v-model="nuevoEquipo.ram" required></b-form-input>
        </b-form-group>

        <b-form-group label="Direccion IP" label-for="ip">
          <b-form-input id="ip" v-model="nuevoEquipo.ip" required></b-form-input>
        </b-form-group>

        <b-form-group label="Direccion MAC" label-for="mac">
          <b-form-input id="mac" v-model="nuevoEquipo.mac" required></b-form-input>
        </b-form-group>
        
        <b-form-group label="Serial" label-for="serial">
          <b-form-input id="serial" v-model="nuevoEquipo.serial" ></b-form-input>
        </b-form-group>

        <b-form-group label="Activo fijo" label-for="activoFijo">
          <b-form-input id="activoFijo" v-model="nuevoEquipo.activoFijo" required></b-form-input>
        </b-form-group>

        <b-form-group label="Anydesk" label-for="anydesk">
          <b-form-input id="anydesk" v-model="nuevoEquipo.anydesk"></b-form-input>
        </b-form-group>

        <b-form-group label="Impresora" label-for="impresora">
          <b-form-input id="impresora" v-model="nuevoEquipo.impresora"></b-form-input>
        </b-form-group>

        <b-form-group label="Activo fijo impresora" label-for="activoFijoImpresora">
          <b-form-input id="activoFijoImpresora" v-model="nuevoEquipo.activoFijoImpresora"></b-form-input>
        </b-form-group>

        <b-form-group label="Escaner" label-for="escaner">
          <b-form-input id="escaner" v-model="nuevoEquipo.escaner"></b-form-input>
        </b-form-group>

        <b-form-group label="Activo fijo escaner" label-for="activoFijoEscaner">
          <b-form-input id="activoFijoEscaner" v-model="nuevoEquipo.activoFijoEscaner"></b-form-input>
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
  