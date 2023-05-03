const changeMessageWidth = () => {
	// get all table in the page
	const tables = document.querySelectorAll('table');

	// for each table in the page and set parrent div width to width of tbody of table
	tables.forEach((table) => {
		const tableBody = table.querySelector('tbody');
		const tableBodyWidth = tableBody.offsetWidth + 35;
		const tableParent = table.parentElement;

		tableParent.style.width = `${tableBodyWidth}px`;
	});
};

export default changeMessageWidth;
