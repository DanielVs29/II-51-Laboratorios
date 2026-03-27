import { supabase } from "./supabase.js";


const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtCorreo = document.getElementById("txtCorreo");
const txtCarrera = document.getElementById("txtCarrera");
const txtFechaNac = document.getElementById("txtFechaNac");

const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");
const btnClear = document.getElementById("btnClear");

const txtSearch = document.getElementById("txtSearch");
const tbody = document.getElementById("tbodyStudents");
const tituloForm = document.getElementById("tituloForm");


const consultarEstudiantes = async () => {
  let query = supabase
    .from("estudiantes")
    .select("id,nombre,apellido,correo,carrera,fechaNacimiento");

  if (txtSearch.value.trim()) {
    query = query.or(
      `nombre.ilike.%${txtSearch.value}%,apellido.ilike.%${txtSearch.value}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return Swal.fire("Error cargando estudiantes", "", "error");
  }

  tbody.innerHTML = "";

  data.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.nombre ?? ""}</td>
      <td>${r.apellido ?? ""}</td>
      <td>${r.correo ?? ""}</td>
      <td>${r.carrera ?? ""}</td>
      <td>${
        r.fechaNacimiento
          ? new Date(r.fechaNacimiento).toLocaleDateString()
          : ""
      }</td>
      <td>
        <button class="btnEditar" data-id="${r.id}">Editar</button>
        <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
};

const guardarEstudiante = async () => {
  const estudiante = {
    nombre: txtNombre.value.trim(),
    apellido: txtApellido.value.trim(),
    correo: txtCorreo.value.trim(),
    carrera: txtCarrera.value.trim(),
    fechaNacimiento: txtFechaNac.value
  };

  if (!estudiante.nombre || !estudiante.apellido) {
    return Swal.fire("Complete los campos", "", "warning");
  }

  let error;

  if (txtId.value) {
    ({ error } = await supabase
      .from("estudiantes")
      .update(estudiante)
      .eq("id", txtId.value));
  } else {
    ({ error } = await supabase
      .from("estudiantes")
      .insert([estudiante]));
  }

  if (error) {
    return Swal.fire("Error guardando estudiante", "", "error");
  }

  Swal.fire("Guardado correctamente", "", "success");

  limpiarFormulario();
  consultarEstudiantes();
};

const eliminarEstudiante = async (id) => {
  const result = await Swal.fire({
    title: "¿Eliminar estudiante?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar"
  });

  if (!result.isConfirmed) return;

  const { error } = await supabase
    .from("estudiantes")
    .delete()
    .eq("id", id);

  if (error) {
    return Swal.fire("Error al eliminar", "", "error");
  }

  Swal.fire("Eliminado correctamente", "", "success");
  consultarEstudiantes();
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtApellido.value = "";
  txtCorreo.value = "";
  txtCarrera.value = "";
  txtFechaNac.value = "";

  btnAdd.textContent = "Agregar";
  tituloForm.textContent = "Agregar Estudiantes";
};

window.onload = () => consultarEstudiantes();

btnLoad.addEventListener("click", consultarEstudiantes);
btnAdd.addEventListener("click", guardarEstudiante);
btnCancel.addEventListener("click", limpiarFormulario);

btnClear.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarEstudiantes();

  Swal.fire("Filtro limpiado", "", "info");
});


tbody.addEventListener("click", async (e) => {
  const id = e.target.getAttribute("data-id");

  if (e.target.classList.contains("btnEliminar")) {
    eliminarEstudiante(id);
  }

  if (e.target.classList.contains("btnEditar")) {
    const { data, error } = await supabase
      .from("estudiantes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return Swal.fire("Error al cargar estudiante", "", "error");
    }

    txtId.value = data.id;
    txtNombre.value = data.nombre;
    txtApellido.value = data.apellido;
    txtCorreo.value = data.correo;
    txtCarrera.value = data.carrera;
    txtFechaNac.value = data.fechaNacimiento;

    btnAdd.textContent = "Actualizar";
    tituloForm.textContent = "Editar Estudiante";
  }
});