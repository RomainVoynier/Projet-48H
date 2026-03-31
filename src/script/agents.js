(() => {
	const agents = [
		{ id: 1, name: "Dupont Alain", role: "Chef de Centre Incendie", description: "Responsable de la coordination et gestion opérationnelle du centre d'incendie.", image: "https://media.istockphoto.com/id/1181447291/fr/photo/verticale-du-pompier.jpg?s=1024x1024&w=is&k=20&c=NnXvn-GFBdLhxmsF6_BHrjPXzQbl7KDWo9pkMCEAW4g=" },
		{ id: 2, name: "Roux Jean-Baptiste", role: "Pompier", description: "Interventions d'urgence, secours en montagne et situations critiques.", image: "https://media.istockphoto.com/photos/closeup-portrait-of-heroic-fireman-in-protective-suit-and-red-helmet-picture-id1425152341?k=20&m=1425152341&s=170667a&w=0&h=Nk3blMBpDmw4bT6wQuskttP6HXQvTZMgJ36R-ZRK0v0=" },
		{ id: 3, name: "Martin Lea", role: "Secouriste", description: "Assistance médicale d'urgence et premiers soins sur les lieux d'intervention.", image: "https://media.istockphoto.com/photos/portrait-of-female-firefighter-in-helmet-leaning-on-truck-at-fire-picture-id1061369876?k=20&m=1061369876&s=170667a&w=0&h=S3awLz-b1tbBufcsdACEkj6peujiZlWj1a5ARDYBhKU=" },
		{ id: 4, name: "Durand Sophie", role: "Infirmiere", description: "Soins médicaux spécialisés et suivi sanitaire des opérations.", image: "https://media.istockphoto.com/id/1181447291/fr/photo/verticale-du-pompier.jpg?s=1024x1024&w=is&k=20&c=NnXvn-GFBdLhxmsF6_BHrjPXzQbl7KDWo9pkMCEAW4g=" },
	];

	const list = document.querySelector(".list"), searchInput = document.querySelector('input[type="search"]');
	if (!list) return;

	const normalize = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	const showDescription = (agent) => {
		const modal = document.createElement("div");
		modal.className = "description-modal";
		modal.innerHTML = `<div class="modal-content"><button class="close-btn">&times;</button><h2>${agent.name}</h2><p class="role">${agent.role}</p><p class="desc">${agent.description}</p></div>`;
		modal.addEventListener("click", (e) => { if (e.target === modal || e.target.classList.contains("close-btn")) modal.remove(); });
		document.body.appendChild(modal);
	};

	const render = (filter = "") => {
		const needle = normalize(filter);
		list.innerHTML = agents.filter(a => !needle || normalize(`${a.name} ${a.role}`).includes(needle)).map((a, i) => `<li data-idx="${i}"><img src="${a.image}" alt="${a.name}"><div class="meta"><h2>${a.name}</h2><p>${a.role}</p></div><span class="material-symbols-outlined">chevron_right</span></li>`).join("") || "<li><div class='meta'><h2>Aucun résultat</h2></div></li>";
		document.querySelectorAll(".list li[data-idx]").forEach(li => { li.setAttribute("tabindex", "0"); li.setAttribute("role", "button"); li.style.cursor = "pointer"; });
	};

	if (searchInput) searchInput.addEventListener("input", (e) => render(e.target.value));

	list.addEventListener("click", (e) => {
		const li = e.target.closest("li[data-idx]");
		if (li) showDescription(agents[li.dataset.idx]);
	});

	list.addEventListener("keydown", (e) => {
		if ((e.key !== "Enter" && e.key !== " ") || !e.target.closest("li[data-idx]")) return;
		e.preventDefault();
		showDescription(agents[e.target.closest("li[data-idx]").dataset.idx]);
	});

	render();
})();
