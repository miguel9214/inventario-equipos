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

    <!-- Contenedor de la tabla con scroll -->
    <b-row class="mt-3">
      <b-col>
        <div class="table-container">
          <b-table
            :items="ordenarItemsPorColumna(equiposFiltrados, sortBy, sortDesc)"
            :fields="fields"
            striped
            hover
            responsive="sm"
            @sort-changed="onSortChanged"
          >
            <template v-slot:cell(observaciones)="data">
              <span>
                {{ data.value && data.value.length > 50 ? data.value.slice(0, 50) + "..." : data.value || "" }}
              </span>
            </template>

            <template v-slot:cell(actions)="data">
              <b-button variant="warning" @click="abrirModalEditar(data.item)">
                <font-awesome-icon icon="edit" /> Editar
              </b-button>
              <b-button variant="danger" @click="confirmarEliminarEquipo(data.item.id)">
                <font-awesome-icon icon="trash" /> Eliminar
              </b-button>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>

    <!-- Modal para editar equipo -->
    <b-modal v-model="mostrarModal" title="Editar Equipo" @ok="guardarCambios">
      <b-form>
        <!-- Campos de formulario para edición -->
        <b-form-group label="Dependencia">
          <b-form-input v-model="equipoSeleccionado.dependencia"></b-form-input>
        </b-form-group>
        <!-- Otros campos omitidos por brevedad -->
        <b-form-group label="Estado del equipo">
          <b-form-select
            v-model="equipoSeleccionado.estado"
            :options="['Excelente', 'Regular', 'Malo']"
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Operador del equipo">
          <b-form-input v-model="equipoSeleccionado.operador"></b-form-input>
        </b-form-group>
        <b-form-group label="Observaciones">
          <b-form-textarea
            v-model="equipoSeleccionado.observaciones"
            placeholder="Agregar observaciones sobre el equipo"
          ></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase"; // Asegúrate de que la ruta sea correcta
import Swal from "sweetalert2";
import * as XLSX from "xlsx"; // Importación de la librería XLSX para exportar a Excel
import jsPDF from "jspdf"; // Importación de jsPDF
import "jspdf-autotable"; // Importación de autotable para las tablas en PDF

export default {
  data() {
    return {
      equipos: [],
      equiposFiltrados: [],
      filtroGlobal: "",
      equipoSeleccionado: {}, // Aquí seleccionaremos el equipo
      mostrarModal: false, // Control de la visibilidad del modal
      sortBy: "ip", // Columna por la cual ordenar
      sortDesc: false, // Orden descendente
      fields: [
        { key: "dependencia", label: "Dependencia", sortable: true },
        { key: "propiedad", label: "Propiedad", sortable: true },
        { key: "nombreEquipo", label: "Nombre de Equipo", sortable: true },
        { key: "so", label: "SO", sortable: true },
        { key: "paqueteOfimatica", label: "Paquete Ofimática", sortable: true },
        { key: "marca", label: "Marca", sortable: true },
        { key: "cpu", label: "CPU", sortable: true },
        { key: "hdd", label: "HDD (GB)", sortable: true },
        { key: "ram", label: "RAM (GB)", sortable: true },
        { key: "ip", label: "IP", sortable: true },
        { key: "mac", label: "MAC", sortable: true },
        { key: "serial", label: "Serial", sortable: true },
        { key: "activoFijo", label: "N° Activo Fijo", sortable: true },
        { key: "anydesk", label: "Anydesk", sortable: true },
        { key: "impresora", label: "Impresora", sortable: true },
        {
          key: "activoFijoImpresora",
          label: "N° Activo Fijo Impresora",
          sortable: true,
        },
        { key: "escaner", label: "Escáner", sortable: true },
        {
          key: "activoFijoEscaner",
          label: "N° Activo Fijo Escáner",
          sortable: true,
        },
        { key: "estado", label: "Estado del equipo", sortable: true },
        { key: "operador", label: "Operador", sortable: true },
        { key: "observaciones", label: "Observaciones", sortable: true },
        { key: "actions", label: "Acciones", sortable: false },
      ],
    };
  },
  methods: {
    // Método para ordenar los items
    ordenarItemsPorColumna(items, sortBy, sortDesc) {
      return [...items].sort((a, b) => {
        const compareA = a[sortBy] || "";
        const compareB = b[sortBy] || "";
        if (compareA < compareB) return sortDesc ? 1 : -1;
        if (compareA > compareB) return sortDesc ? -1 : 1;
        return 0;
      });
    },
    // Método para manejar el cambio de orden
    onSortChanged(ctx) {
      this.sortBy = ctx.sortBy;
      this.sortDesc = ctx.sortDesc;
    },
    // Aplicar filtro global
    aplicarFiltroGlobal() {
      const filtro = this.filtroGlobal.toLowerCase();
      this.equiposFiltrados = this.equipos.filter((equipo) => {
        return (
          equipo.dependencia.toLowerCase().includes(filtro) ||
          equipo.propiedad.toLowerCase().includes(filtro) ||
          (equipo.nombreEquipo || "").toLowerCase().includes(filtro) ||
          (equipo.so || "").toLowerCase().includes(filtro) ||
          (equipo.paqueteOfimatica || "").toLowerCase().includes(filtro) ||
          (equipo.marca || "").toLowerCase().includes(filtro) ||
          (equipo.cpu || "").toLowerCase().includes(filtro) ||
          (equipo.hdd || "").toString().toLowerCase().includes(filtro) ||
          (equipo.ram || "").toString().toLowerCase().includes(filtro) ||
          (equipo.ip || "").toLowerCase().includes(filtro) ||
          (equipo.mac || "").toLowerCase().includes(filtro) ||
          (equipo.serial || "").toLowerCase().includes(filtro) ||
          (equipo.activoFijo || "").toLowerCase().includes(filtro) ||
          (equipo.anydesk || "").toLowerCase().includes(filtro) ||
          (equipo.impresora || "").toLowerCase().includes(filtro) ||
          (equipo.estado || "").toLowerCase().includes(filtro) ||
          (equipo.observaciones || "").toLowerCase().includes(filtro)
        );
      });
    },
    // Obtener los datos de Firebase
    async obtenerEquipos() {
      const equiposSnapshot = await getDocs(collection(db, "equipos"));
      this.equipos = equiposSnapshot.docs.map((doc) => ({
        id: doc.id, // Asegúrate de incluir el ID del documento
        ...doc.data(),
      }));
      this.equiposFiltrados = this.equipos;
    },
    // Abrir modal para editar equipo
    abrirModalEditar(equipo) {
      this.equipoSeleccionado = { ...equipo };
      this.mostrarModal = true;
    },
    // Guardar cambios del equipo editado
    async guardarCambios() {
      if (this.equipoSeleccionado.id) {
        const equipoDocRef = doc(db, "equipos", this.equipoSeleccionado.id);
        await updateDoc(equipoDocRef, this.equipoSeleccionado);
        this.mostrarModal = false; // Cierra el modal después de guardar
        await this.obtenerEquipos(); // Actualiza la lista después de editar
      } else {
        console.error("Error: El equipo seleccionado no tiene un ID válido");
      }
    },
    // Confirmar eliminación del equipo
    async confirmarEliminarEquipo(id) {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (confirmacion.isConfirmed) {
        await deleteDoc(doc(db, "equipos", id));
        await this.obtenerEquipos();
        Swal.fire("Eliminado", "El equipo ha sido eliminado.", "success");
      }
    },
    // Exportar a Excel
    exportarExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.equipos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Equipos");
      XLSX.writeFile(workbook, "equipos.xlsx");
    },
    // Exportar a PDF
    exportarPDF() {
      const doc = new jsPDF();
      doc.autoTable({
        head: [this.fields.map((field) => field.label)],
        body: this.equipos.map((equipo) =>
          this.fields.map((field) => equipo[field.key] || "")
        ),
      });
      doc.save("equipos.pdf");
    },
  },
  mounted() {
    this.obtenerEquipos(); // Cargar equipos al montar el componente
  },
};
</script>

<!-- Estilos para el scroll -->
<style scoped>
.table-container {
  max-height: 500px; /* Limitar la altura para el scroll vertical */
  overflow-x: auto; /* Scroll horizontal */
  overflow-y: auto; /* Scroll vertical */
  
}
</style>
