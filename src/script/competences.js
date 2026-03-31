(() => {
	const competences = [
		{ id: 1, title: "Premiers secours", description: "Soigner le blesse", status: "valid", image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=120&q=80" },
		{ id: 2, title: "Conduite de secours", description: "Conduire les vehicules de secours", status: "waiting", image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&w=120&q=80" },
		{ id: 3, title: "Communication", description: "Communiquer avec la population", status: "valid", image: "https://images.unsplash.com/photo-1437921687585-41dc18e0b730?auto=format&fit=crop&w=120&q=80" },
		{ id: 4, title: "HDR", description: "Habilitation electrique pour interventions techniques", status: "waiting", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80" },
		{ id: 5, title: "COND VSAV", description: "Conduite d'un VSAV pour missions de secours", status: "valid", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=120&q=80" },
		{ id: 6, title: "COND PL", description: "Conduite poids lourd en intervention logistique", status: "waiting", image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=120&q=80" },
		{ id: 7, title: "CA1E", description: "Chef d'agres 1 equipe pour coordination terrain", status: "valid", image: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=120&q=80" },
		{ id: 8, title: "CATE", description: "Conduite d'engins et materiels techniques specialises", status: "waiting", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=120&q=80" },
	];
	const LABELS = { all: "TOUTES", valid: "VALIDE", waiting: "EN ATTENTE" };
	let filter = "all", search = "";
	const list = document.querySelector(".list"), searchInput = document.querySelector('input[type="search"]'), addBtn = document.querySelector(".add-btn"), filterIcon = document.querySelector(".search-wrap .material-symbols-outlined:last-child");
	if (!list) return;

	const normalize = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
	const filtered = () => competences.filter((i) => (filter === "all" || i.status === filter) && (!search || normalize(`${i.title} ${i.description}`).includes(normalize(search))));
	
	const render = () => {
		const items = filtered();
		list.innerHTML = items.length ? items.map((i) => `<li data-id="${i.id}" tabindex="0" role="button"><img src="${i.image}" alt="${i.title}"><div class="meta"><span class="tag ${i.status === "valid" ? "valid" : "waiting"}">${LABELS[i.status]}</span><h2>${i.title}</h2><p>${i.description}</p></div><span class="material-symbols-outlined">chevron_right</span></li>`).join("") : "<li><div class='meta'><h2>Aucun resultat</h2><p>Essaie un autre mot-cle ou change le filtre.</p></div></li>";
	};

	const goDetail = (id) => window.location.href = `competence-detail.html?id=${encodeURIComponent(id)}`;
	
	if (searchInput) searchInput.addEventListener("input", (e) => { search = e.target.value; render(); });
	if (addBtn) addBtn.addEventListener("click", () => {
		const title = prompt("Nom de la competence :");
		if (!title) return;
		competences.unshift({ id: Date.now(), title: title.trim(), description: (prompt("Description :") || "Description a completer").trim(), status: "waiting", image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=120&q=80" });
		render();
	});
	if (filterIcon) {
		filterIcon.style.cursor = "pointer";
		filterIcon.title = `Filtre: ${LABELS[filter]}`;
		filterIcon.addEventListener("click", () => { filter = filter === "all" ? "valid" : filter === "valid" ? "waiting" : "all"; filterIcon.title = `Filtre: ${LABELS[filter]}`; render(); });
	}

	list.addEventListener("click", (e) => { const li = e.target.closest("li[data-id]"); if (li) goDetail(li.dataset.id); });
	list.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.closest("li[data-id]")) { e.preventDefault(); goDetail(e.target.closest("li[data-id]").dataset.id); } });
	render();
})();
