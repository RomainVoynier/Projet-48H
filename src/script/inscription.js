(() => {
	const form = document.getElementById("registerForm");
	const feedback = document.getElementById("feedback");
	
	// Detecter si on est en mode local (fichier) ou via serveur
	const isFileProtocol = window.location.protocol === "file:";
	const API_BASE = isFileProtocol ? "http://localhost:3000" : "";
	
	// Log pour debug
	console.log("🔍 Mode détecté:", isFileProtocol ? "LOCAL (file://)" : "SERVEUR (http://)");
	console.log("🔗 API_BASE:", API_BASE || "relatif (même serveur)");

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
			fullName: String(formData.get("fullName") || "").trim(),
			email: String(formData.get("email") || "").trim(),
			role: String(formData.get("role") || "Administrateur").trim(),
			password: String(formData.get("password") || ""),
		};

		if (!payload.fullName || !payload.email || !payload.password) {
			setFeedback("Merci de remplir tous les champs obligatoires.", true);
			return;
		}

		try {
			setFeedback("Inscription en cours...");
			const apiUrl = `${API_BASE}/api/register`;
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
				setFeedback(data.message || "Erreur lors de l'inscription.", true);
				return;
			}

			setFeedback("Compte cree avec succes. Redirection vers la connexion...");
			window.localStorage.setItem("appLastRegisteredUser", JSON.stringify(data));

			setTimeout(() => {
				window.location.href = "connection.html";
			}, 900);
		} catch (error) {
			console.error(" Erreur fetch:", error);
		}
	});
})();
