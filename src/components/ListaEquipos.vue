<template>
    <b-container>
      <b-table :items="equipos" :fields="fields">
        <template v-slot:cell(actions)="data">
          <b-button variant="danger" @click="confirmarEliminarEquipo(data.item.id)">
            <font-awesome-icon icon="trash" /> Eliminar
          </b-button>
        </template>
      </b-table>
    </b-container>
  </template>
  
  <script>
  import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Importar funciones de Firebase
  import { db } from '@/firebase'; // Asegúrate de que la ruta sea correcta
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        equipos: [],
        fields: [
          { key: 'dependencia', label: 'Dependencia' },
          { key: 'propiedad', label: 'Propiedad' },
          { key: 'nombreEquipo', label: 'Nombre de Equipo' },
          // Añadir otros campos aquí...
          { key: 'actions', label: 'Acciones', sortable: false }
        ]
      };
    },
    mounted() {
      this.obtenerEquipos();
    },
    methods: {
      async obtenerEquipos() {
        try {
          const snapshot = await getDocs(collection(db, 'equipos'));
          this.equipos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al obtener los equipos.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      },
      async confirmarEliminarEquipo(id) {
        // Usar SweetAlert para confirmar la eliminación
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'No podrás revertir esta acción',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });
  
        if (result.isConfirmed) {
          await this.eliminarEquipo(id);
          Swal.fire('Eliminado', 'El equipo ha sido eliminado', 'success');
        }
      },
      async eliminarEquipo(id) {
        try {
          await deleteDoc(doc(db, 'equipos', id));
          this.obtenerEquipos();  // Refrescar la lista
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al eliminar el equipo.',
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
  