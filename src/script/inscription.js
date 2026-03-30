(() => {
	const form = document.getElementById("registerForm");
	const feedback = document.getElementById("feedback");
	const API_BASE = window.location.protocol === "file:" ? "http://localhost:3000" : "";

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
			role: String(formData.get("role") || "Plombier").trim(),
			password: String(formData.get("password") || ""),
		};

		if (!payload.fullName || !payload.email || !payload.password) {
			setFeedback("Merci de remplir tous les champs obligatoires.", true);
			return;
		}

		try {
			setFeedback("Inscription en cours...");
			const response = await fetch(`${API_BASE}/api/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				setFeedback(data.message || "Erreur lors de l'inscription.", true);
				return;
			}

			setFeedback("Compte cree avec succes. Redirection vers la connexion...");
			window.localStorage.setItem("appLastRegisteredUser", JSON.stringify(data));

			setTimeout(() => {
				window.location.href = "connection.html";
			}, 900);
		} catch (_error) {
			setFeedback("Serveur indisponible. Demarre le backend puis reessaie.", true);
		}
	});
})();
