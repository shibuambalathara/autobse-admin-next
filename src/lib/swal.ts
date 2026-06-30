import Swal from "sweetalert2";

/**
 * App-wide SweetAlert2 defaults.
 * z-index is also set in globals.css so confirmations appear above modals.
 */
const AppSwal = Swal.mixin({
  heightAuto: false,
});

export default AppSwal;
export { AppSwal as Swal };
