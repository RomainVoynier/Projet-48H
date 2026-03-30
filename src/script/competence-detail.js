(() => {
  const details = {
    1: {
      code: "Premiers secours",
      short: "Prise en charge immediate des victimes",
      status: "valid",
      description:
        "Cette competence couvre les gestes d'urgence, l'analyse rapide de la situation et la mise en securite de la victime avant relais medical.",
      missions: [
        "Evaluer l'etat de la victime",
        "Realiser les gestes de secours adaptes",
        "Transmettre un bilan clair a la regulation"
      ],
      prerequis: "Formation initiale secourisme",
      validite: "24 mois",
      image:
        "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=120&q=80"
    },
    2: {
      code: "Conduite de secours",
      short: "Conduite operationnelle en intervention",
      status: "waiting",
      description:
        "Autorise la conduite de vehicules de secours en respectant les protocoles de securite, l'anticipation des risques routiers et les priorites d'intervention.",
      missions: [
        "Acheminer l'equipage en securite",
        "Appliquer les regles de conduite prioritaire",
        "Verifier l'etat du vehicule avant depart"
      ],
      prerequis: "Permis adapte et validation interne",
      validite: "36 mois",
      image:
        "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&w=120&q=80"
    },
    3: {
      code: "Communication",
      short: "Coordination radio et relation usagers",
      status: "valid",
      description:
        "Regroupe les techniques de communication radio, la transmission des informations critiques et la relation avec la population en situation sensible.",
      missions: [
        "Assurer les comptes rendus radio",
        "Coordonner avec le poste de commandement",
        "Informer calmement les personnes sur site"
      ],
      prerequis: "Connaissance des protocoles radio",
      validite: "Permanent avec recyclage annuel",
      image:
        "https://images.unsplash.com/photo-1437921687585-41dc18e0b730?auto=format&fit=crop&w=120&q=80"
    },
    4: {
      code: "HDR",
      short: "Habilitation electrique pour interventions techniques",
      status: "waiting",
      description:
        "Permet d'intervenir en environnement electrique securise, notamment lors d'operations de maintenance ou de depannage technique.",
      missions: [
        "Identifier les risques electriques sur zone",
        "Appliquer les procedures de consignation",
        "Intervenir en securite sur equipements"
      ],
      prerequis: "Sensibilisation electrique et EPI conformes",
      validite: "36 mois",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80"
    },
    5: {
      code: "COND VSAV",
      short: "Conduite de VSAV en contexte d'urgence",
      status: "valid",
      description:
        "Qualification pour la conduite de vehicule de secours et d'assistance aux victimes, en priorisant securite de l'equipage et rapidite d'arrivee.",
      missions: [
        "Assurer le transport des victimes",
        "Maintenir une conduite souple et anticipee",
        "Respecter les itineraires operationnels"
      ],
      prerequis: "Permis valide et aptitude medicale",
      validite: "36 mois",
      image:
        "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=120&q=80"
    },
    6: {
      code: "COND PL",
      short: "Conduite poids lourd en mission",
      status: "waiting",
      description:
        "Autorise la conduite de poids lourds operationnels, incluant les manoeuvres en zone contrainte et la gestion des chargements materiels.",
      missions: [
        "Conduire les engins lourds sur intervention",
        "Controler la stabilite et le gabarit",
        "Respecter les protocoles de stationnement"
      ],
      prerequis: "Permis PL et evaluation pratique",
      validite: "36 mois",
      image:
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=120&q=80"
    },
    7: {
      code: "CA1E",
      short: "Chef d'agres une equipe",
      status: "valid",
      description:
        "Certification de commandement de proximite pour diriger une equipe sur intervention et garantir la bonne execution des manoeuvres.",
      missions: [
        "Distribuer les roles sur intervention",
        "Prendre les decisions tactiques initiales",
        "Rendre compte au niveau superieur"
      ],
      prerequis: "Experience terrain et evaluation commandement",
      validite: "Permanent avec maintien de competences",
      image:
        "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=120&q=80"
    },
    8: {
      code: "CATE",
      short: "Conduite d'engins et materiels techniques",
      status: "waiting",
      description:
        "Competence utile aux metiers techniques comme les plombiers pour manipuler des engins, equipements motorises et outils specialises en securite.",
      missions: [
        "Utiliser les engins techniques selon procedure",
        "Securiser la zone d'evolution",
        "Verifier l'etat des materiels avant et apres usage"
      ],
      prerequis: "Formation pratique engins et securite chantier",
      validite: "24 mois",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=120&q=80"
    }
  };

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const data = details[id] || {
    code: "Competence inconnue",
    short: "Aucune fiche n'est disponible pour cette competence",
    status: "waiting",
    description: "Cette competence ne possede pas encore de fiche detaillee.",
    missions: ["Consulter le responsable formation pour plus d'informations"],
    prerequis: "A definir",
    validite: "A definir",
    image:
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=120&q=80"
  };

  const title = document.getElementById("competence-title");
  const short = document.getElementById("competence-short");
  const status = document.getElementById("competence-status");
  const code = document.getElementById("competence-code");
  const description = document.getElementById("competence-description");
  const missions = document.getElementById("competence-missions");
  const prerequis = document.getElementById("competence-prerequis");
  const validite = document.getElementById("competence-validite");
  const image = document.getElementById("competence-image");

  if (!title || !short || !status || !code || !description || !missions || !prerequis || !validite || !image) {
    return;
  }

  title.textContent = data.code;
  short.textContent = data.short;
  status.textContent = data.status === "valid" ? "VALIDE" : "EN ATTENTE";
  status.classList.remove("valid", "waiting");
  status.classList.add(data.status === "valid" ? "valid" : "waiting");
  code.textContent = data.code;
  description.textContent = data.description;
  prerequis.textContent = data.prerequis;
  validite.textContent = data.validite;
  image.src = data.image;
  image.alt = data.code;

  missions.innerHTML = data.missions.map((mission) => `<li>${mission}</li>`).join("");
})();
