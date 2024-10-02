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
          <template v-slot:cell(observaciones)="data">
            <!-- Verificación antes de mostrar observaciones -->
            <span>
              {{
                data.value && data.value.length > 50
                  ? data.value.slice(0, 50) + "..."
                  : data.value || ""
              }}
            </span>
          </template>

          <template v-slot:cell(actions)="data">
            <!-- Botón de editar -->
            <b-button variant="warning" @click="abrirModalEditar(data.item)">
              <font-awesome-icon icon="edit" /> Editar
            </b-button>
            <!-- Botón de eliminar -->
            <b-button
              variant="danger"
              @click="confirmarEliminarEquipo(data.item.id)"
            >
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
          <b-form-input
            v-model="equipoSeleccionado.nombreEquipo"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Sistema operativo">
          <b-form-input v-model="equipoSeleccionado.so"></b-form-input>
        </b-form-group>
        <b-form-group label="Paquete Ofimática">
          <b-form-input
            v-model="equipoSeleccionado.paqueteOfimatica"
          ></b-form-input>
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
          <b-form-input
            v-model="equipoSeleccionado.activoFijoImpresora"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Escaner">
          <b-form-input v-model="equipoSeleccionado.escaner"></b-form-input>
        </b-form-group>
        <b-form-group label="Activo fijo escaner">
          <b-form-input
            v-model="equipoSeleccionado.activoFijoEscaner"
          ></b-form-input>
        </b-form-group>

        <!-- Nuevo campo: Estado del equipo -->
        <b-form-group label="Estado del equipo">
          <b-form-select
            v-model="equipoSeleccionado.estado"
            :options="['Excelente', 'Regular', 'Malo']"
          ></b-form-select>
        </b-form-group>

        <!-- Nuevo campo: Operador del equipo -->
        <b-form-group label="Operador del equipo">
          <b-form-input v-model="equipoSeleccionado.operador"></b-form-input>
        </b-form-group>

        <!-- Nuevo campo: Observaciones -->
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
      equipoSeleccionado: {},
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
          (equipo.dependencia || "").toLowerCase().includes(filtro) ||
          (equipo.propiedad || "").toLowerCase().includes(filtro) ||
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
          (equipo.estado || "").toLowerCase().includes(filtro) || // Filtro para estado
          (equipo.observaciones || "").toLowerCase().includes(filtro) // Filtro para observacione
        );
      });
    },
    // Obtener los datos de Firebase
    async obtenerEquipos() {
      const equiposSnapshot = await getDocs(collection(db, "equipos"));
      this.equipos = equiposSnapshot.docs.map((doc) => doc.data());
      this.equiposFiltrados = this.equipos;
    },
    // Abrir modal de edición
    abrirModalEditar(equipo) {
      this.equipoSeleccionado = { ...equipo };
      this.mostrarModal = true;
    },
    // Guardar cambios en el equipo
    async guardarCambios() {
      await updateDoc(doc(db, "equipos", this.equipoSeleccionado.id), {
        ...this.equipoSeleccionado,
      });
      this.mostrarModal = false;
      Swal.fire("Guardado", "Los cambios han sido guardados", "success");
      this.obtenerEquipos(); // Actualizar lista de equipos
    },
    // Confirmar eliminación
    confirmarEliminarEquipo(id) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDoc(doc(db, "equipos", id));
          Swal.fire("Eliminado", "El equipo ha sido eliminado.", "success");
          this.obtenerEquipos(); // Actualizar lista de equipos
        }
      });
    },
    // Exportar a Excel
    exportarExcel() {
      const ws = XLSX.utils.json_to_sheet(this.equiposFiltrados);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Equipos");
      XLSX.writeFile(wb, "equipos.xlsx");
    },
    // Exportar a PDF
    exportarPDF() {
      const doc = new jsPDF();
      doc.autoTable({
        head: [this.fields.map((field) => field.label)],
        body: this.equiposFiltrados.map((equipo) =>
          this.fields.map((field) => equipo[field.key] || "")
        ),
      });
      doc.save("equipos.pdf");
    },
  },
  created() {
    this.obtenerEquipos();
  },
};
</script>

<style scoped>
.table-responsive-md {
  max-height: 600px;
  overflow-y: auto;
}
</style>
