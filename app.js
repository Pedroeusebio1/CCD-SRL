//Selectores 
const totalH = document.querySelector("#totalMostrar") 
const fechaInput = document.querySelector('#fecha');
const rncInput = document.querySelector('#rnc');
const empresaInput = document.querySelector('#empresa');
const descripcionInput = document.querySelector('#descripcion');
const subtotalInput = document.querySelector('#subtotal');
const impSelect = document.querySelector('#impSelect');
const formulario = document.querySelector('#formulario-registro')
const formularioInput = document.querySelector('#formulario-registro input[type="submit"]');
const contenedorGastos = document.querySelector('#gastos');

//Eventos
document.addEventListener('DOMContentLoaded', () => datosObj.impSelect = impSelect.value);
fechaInput.addEventListener('change',guardarDatos);
rncInput.addEventListener('change',guardarDatos);
empresaInput.addEventListener('change',guardarDatos);
descripcionInput.addEventListener('change',guardarDatos);
impSelect.addEventListener('change',guardarDatos);
subtotalInput.addEventListener('change',guardarDatos);
formulario.addEventListener('submit',submitRegistro);


//Objeto de registro
const datosObj = {
    id: generarId(),
    fecha: '',
    rnc: '',
    empresa: '',
    descripcion: '',
    impSelect: '',
    subtotal: '',
    total: ''
}

//variables
let editando = false;

//Classes

//Notificacion
class Notificacion {
    constructor({texto, tipo}) {
        this.texto = texto,
        this.tipo = tipo,
        this.mostrar()
    }
    mostrar(){
        //Crear notificación
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center','w-full', 'p-3','text-white', 'my-5', 'alert', 'uppercase', 'font-bold','text-sm')
    
        //Eliminar alertas duplicadas
        const alertaPrevia = document.querySelector('.alert');
        alertaPrevia?.remove();

        //Aqui vamos a validar de que tipo es la notificacion
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')

        //Insertando el texto en la notificación
        alerta.textContent = this.texto

        //insertar el div en el HTML

    //vamos a ubicarnos en el elemento padre de Formulario-cita y nos vamos a insertar antes del formulario
    formulario.parentElement.insertBefore(alerta,formulario)

    //Despues de 3 seg se borrara la notificación
    setTimeout(() => {
        alerta.remove()
    }, 3000);
}};

class AdminGastos {
    constructor() {
        this.gastos = []
    }

    agregar(gastos){
        this.gastos = [...this.gastos, gastos]
        this.mostrar();
    }

    editar(gastoActualizado){
        this.gastos = this.gastos.map(gasto => gasto.id ===gastoActualizado.id ? gastoActualizado : gasto);
        this.mostrar();
    }

    eliminar(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.mostrar();
        console.log(this.gastos);
    }

    mostrar(){
        //Limpiar el HTML
        while (contenedorGastos.firstChild) {
        contenedorGastos.removeChild(contenedorGastos.firstChild)}

        //Validador para cuando no hay gastos muestre el el mismo texto
        if(this.gastos.length === 0){
            contenedorGastos.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No hay gastos aún</p>'
            return;
        }

        //generando los gastos
        this.gastos.forEach(gasto =>{
            
            const divGasto = document.createElement('DIV');
            divGasto.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
            
            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${gasto.fecha}`;
        
            const rnc = document.createElement('p');
            rnc.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            rnc.innerHTML = `<span class="font-bold uppercase">RNC: </span> ${gasto.rnc}`;
        
            const empresa = document.createElement('p');
            empresa.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            empresa.innerHTML = `<span class="font-bold uppercase">Empresa: </span> ${gasto.empresa}`;
        
            const descripcion = document.createElement('p');
            descripcion.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            descripcion.innerHTML = `<span class="font-bold uppercase">Descripción: </span> ${gasto.descripcion}`;
        
            const impuesto = document.createElement('p');
            impuesto.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            impuesto.innerHTML = `<span class="font-bold uppercase">Impuesto %: </span> ${gasto.impSelect}`;
        
            const total = document.createElement('p');
            total.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            total.innerHTML = `<span class="font-bold uppercase">Total: </span> RD$ ${Number(gasto.total).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            //Botones de Editar y Eliminar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-1', 'btn-editar');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            const clone = structuredClone(gasto)
            btnEditar.onclick = () => {
                cargarEdicion(clone);
                console.log(datosObj);
            }

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-1');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = ()=> this.eliminar(gasto.id);

            const contenedorBotones = document.createElement('DIV')
            contenedorBotones.classList.add('flex', 'justify-evenly', 'mt-5')
        
            contenedorBotones.appendChild(btnEditar)
            contenedorBotones.appendChild(btnEliminar)

            //Inyectando al HTML
            divGasto.appendChild(fecha);
            divGasto.appendChild(rnc);
            divGasto.appendChild(empresa);
            divGasto.appendChild(descripcion);
            divGasto.appendChild(impuesto);
            divGasto.appendChild(total);
            divGasto.appendChild(contenedorBotones);
            contenedorGastos.appendChild(divGasto);
        })
}};


//Funciones
function guardarDatos(e) {
    datosObj[e.target.name] = e.target.value
    datosObj.total = Number(datosObj.subtotal) * Number(datosObj.impSelect);

    //Limpia el HTML
    limpiarCalculo();

    //Generar calculo
    calcularTotal()
};

const gastos = new AdminGastos()

function submitRegistro(e) {
    e.preventDefault()
    if(Object.values(datosObj).some(valor => String(valor).trim() === '')){
        //Nueva instacia
        new Notificacion({
            texto:'todos los campos son obligatorios',
            tipo:'error'
        })
        return

    } if (editando) {
        gastos.editar({...datosObj});
        new Notificacion({
            texto:'Guardado Correctamente',
            tipo: 'Exito'
        })
    } 
    
    else{
        gastos.agregar({...datosObj}); 
        new Notificacion({
            texto: 'Gasto registrado satisfactoriamente',
            tipo: 'exito'
        })
    }
    console.log(datosObj);
    formulario.reset();
    reiniciarDatosGasto();
    limpiarCalculo();
    editando = false;
}

function reiniciarDatosGasto() {
    Object.assign(datosObj,{
    id: generarId(),
    fecha: '',
    rnc: '',
    empresa: '',
    descripcion: '',
    impSelect: '',
    subtotal: '',
    total: calcularTotal(),
    })
    console.log(datosObj);
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now()
}

function cargarEdicion(gasto) {
    Object.assign(datosObj, gasto)

    fechaInput.value = gasto.fecha
    rncInput.value = gasto.rnc
    empresaInput.value = gasto.empresa
    descripcionInput.value = gasto.descripcion
    impSelect.value = gasto.impSelect
    subtotalInput.value = gasto.subtotal
    calcularTotal();

    editando = true;

    formularioInput.value = 'Guardar Cambios'
}

    //Limpiar HTML del Calculo
    function limpiarCalculo(){
    while (totalH.firstChild) {
        totalH.removeChild(totalH.firstChild)}
}

function calcularTotal() {
    const totalP = document.createElement('P');
    totalP.classList.add('font-bold', 'mt-2', 'text-3xl', 'text-center', 'text-red-700');
    totalP.innerHTML = `RD$ ${Number(datosObj.total).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;   
    totalH.appendChild(totalP);
}