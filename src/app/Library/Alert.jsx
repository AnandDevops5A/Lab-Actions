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
    text: "Please Login",
//     text: "You need to be logged in to perform this action.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, login now!",
    cancelButtonText: "Not, now",
  }).then((result) => {
    if (result.isConfirmed) {
      router.push("/authorization");
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
export const confirmMessage = async (message, title = "Are you sure?") => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  });
  return result.isConfirmed;
};



  