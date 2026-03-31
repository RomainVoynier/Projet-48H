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
            
            // ===== LOGIN LOCALSTORAGE =====
let users = JSON.parse(localStorage.getItem("users")) || [];

// Chercher utilisateur
const user = users.find(
    u => u.email === payload.email && u.password === payload.password
);

if (!user) {
    setFeedback("Email ou mot de passe incorrect ", true);
    return;
}

// Stocker session
localStorage.setItem("appCurrentUser", JSON.stringify(user));

setFeedback(`Bienvenue ${user.fullName} 👋`);

setTimeout(() => {
    window.location.href = "agents.html";
}, 800);	
			setFeedback(`Bienvenue ${user.fullName}. Redirection...`);

            setTimeout(() => {
                window.location.href = "agents.html";
            }, 800);
        } catch (error) {
            console.error(" Erreur fetch:", error);
            setFeedback("Serveur indisponible. Demarre le backend puis reessaie.", true);
        }
    });
})();