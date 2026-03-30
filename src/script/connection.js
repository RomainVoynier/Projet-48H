(() => {
	const form = document.getElementById("loginForm");
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
			email: String(formData.get("email") || "").trim(),
			password: String(formData.get("password") || ""),
		};

		if (!payload.email || !payload.password) {
			setFeedback("Merci de saisir email et mot de passe.", true);
			return;
		}

		try {
			setFeedback("Connexion en cours...");
			const response = await fetch(`${API_BASE}/api/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				setFeedback(data.message || "Connexion impossible.", true);
				return;
			}

			window.localStorage.setItem("appCurrentUser", JSON.stringify(data));
			setFeedback(`Bienvenue ${data.fullName}. Redirection...`);

			setTimeout(() => {
				window.location.href = "agents.html";
			}, 800);
		} catch (_error) {
			setFeedback("Serveur indisponible. Demarre le backend puis reessaie.", true);
		}
	});
})();
