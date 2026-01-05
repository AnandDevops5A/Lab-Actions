import Swal from "sweetalert2";


export const successMessage = (message, title = "Success !!") => {

     Swal.fire({
          title: title,
          text: message,
          icon: "success"
        });
}

export const errorMessage = (message, title = "Error ??") => {

     Swal.fire({
          title: title,
          text: message,
          icon: "error"
        });
}