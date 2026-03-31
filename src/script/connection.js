(() => {
	const form = document.getElementById("loginForm");
	const feedback = document.getElementById("feedback");
	
	// Detecter si on est en mode local (fichier) ou via serveur
	const isFileProtocol = window.location.protocol === "file:";
	const API_BASE = isFileProtocol ? "http://localhost:3000" : "";
	
	// Log pour debug
	console.log(" Mode détecté:", isFileProtocol ? "LOCAL (file://)" : "SERVEUR (http://)");
	console.log(" API_BASE:", API_BASE || "relatif (même serveur)");

	if (!form || !feedback) {
		return;
	}

	const setFeedback = (message, isError = false) => {
		feedback.textContent = message;
		feedback.classList.toggle("error", isError);
	};

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const payload = {
			email: String(formData.get("email") || "").trim(),
			password: String(formData.get("password") || ""),
		};

		if (!payload.email || !payload.password) {
			setFeedback("Merci de saisir email et mot de passe.", true);
			return;
		}

		try {
			setFeedback("Connexion en cours...");
			const apiUrl = `${API_BASE}/api/login`;
			console.log(" Envoi vers:", apiUrl);
			console.log(" Payload:", payload);
			
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			console.log(" Reponse status:", response.status);
			
			const data = await response.json().catch(() => ({}));
			console.log(" Reponse data:", data);

			if (!response.ok) {
				setFeedback(data.message || "Connexion impossible.", true);
				return;
			}

			window.localStorage.setItem("appCurrentUser", JSON.stringify(data));
			setFeedback(`Bienvenue ${data.fullName}. Redirection...`);

			setTimeout(() => {
				window.location.href = "agents.html";
			}, 800);
		} catch (error) {
			console.error("❌ Erreur fetch:", error);
			setFeedback("Serveur indisponible. Demarre le backend puis reessaie.", true);
		}
	});
})();
