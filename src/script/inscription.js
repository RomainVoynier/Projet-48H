(() => {
    const form = document.getElementById("registerForm");
    const feedback = document.getElementById("feedback");

    if (!form || !feedback) return;

    const setFeedback = (message, isError = false) => {
        feedback.textContent = message;
        feedback.classList.toggle("error", isError);
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const user = {
            fullName: String(formData.get("fullName") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            password: String(formData.get("password") || ""),
            role: "Administrateur"
        };

        // Vérif champs
        if (!user.fullName || !user.email || !user.password) {
            setFeedback("Merci de remplir tous les champs.", true);
            return;
        }

        // Récup users existants
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Vérif email unique
        const exists = users.find(u => u.email === user.email);

        if (exists) {
            setFeedback("Email déjà utilisé ❌", true);
            return;
        }

        // Ajouter user
        users.push(user);

        // Sauvegarder
        localStorage.setItem("users", JSON.stringify(users));

        // Stocker dernier inscrit (optionnel)
        localStorage.setItem("appLastRegisteredUser", JSON.stringify(user));

        setFeedback("Compte créé avec succès ✅");

        setTimeout(() => {
            window.location.href = "connection.html";
        }, 800);
    });
})();