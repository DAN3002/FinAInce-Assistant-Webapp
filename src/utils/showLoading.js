import Swal from 'sweetalert2';

export default function showLoading() {
	return Swal.fire({
		// title: 'Loading...',
		allowOutsideClick: false,
		html: `
			<div class="modal__loading">
				<img src="/loading.gif" alt="" width="500px">
			</div>
		`,
		showConfirmButton: false,
		width: 500,
	});
}
