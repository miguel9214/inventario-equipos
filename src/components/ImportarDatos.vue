<template>
  <div>
    <b-container>
      <!-- Botón para importar los datos desde Google Sheets -->
      <b-button @click="importarDatos" variant="primary">Importar Datos</b-button>

      <!-- Botón para enviar los datos a Firestore -->
      <b-button @click="enviarDatos" variant="success" class="ml-2">Enviar a Base de Datos</b-button>

      <!-- Tabla para mostrar los datos importados -->
      <b-table :items="equipos" :fields="fields" striped hover responsive="sm">
        <template v-slot:cell(actions)="data">
          <b-button variant="danger" @click="confirmarEliminarEquipo(data.item.id)">
            <font-awesome-icon icon="trash" /> Eliminar
          </b-button>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { db } from '@/firebase'; // Asegúrate de que la ruta de Firebase es correcta

export default {
  data() {
    return {
      equipos: [], // Datos de los equipos importados
      fields: [
        { key: 'dependencia', label: 'Dependencia' },
        { key: 'propiedad', label: 'Propiedad' },
        { key: 'nombreEquipo', label: 'Nombre de Equipo' },
        { key: 'so', label: 'SO' },
        { key: 'paqueteOfimatica', label: 'Paquete Ofimática' },
        { key: 'marca', label: 'Marca' },
        { key: 'cpu', label: 'CPU' },
        { key: 'hdd', label: 'HDD (GB)' },
        { key: 'ram', label: 'RAM (GB)' },
        { key: 'ip', label: 'IP' },
        { key: 'mac', label: 'MAC' },
        { key: 'serial', label: 'Serial' },
        { key: 'activoFijo', label: 'N° Activo Fijo' },
        { key: 'anydesk', label: 'Anydesk' },
        { key: 'impresora', label: 'Impresora' },
        { key: 'activoFijoImpresora', label: 'N° Activo Fijo Impresora' },
        { key: 'escaner', label: 'Escáner' },
        { key: 'activoFijoEscaner', label: 'N° Activo Fijo Escáner' },
        { key: 'actions', label: 'Acciones', sortable: false }
      ]
    };
  },
  methods: {
    // Método para importar los datos de Google Sheets
    async importarDatos() {
      try {
        const apiKey = 'AIzaSyB8qiDNiIZkmLRSRGS1biPFKo1KjE-lfQY'; // Sustituye por tu clave API
        const spreadsheetId = '16HVbnQpFlYAWc03dvmyVkV4lNFY_B9q8FCE55Zd01ds'; // Sustituye por el ID de tu hoja de cálculo
        const range = 'INVENTARIO2!B6:S'; // Rango de celdas a importar


        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
        const data = response.data.values;

        // Convertir los datos importados a un formato adecuado
        this.equipos = data.slice(1).map(row => ({
          dependencia: row[0] || '',
          propiedad: row[1] || '',
          nombreEquipo: row[2] || '',
          so: row[3] || '',
          paqueteOfimatica: row[4] || '',
          marca: row[5] || '',
          cpu: row[6] || '',
          hdd: row[7] || '',
          ram: row[8] || '',
          ip: row[9] || '',
          mac: row[10] || '',
          serial: row[11] || '',
          activoFijo: row[12] || '',
          anydesk: row[13] || '',
          impresora: row[14] || '',
          activoFijoImpresora: row[15] || '',
          escaner: row[16] || '',
          activoFijoEscaner: row[17] || ''
        }));

        Swal.fire({
          title: '¡Datos importados!',
          text: 'Los datos se han importado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al importar los datos.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },

    // Método para enviar los datos importados a Firestore
    async enviarDatos() {
      try {
        for (const equipo of this.equipos) {
          await db.collection('equipos').add({
            dependencia: equipo.dependencia,
            propiedad: equipo.propiedad,
            nombreEquipo: equipo.nombreEquipo,
            so: equipo.so,
            paqueteOfimatica: equipo.paqueteOfimatica,
            marca: equipo.marca,
            cpu: equipo.cpu,
            hdd: equipo.hdd,
            ram: equipo.ram,
            ip: equipo.ip,
            mac: equipo.mac,
            serial: equipo.serial,
            activoFijo: equipo.activoFijo,
            anydesk: equipo.anydesk,
            impresora: equipo.impresora,
            activoFijoImpresora: equipo.activoFijoImpresora,
            escaner: equipo.escaner,
            activoFijoEscaner: equipo.activoFijoEscaner
          });
        }

        Swal.fire({
          title: '¡Datos enviados!',
          text: 'Los datos se han enviado correctamente a la base de datos.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error al enviar los datos:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar los datos.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },

    confirmarEliminarEquipo(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.eliminarEquipo(id);
          Swal.fire('Eliminado', 'El equipo ha sido eliminado', 'success');
        }
      });
    },

    eliminarEquipo(id) {
      // Lógica para eliminar el equipo
      this.equipos = this.equipos.filter(equipo => equipo.id !== id);
    }
  }
};
</script>

<style scoped>
/* Añadir estilos personalizados para el contenedor y la tabla */
</style>
