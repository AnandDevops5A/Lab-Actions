import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const successMessage = (message, title = "Success !!") => {
  Swal.fire({
    title: title,
    text: message,
    icon: "success",
  });
};

export const errorMessage = (message, title = "Error ??") => {
  Swal.fire({
    title: title,
    text: message,
    icon: "error",
  });
};

export const askLogin = (router) => {
  Swal.fire({
    text: "Please Login for next step 😊",
//     text: "You need to be logged in to perform this action.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Let's, login !",
    cancelButtonText: "Not, now",
  }).then((result) => {
    if (result.isConfirmed) {
      router.push("/auth");
    }
  });
};
export const simpleMessage = (message, title = "Oops..") => {
  Swal.fire({
    title: title,
    text: message,
    icon: "warning",
  });
};
export const confirmMessage = async (message, title = "Are you sure?", confirmButtonText = "Yes") => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
    cancelButtonText: "No, cancel",
  });
  return result.isConfirmed;
};



  



