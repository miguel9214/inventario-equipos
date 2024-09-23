<template>
  <b-container fluid class="mt-4">
    <!-- Botones para exportar en PDF y Excel -->
    <b-row class="mb-3">
      <b-col>
        <b-button variant="success" @click="exportarExcel">
          <font-awesome-icon icon="file-excel" /> Exportar a Excel
        </b-button>
        <b-button variant="danger" @click="exportarPDF">
          <font-awesome-icon icon="file-pdf" /> Exportar a PDF
        </b-button>
      </b-col>
    </b-row>

    <!-- Campo de búsqueda global -->
    <b-row>
      <b-col>
        <b-form-input
          v-model="filtroGlobal"
          placeholder="Buscar equipo..."
          @input="aplicarFiltroGlobal"
        />
      </b-col>
    </b-row>

    <!-- Tabla con contenedor y límites de tamaño para responsividad -->
    <b-row class="mt-3">
      <b-col>
        <b-table
          :items="ordenarItemsPorColumna(equiposFiltrados, sortBy, sortDesc)"
          :fields="fields"
          striped
          hover
          responsive="sm"
          class="table-responsive-md"
          @sort-changed="onSortChanged"
        >
          <template v-slot:cell(actions)="data">
            <!-- Botón de editar -->
            <b-button variant="warning" @click="abrirModalEditar(data.item)">
              <font-awesome-icon icon="edit" /> Editar
            </b-button>
            <!-- Botón de eliminar -->
            <b-button variant="danger" @click="confirmarEliminarEquipo(data.item.id)">
              <font-awesome-icon icon="trash" /> Eliminar
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <!-- Modal para editar equipo -->
    <b-modal v-model="mostrarModal" title="Editar Equipo" @ok="guardarCambios">
      <b-form>
        <b-form-group label="Dependencia">
          <b-form-input v-model="equipoSeleccionado.dependencia"></b-form-input>
        </b-form-group>
        <b-form-group label="Propiedad">
          <b-form-input v-model="equipoSeleccionado.propiedad"></b-form-input>
        </b-form-group>
        <b-form-group label="Nombre de Equipo">
          <b-form-input v-model="equipoSeleccionado.nombreEquipo"></b-form-input>
        </b-form-group>
        <b-form-group label="Sistema operativo">
          <b-form-input v-model="equipoSeleccionado.so"></b-form-input>
        </b-form-group>
        <b-form-group label="Paquete Ofimática">
          <b-form-input v-model="equipoSeleccionado.paqueteOfimatica"></b-form-input>
        </b-form-group>
        <b-form-group label="Marca">
          <b-form-input v-model="equipoSeleccionado.marca"></b-form-input>
        </b-form-group>
        <b-form-group label="Procesador">
          <b-form-input v-model="equipoSeleccionado.cpu"></b-form-input>
        </b-form-group>
        <b-form-group label="Almacenamiento (GB)">
          <b-form-input v-model="equipoSeleccionado.hdd"></b-form-input>
        </b-form-group>
        <b-form-group label="Memoria Ram (GB)">
          <b-form-input v-model="equipoSeleccionado.ram"></b-form-input>
        </b-form-group>
        <b-form-group label="Direccion IP">
          <b-form-input v-model="equipoSeleccionado.ip"></b-form-input>
        </b-form-group>
        <b-form-group label="Direccion MAC">
          <b-form-input v-model="equipoSeleccionado.mac"></b-form-input>
        </b-form-group>
        <b-form-group label="Serial">
          <b-form-input v-model="equipoSeleccionado.serial"></b-form-input>
        </b-form-group>
        <b-form-group label="Activo fijo">
          <b-form-input v-model="equipoSeleccionado.activoFijo"></b-form-input>
        </b-form-group>
        <b-form-group label="Anydesk">
          <b-form-input v-model="equipoSeleccionado.anydesk"></b-form-input>
        </b-form-group>
        <b-form-group label="Impresora">
          <b-form-input v-model="equipoSeleccionado.impresora"></b-form-input>
        </b-form-group>
        <b-form-group label="Activo fijo impresora">
          <b-form-input v-model="equipoSeleccionado.activoFijoImpresora"></b-form-input>
        </b-form-group>
        <b-form-group label="Escaner">
          <b-form-input v-model="equipoSeleccionado.escaner"></b-form-input>
        </b-form-group>
        <b-form-group label="Activo fijo escaner">
          <b-form-input v-model="equipoSeleccionado.activoFijoEscaner"></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; // Importación de la librería XLSX para exportar a Excel
import jsPDF from 'jspdf'; // Importación de jsPDF
import 'jspdf-autotable'; // Importación de autotable para las tablas en PDF

export default {
  data() {
    return {
      equipos: [],
      equiposFiltrados: [],
      filtroGlobal: '',
      equipoSeleccionado: {},
      mostrarModal: false, // Control de la visibilidad del modal
      sortBy: 'ip', // Columna por la cual ordenar
      sortDesc: false, // Orden descendente
      fields: [
        { key: 'dependencia', label: 'Dependencia', sortable: true },
        { key: 'propiedad', label: 'Propiedad', sortable: true },
        { key: 'nombreEquipo', label: 'Nombre de Equipo', sortable: true },
        { key: 'so', label: 'SO', sortable: true },
        { key: 'paqueteOfimatica', label: 'Paquete Ofimática', sortable: true },
        { key: 'marca', label: 'Marca', sortable: true },
        { key: 'cpu', label: 'CPU', sortable: true },
        { key: 'hdd', label: 'HDD (GB)', sortable: true },
        { key: 'ram', label: 'RAM (GB)', sortable: true },
        { key: 'ip', label: 'IP', sortable: true },
        { key: 'mac', label: 'MAC', sortable: true },
        { key: 'serial', label: 'Serial', sortable: true },
        { key: 'activoFijo', label: 'N° Activo Fijo', sortable: true },
        { key: 'anydesk', label: 'Anydesk', sortable: true },
        { key: 'impresora', label: 'Impresora', sortable: true },
        { key: 'activoFijoImpresora', label: 'N° Activo Fijo Impresora', sortable: true },
        { key: 'escaner', label: 'Escáner', sortable: true },
        { key: 'activoFijoEscaner', label: 'N° Activo Fijo Escáner', sortable: true },
        { key: 'actions', label: 'Acciones', sortable: false }
      ]
    };
  },
  mounted() {
    this.obtenerEquipos();
  },
  methods: {
    // Convertir IP a número para ordenación
    ipToNumber(ip) {
      return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    },
    // Ordenar por IP
    sortByIp(items, sortDesc) {
      return items.slice().sort((a, b) => {
        const aIp = this.ipToNumber(a.ip);
        const bIp = this.ipToNumber(b.ip);
        return sortDesc ? bIp - aIp : aIp - bIp;
      });
    },
    // Ordenar ítems por columna
    ordenarItemsPorColumna(items, sortBy, sortDesc) {
      if (sortBy === 'ip') {
        return this.sortByIp(items, sortDesc);
      }
      return items.slice().sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortDesc ? 1 : -1;
        if (a[sortBy] > b[sortBy]) return sortDesc ? -1 : 1;
        return 0;
      });
    },
    // Manejar el cambio de orden en la tabla
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
    },
    // Obtener equipos desde Firebase
    async obtenerEquipos() {
      try {
        const snapshot = await getDocs(collection(db, 'equipos'));
        this.equipos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.equiposFiltrados = this.equipos;
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los equipos.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },
    // Aplicar filtro global
    aplicarFiltroGlobal() {
      const filtro = this.filtroGlobal.toLowerCase();
      this.equiposFiltrados = this.equipos.filter(equipo => {
        return Object.values(equipo).some(value =>
          value?.toString().toLowerCase().includes(filtro)
        );
      });
    },
    // Abrir modal para editar equipo
    abrirModalEditar(equipo) {
      this.equipoSeleccionado = { ...equipo };
      this.mostrarModal = true;
    },
    // Guardar cambios en el equipo
    async guardarCambios() {
      try {
        const equipoRef = doc(db, 'equipos', this.equipoSeleccionado.id);
        await updateDoc(equipoRef, this.equipoSeleccionado);
        Swal.fire('Guardado', 'El equipo ha sido actualizado', 'success');
        this.obtenerEquipos();
        this.mostrarModal = false;
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar el equipo.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },
    // Confirmar eliminación de equipo
    async confirmarEliminarEquipo(id) {
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
    // Eliminar equipo
    async eliminarEquipo(id) {
      try {
        await deleteDoc(doc(db, 'equipos', id));
        this.obtenerEquipos();
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el equipo.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },
    // Función para exportar a Excel
    exportarExcel() {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(
        this.equiposFiltrados.map(equipo => ({
          Dependencia: equipo.dependencia,
          Propiedad: equipo.propiedad,
          'Nombre de Equipo': equipo.nombreEquipo,
          IP: equipo.ip,
          MAC: equipo.mac,
          Serial: equipo.serial,
          'Activo Fijo': equipo.activoFijo,
          Anydesk: equipo.anydesk,
          Impresora: equipo.impresora,
          'Activo Fijo Impresora': equipo.activoFijoImpresora,
          Escáner: equipo.escaner,
          'Activo Fijo Escáner': equipo.activoFijoEscaner,
        }))
      );
      XLSX.utils.book_append_sheet(wb, ws, 'Equipos');
      XLSX.writeFile(wb, 'equipos.xlsx');
    },
    // Función para exportar a PDF
    exportarPDF() {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Dependencia', 'Propiedad', 'Nombre de Equipo', 'IP', 'MAC', 'Serial', 'Activo Fijo', 'Anydesk', 'Impresora', 'Escáner']],
        body: this.equiposFiltrados.map(equipo => [
          equipo.dependencia,
          equipo.propiedad,
          equipo.nombreEquipo,
          equipo.ip,
          equipo.mac,
          equipo.serial,
          equipo.activoFijo,
          equipo.anydesk,
          equipo.impresora,
          equipo.escaner,
        ]),
      });
      doc.save('equipos.pdf');
    }
  }
};

</script>

<style scoped>
.table-responsive-md {
  max-height: 500px;
  overflow-y: auto;
}
</style>
