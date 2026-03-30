(() => {
	const competences = [
		{
			id: 1,
			title: "Premiers secours",
			description: "Soigner le blesse",
			status: "valid",
			image:
				"https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 2,
			title: "Conduite de secours",
			description: "Conduire les vehicules de secours",
			status: "waiting",
			image:
				"https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 3,
			title: "Communication",
			description: "Communiquer avec la population",
			status: "valid",
			image:
				"https://images.unsplash.com/photo-1437921687585-41dc18e0b730?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 4,
			title: "HDR",
			description: "Habilitation electrique pour interventions techniques",
			status: "waiting",
			image:
				"https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 5,
			title: "COND VSAV",
			description: "Conduite d'un VSAV pour missions de secours",
			status: "valid",
			image:
				"https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 6,
			title: "COND PL",
			description: "Conduite poids lourd en intervention logistique",
			status: "waiting",
			image:
				"https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 7,
			title: "CA1E",
			description: "Chef d'agres 1 equipe pour coordination terrain",
			status: "valid",
			image:
				"https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=120&q=80",
		},
		{
			id: 8,
			title: "CATE",
			description: "Conduite d'engins et materiels techniques specialises",
			status: "waiting",
			image:
				"https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=120&q=80",
		},
	];

	const STATUS_LABEL = {
		all: "TOUTES",
		valid: "VALIDE",
		waiting: "EN ATTENTE",
	};

	let currentFilter = "all";
	let searchTerm = "";

	const list = document.querySelector(".list");
	const searchInput = document.querySelector('.search-wrap input[type="search"]');
	const addButton = document.querySelector(".add-btn");
	const filterIcon = document.querySelector(".search-wrap .material-symbols-outlined:last-child");

	if (!list) {
		return;
	}

	const normalize = (value) =>
		value
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.trim();

	const getFilteredItems = () => {
		const needle = normalize(searchTerm);
		return competences.filter((item) => {
			const statusOk = currentFilter === "all" || item.status === currentFilter;
			const text = `${item.title} ${item.description}`;
			const searchOk = !needle || normalize(text).includes(needle);
			return statusOk && searchOk;
		});
	};

	const getTagClass = (status) => (status === "valid" ? "valid" : "waiting");

	const goToDetail = (itemId) => {
		const selected = competences.find((item) => item.id === itemId);
		if (!selected) {
			return;
		}

		const target = `competence-detail.html?id=${encodeURIComponent(String(itemId))}`;
		window.location.href = target;
	};

	const render = () => {
		const items = getFilteredItems();
		if (!items.length) {
			list.innerHTML = `
				<li>
					<div class="meta">
						<h2>Aucun resultat</h2>
						<p>Essaie un autre mot-cle ou change le filtre.</p>
					</div>
				</li>
			`;
			return;
		}

		list.innerHTML = items
			.map(
				(item) => `
					<li data-id="${item.id}" tabindex="0" role="button" aria-label="Ouvrir le detail de ${item.title}">
						<img src="${item.image}" alt="${item.title}">
						<div class="meta">
							<span class="tag ${getTagClass(item.status)}">${STATUS_LABEL[item.status]}</span>
							<h2>${item.title}</h2>
							<p>${item.description}</p>
						</div>
						<span class="material-symbols-outlined">chevron_right</span>
					</li>
				`
			)
			.join("");
	};

	const cycleFilter = () => {
		if (currentFilter === "all") {
			currentFilter = "valid";
		} else if (currentFilter === "valid") {
			currentFilter = "waiting";
		} else {
			currentFilter = "all";
		}

		if (filterIcon) {
			filterIcon.title = `Filtre: ${STATUS_LABEL[currentFilter]}`;
		}

		render();
	};

	if (searchInput) {
		searchInput.addEventListener("input", (event) => {
			searchTerm = event.target.value;
			render();
		});
	}

	if (addButton) {
		addButton.addEventListener("click", () => {
			const title = window.prompt("Nom de la competence :");
			if (!title) {
				return;
			}

			const description = window.prompt("Description :") || "Description a completer";

			competences.unshift({
				id: Date.now(),
				title: title.trim(),
				description: description.trim(),
				status: "waiting",
				image:
					"https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=120&q=80",
			});

			render();
		});
	}

	if (filterIcon) {
		filterIcon.style.cursor = "pointer";
		filterIcon.title = `Filtre: ${STATUS_LABEL[currentFilter]}`;
		filterIcon.addEventListener("click", cycleFilter);
	}

	list.addEventListener("click", (event) => {
		const row = event.target.closest("li[data-id]");
		if (!row) {
			return;
		}

		const itemId = Number(row.dataset.id);
		goToDetail(itemId);
	});

	list.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		const row = event.target.closest("li[data-id]");
		if (!row) {
			return;
		}

		event.preventDefault();
		const itemId = Number(row.dataset.id);
		goToDetail(itemId);
	});

	render();
})();
