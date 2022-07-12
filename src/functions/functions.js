import Swal from "sweetalert2";

export const alerta = (cargando, titulo, icono=null, mensaje) => {
    if(cargando){
        Swal.fire({
            position: 'center',
            title: titulo,
            text :mensaje,
            showConfirmButton: false,
            allowEnterKey:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
            didOpen: ()=>{
              Swal.showLoading()
            },  
        })
    }else{
        Swal.fire({
            position: 'center',
            title: titulo,
            text :mensaje,
            icon:icono,
            showConfirmButton: true,
            allowEnterKey:false,
            allowEscapeKey:false,
            allowOutsideClick:false,
        })
    }
    
}
