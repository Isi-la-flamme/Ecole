// API Base URL
const API_BASE_URL = '/api';

// Token storage
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let adminSubmissionsData = [];
let adminRegistrationsData = [];
let adminFilters = {
    submissions: 'all',
    registrations: 'all'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    showPage('accueil');
    loadCourses();
    if (authToken) {
        loadInteractions();
    }
});

// Page Navigation
function showPage(pageId) {
    const privatePages = ['interactions', 'compte'];

    if (privatePages.includes(pageId) && !authToken) {
        showAlert('Veuillez vous connecter pour accéder à cette page', 'error');
        pageId = 'connexion';
    }

    if (pageId === 'administration' && !isAdmin()) {
        showAlert('Accès réservé à l\'administrateur', 'error');
        pageId = authToken ? 'accueil' : 'connexion';
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');

        // Load data if needed
        if (pageId === 'interactions') {
            loadInteractions();
        } else if (pageId === 'administration') {
            loadAdminDashboard();
        } else if (pageId === 'compte') {
            displayAccountInfo();
            loadSubmissions();
            loadUserRegistrations();
        } else if (pageId === 'inscription') {
            // Charger les données en cache si disponibles
            if (authToken) {
                loadCachedRegistrationData();
            }
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Authentication
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const fullName = document.getElementById('registerFullName').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, fullName })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            showAlert('Compte créé avec succès!', 'success');
            
            // Vérifier s'il y a des données d'inscription en cache
            const cachedRegistrationData = localStorage.getItem('cachedRegistrationData');
            if (cachedRegistrationData) {
                loadCachedRegistrationData();
                showPage('inscription');
            } else {
                showPage('accueil');
            }
        } else {
            showAlert(data.error || 'Erreur lors de la création du compte', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de la création du compte', 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            showAlert('Connexion réussie!', 'success');
            showPage('accueil');
        } else {
            showAlert(data.error || 'Email ou mot de passe incorrect', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de la connexion', 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showAlert('Déconnexion réussie', 'success');
    showPage('accueil');
}

function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const inscriptionLink = document.getElementById('inscriptionLink');
    const interactionsLink = document.getElementById('interactionsLink');
    const accountLink = document.getElementById('accountLink');
    const adminLink = document.getElementById('adminLink');
    const logoutLink = document.getElementById('logoutLink');
    const newInteractionForm = document.getElementById('newInteractionForm');
    const heroActionButton = document.getElementById('heroActionButton');

    if (authToken && currentUser) {
        loginLink.style.display = 'none';
        inscriptionLink.style.display = 'block';
        interactionsLink.style.display = 'block';
        accountLink.style.display = 'block';
        adminLink.style.display = isAdmin() ? 'block' : 'none';
        logoutLink.style.display = 'block';
        if (heroActionButton) {
            heroActionButton.textContent = 'S\'inscrire';
            heroActionButton.setAttribute('onclick', "showPage('inscription')");
        }
        if (newInteractionForm) {
            newInteractionForm.style.display = 'block';
        }
    } else {
        loginLink.style.display = 'block';
        inscriptionLink.style.display = 'block';
        interactionsLink.style.display = 'none';
        accountLink.style.display = 'none';
        adminLink.style.display = 'none';
        logoutLink.style.display = 'none';
        if (heroActionButton) {
            heroActionButton.textContent = 'Se connecter';
            heroActionButton.setAttribute('onclick', "showPage('connexion')");
        }
        if (newInteractionForm) {
            newInteractionForm.style.display = 'none';
        }
    }
}

function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Courses
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const courses = await response.json();

        const coursesList = document.getElementById('coursesList');
        coursesList.innerHTML = '';

        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <img src="${course.image || '/assets/default-course.jpg'}" alt="${course.title}">
                <div class="course-card-content">
                    <h3>${course.title}</h3>
                    <p class="teacher">👨‍🏫 ${course.teacher}</p>
                    <span class="level">${course.level}</span>
                    <p>${course.description}</p>
                    <p><strong>Contenu:</strong> ${course.content}</p>
                </div>
            `;
            coursesList.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Charger les données d'inscription en cache
function loadCachedRegistrationData() {
    const cachedData = localStorage.getItem('cachedRegistrationData');
    if (cachedData) {
        const data = JSON.parse(cachedData);
        
        // Préremplir les champs
        if (document.getElementById('firstName')) document.getElementById('firstName').value = data.firstName || '';
        if (document.getElementById('lastName')) document.getElementById('lastName').value = data.lastName || '';
        if (document.getElementById('birthDate')) document.getElementById('birthDate').value = data.birthDate || '';
        if (document.getElementById('classLevel')) {
            document.getElementById('classLevel').value = data.classLevel || '';
            toggleAttestationFields(); // Afficher les champs d'attestation appropriés
        }
        if (document.getElementById('parentName')) document.getElementById('parentName').value = data.parentName || '';
        if (document.getElementById('parentPhone')) document.getElementById('parentPhone').value = data.parentPhone || '';
        if (document.getElementById('mamanName')) document.getElementById('mamanName').value = data.mamanName || '';
        if (document.getElementById('mamanPhone')) document.getElementById('mamanPhone').value = data.mamanPhone || '';
    }
}

// Toggle Attestation Fields based on class selection
function toggleAttestationFields() {
    const classLevel = document.getElementById('classLevel').value;
    const attestationPrimaire = document.getElementById('attestationPrimaire');
    const attestationBEPC = document.getElementById('attestationBEPC');

    // Hide all attestation fields
    attestationPrimaire.style.display = 'none';
    attestationBEPC.style.display = 'none';

    // Clear files when hiding
    document.getElementById('attestationPrimaireFile').value = '';
    document.getElementById('attestationBEPCFile').value = '';

    // Show the appropriate field based on class
    if (classLevel === '6ème') {
        attestationPrimaire.style.display = 'block';
    } else if (classLevel === '2nd A' || classLevel === '2nd C') {
        attestationBEPC.style.display = 'block';
    }
}

// Registrations
async function submitRegistration(event) {
    event.preventDefault();

    if (!authToken) {
        // Sauvegarder les données en cache
        const registrationData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            birthDate: document.getElementById('birthDate').value,
            classLevel: document.getElementById('classLevel').value,
            parentName: document.getElementById('parentName').value,
            parentPhone: document.getElementById('parentPhone').value,
            mamanName: document.getElementById('mamanName').value,
            mamanPhone: document.getElementById('mamanPhone').value
        };
        localStorage.setItem('cachedRegistrationData', JSON.stringify(registrationData));
        showAlert('Veuillez créer un compte pour continuer votre inscription', 'info');
        showPage('creercompte');
        return;
    }

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const birthDate = document.getElementById('birthDate').value;
    const classLevel = document.getElementById('classLevel').value;
    const parentName = document.getElementById('parentName').value;
    const parentPhone = document.getElementById('parentPhone').value;
    const mamanName = document.getElementById('mamanName').value;
    const mamanPhone = document.getElementById('mamanPhone').value;
    const attestationPrimaireFile = document.getElementById('attestationPrimaireFile').files[0];
    const attestationBEPCFile = document.getElementById('attestationBEPCFile').files[0];

    // Vérifier les champs manquants
    const missingFields = [];
    if (!firstName) missingFields.push('Nom de l\'élève');
    if (!lastName) missingFields.push('Prénoms de l\'élève');
    if (!birthDate) missingFields.push('Date de naissance');
    if (!classLevel) missingFields.push('Classe');
    if (!parentName) missingFields.push('Nom du père');
    if (!parentPhone) missingFields.push('Téléphone du père');
    if (!mamanName) missingFields.push('Nom de la mère');
    if (!mamanPhone) missingFields.push('Téléphone de la mère');

    if (missingFields.length > 0) {
      showAlert(`Champs manquants: ${missingFields.join(', ')}`, 'error');
      return;
    }

    // Validation des fichiers si nécessaire
    if (classLevel === '6ème' && !attestationPrimaireFile) {
        showAlert('Veuillez joindre l\'attestation d\'études primaire', 'error');
        return;
    }
    if ((classLevel === '2nd A' || classLevel === '2nd C') && !attestationBEPCFile) {
        showAlert('Veuillez joindre l\'attestation BEPC', 'error');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('birthDate', birthDate);
        formData.append('class', classLevel);
        formData.append('parentName', parentName);
        formData.append('parentPhone', parentPhone);
        formData.append('mamanName', mamanName);
        formData.append('mamanPhone', mamanPhone);
        
        if (attestationPrimaireFile) {
            formData.append('attestationPrimaire', attestationPrimaireFile);
        }
        if (attestationBEPCFile) {
            formData.append('attestationBEPC', attestationBEPCFile);
        }

        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Inscription envoyée avec succès! Nous vous contacterons bientôt.', 'success');
            event.target.reset();
            // Nettoyer le cache après la soumission réussie
            localStorage.removeItem('cachedRegistrationData');
        } else {
            showAlert(data.error || 'Erreur lors de l\'envoi de l\'inscription', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de l\'envoi de l\'inscription', 'error');
    }
}

// Interactions
async function loadInteractions() {
    try {
        const response = await fetch(`${API_BASE_URL}/interactions`);
        const interactions = await response.json();

        const interactionsList = document.getElementById('interactionsList');
        interactionsList.innerHTML = '';

        if (interactions.length === 0) {
            interactionsList.innerHTML = '<p>Aucune interaction pour le moment</p>';
            return;
        }

        interactions.forEach(interaction => {
            const interactionEl = document.createElement('div');
            interactionEl.className = 'interaction-item';

            const category = document.createElement('span');
            category.className = 'interaction-category';
            category.textContent = interaction.category || 'general';

            let repliesHTML = '';
            if (interaction.replies && interaction.replies.length > 0) {
                repliesHTML = '<div class="interaction-replies">';
                interaction.replies.forEach(reply => {
                    repliesHTML += `
                        <div class="reply">
                            <div class="reply-author">${reply.author}:</div>
                            <div>${reply.message}</div>
                        </div>
                    `;
                });
                repliesHTML += '</div>';
            }

            interactionEl.innerHTML = `
                <h4>${interaction.title}</h4>
                <div class="interaction-meta">
                    par <strong>${interaction.author}</strong> - ${new Date(interaction.createdAt).toLocaleDateString('fr-FR')}
                </div>
                ${category.outerHTML}
                <p>${interaction.message}</p>
                ${repliesHTML}
                ${authToken ? `
                    <form onsubmit="replyToInteraction(event, ${interaction.id})">
                        <textarea placeholder="Votre réponse..." required></textarea>
                        <button type="submit" class="btn btn-primary">Répondre</button>
                    </form>
                ` : ''}
            `;

            interactionsList.appendChild(interactionEl);
        });
    } catch (error) {
        console.error('Error loading interactions:', error);
    }
}

async function postInteraction(event) {
    event.preventDefault();

    if (!authToken) {
        showAlert('Veuillez vous connecter d\'abord', 'error');
        return;
    }

    const title = document.getElementById('interactionTitle').value;
    const message = document.getElementById('interactionMessage').value;
    const category = document.getElementById('interactionCategory').value;

    try {
        const response = await fetch(`${API_BASE_URL}/interactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, message, category })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Message posté avec succès!', 'success');
            event.target.reset();
            loadInteractions();
        } else {
            showAlert(data.error || 'Erreur lors de la création du message', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de la création du message', 'error');
    }
}

async function replyToInteraction(event, interactionId) {
    event.preventDefault();

    if (!authToken) {
        showAlert('Veuillez vous connecter d\'abord', 'error');
        return;
    }

    const message = event.target.querySelector('textarea').value;

    try {
        const response = await fetch(`${API_BASE_URL}/interactions/${interactionId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Réponse postée avec succès!', 'success');
            loadInteractions();
        } else {
            showAlert(data.error || 'Erreur lors de la création de la réponse', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de la création de la réponse', 'error');
    }
}

// Account
function displayAccountInfo() {
    const accountInfo = document.getElementById('accountInfo');
    accountInfo.innerHTML = `
        <div class="account-info">
            <h3>Bienvenue, ${currentUser.fullName}!</h3>
            <p><strong>Nom d'utilisateur:</strong> ${currentUser.username}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Rôle:</strong> ${currentUser.role}</p>
        </div>
    `;
}

async function loadUserRegistrations() {
    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const registrations = await response.json();
        const listContainer = document.getElementById('userRegistrationsList');
        listContainer.innerHTML = '';

        if (registrations.length === 0) {
            listContainer.innerHTML = '<p>Aucune demande de place envoyée</p>';
            return;
        }

        registrations.forEach(reg => {
            const regEl = document.createElement('div');
            regEl.className = `submission-item ${reg.status}`;
            
            let statusClass = 'status-pending';
            let statusText = 'En attente';
            
            if (reg.status === 'accepted') {
                statusClass = 'status-accepted';
                statusText = 'Acceptée';
            } else if (reg.status === 'rejected') {
                statusClass = 'status-rejected';
                statusText = 'Refusée';
            }

            regEl.innerHTML = `
                <h5>Demande de place : ${reg.firstName} ${reg.lastName}</h5>
                <p><strong>Classe demandée :</strong> ${reg.class}</p>
                <p><strong>Date de demande :</strong> ${new Date(reg.registrationDate || Date.now()).toLocaleDateString('fr-FR')}</p>
                ${reg.decisionReason ? `<p><strong>Note de l'administration :</strong> ${reg.decisionReason}</p>` : ''}
                <span class="submission-status ${statusClass}">${statusText}</span>
                <div style="margin-top: 10px;">
                    ${reg.attestationPrimaire ? '<span class="badge">✓ Attestation Primaire jointe</span>' : ''}
                    ${reg.attestationBEPC ? '<span class="badge">✓ Attestation BEPC jointe</span>' : ''}
                </div>
            `;
            listContainer.appendChild(regEl);
        });
    } catch (error) {
        console.error('Error loading user registrations:', error);
    }
}

async function loadSubmissions() {
    try {
        const response = await fetch(`${API_BASE_URL}/submissions`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const submissions = await response.json();
        const submissionsList = document.getElementById('submissionsList');
        submissionsList.innerHTML = '';

        if (submissions.length === 0) {
            submissionsList.innerHTML = '<p>Aucun dossier envoyé</p>';
            return;
        }

        submissions.forEach(submission => {
            const submissionEl = document.createElement('div');
            submissionEl.className = `submission-item ${submission.status}`;
            
            let statusClass = 'status-pending';
            let statusText = 'En attente';
            
            if (submission.status === 'accepted') {
                statusClass = 'status-accepted';
                statusText = 'Accepté';
            } else if (submission.status === 'rejected') {
                statusClass = 'status-rejected';
                statusText = 'Rejeté';
            }

            submissionEl.innerHTML = `
                <h5>${submission.fileName}</h5>
                <p><strong>Type:</strong> ${submission.documentType}</p>
                <p><strong>Description:</strong> ${submission.description || 'N/A'}</p>
                <p><strong>Date d'envoi:</strong> ${new Date(submission.submittedAt).toLocaleDateString('fr-FR')}</p>
                ${submission.decisionReason ? `<p><strong>Réponse de l'administration:</strong> ${submission.decisionReason}</p>` : ''}
                <span class="submission-status ${statusClass}">${statusText}</span>
                ${submission.storedFileName ? `<button type="button" class="btn btn-secondary" onclick="openSubmissionFile(${submission.id})">Ouvrir le fichier</button>` : ''}
            `;
            submissionsList.appendChild(submissionEl);
        });
    } catch (error) {
        console.error('Error loading submissions:', error);
    }
}

async function loadAdminDashboard() {
    await Promise.all([
        loadAdminSubmissions(),
        loadAdminRegistrations()
    ]);
}

async function loadAdminSubmissions() {
    const adminSubmissionsList = document.getElementById('adminSubmissionsList');
    const adminSubmissionsCount = document.getElementById('adminSubmissionsCount');

    try {
        const response = await fetch(`${API_BASE_URL}/submissions/admin`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const submissions = await response.json();

        if (!response.ok) {
            showAlert(submissions.error || 'Erreur lors du chargement des dossiers', 'error');
            return;
        }

        adminSubmissionsData = submissions;
        renderAdminSubmissions();
    } catch (error) {
        console.error('Error loading admin submissions:', error);
        showAlert('Erreur lors du chargement des dossiers', 'error');
    }
}

function renderAdminSubmissions() {
    const adminSubmissionsList = document.getElementById('adminSubmissionsList');
    const adminSubmissionsCount = document.getElementById('adminSubmissionsCount');
    const filteredSubmissions = filterByStatus(adminSubmissionsData, adminFilters.submissions);

    adminSubmissionsCount.textContent = filteredSubmissions.length;
    adminSubmissionsList.innerHTML = '';

    if (filteredSubmissions.length === 0) {
        adminSubmissionsList.innerHTML = '<p>Aucun dossier dans ce filtre</p>';
        return;
    }

    filteredSubmissions.forEach(submission => {
        const submissionEl = document.createElement('article');
        submissionEl.className = 'admin-item';
        submissionEl.innerHTML = `
            <div>
                <h4>${submission.fileName}</h4>
                <p><strong>Élève:</strong> ${submission.userEmail}</p>
                <p><strong>Type:</strong> ${submission.documentType}</p>
                <p><strong>Date:</strong> ${formatDate(submission.submittedAt)}</p>
                ${submission.decisionReason ? `<p><strong>Motif:</strong> ${submission.decisionReason}</p>` : ''}
            </div>
            <div class="admin-decision">
                <span class="submission-status status-${submission.status || 'pending'}">${formatStatus(submission.status)}</span>
                <button type="button" class="btn btn-secondary" onclick="openAdminDetail('submission', ${submission.id})">Consulter</button>
                ${submission.storedFileName ? `<button type="button" class="btn btn-secondary" onclick="openSubmissionFile(${submission.id})">Ouvrir le fichier</button>` : ''}
                ${renderDecisionControls('submission', submission.id, submission.status)}
            </div>
        `;
        adminSubmissionsList.appendChild(submissionEl);
    });
}

async function loadAdminRegistrations() {
    const adminRegistrationsCount = document.getElementById('adminRegistrationsCount');

    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const registrations = await response.json();

        if (!response.ok) {
            showAlert(registrations.error || 'Erreur lors du chargement des demandes', 'error');
            return;
        }

        adminRegistrationsData = registrations;
        renderAdminRegistrations();
    } catch (error) {
        console.error('Error loading admin registrations:', error);
        showAlert('Erreur lors du chargement des demandes', 'error');
    }
}

function renderAdminRegistrations() {
    const adminRegistrationsList = document.getElementById('adminRegistrationsList');
    const adminRegistrationsCount = document.getElementById('adminRegistrationsCount');
    const filteredRegistrations = filterByStatus(adminRegistrationsData, adminFilters.registrations);

    adminRegistrationsCount.textContent = filteredRegistrations.length;
    adminRegistrationsList.innerHTML = '';

    if (filteredRegistrations.length === 0) {
        adminRegistrationsList.innerHTML = '<p>Aucune demande dans ce filtre</p>';
        return;
    }

    filteredRegistrations.forEach(registration => {
        const registrationEl = document.createElement('article');
        registrationEl.className = 'admin-item';
        registrationEl.innerHTML = `
            <div>
                <h4>${registration.firstName} ${registration.lastName}</h4>
                <p><strong>Classe:</strong> ${registration.class}</p>
                <p><strong>Date:</strong> ${formatDate(registration.registrationDate)}</p>
                ${registration.decisionReason ? `<p><strong>Motif:</strong> ${registration.decisionReason}</p>` : ''}
            </div>
            <div class="admin-decision">
                <span class="submission-status status-${registration.status || 'pending'}">${formatStatus(registration.status)}</span>
                <button type="button" class="btn btn-secondary" onclick="openAdminDetail('registration', ${registration.id})">Consulter</button>
                ${renderDecisionControls('registration', registration.id, registration.status)}
            </div>
        `;
        adminRegistrationsList.appendChild(registrationEl);
    });
}

function filterByStatus(items, status) {
    if (status === 'all') {
        return items;
    }

    return items.filter(item => (item.status || 'pending') === status);
}

function setAdminFilter(group, status) {
    adminFilters[group] = status;
    updateFilterButtons(group, status);

    if (group === 'submissions') {
        renderAdminSubmissions();
    } else {
        renderAdminRegistrations();
    }
}

function updateFilterButtons(group, status) {
    document.querySelectorAll(`[data-filter-group="${group}"] .filter-btn`).forEach(button => {
        button.classList.toggle('active', button.getAttribute('onclick').includes(`'${status}'`));
    });
}

function openAdminDetail(type, id) {
    const modal = document.getElementById('adminDetailModal');
    const content = document.getElementById('adminDetailContent');
    const item = type === 'submission'
        ? adminSubmissionsData.find(submission => submission.id === id)
        : adminRegistrationsData.find(registration => registration.id === id);

    if (!item) {
        showAlert('Élément introuvable', 'error');
        return;
    }

    content.innerHTML = type === 'submission'
        ? renderSubmissionDetail(item)
        : renderRegistrationDetail(item);
    modal.style.display = 'flex';
}

function closeAdminDetail() {
    document.getElementById('adminDetailModal').style.display = 'none';
}

function renderSubmissionDetail(submission) {
    return `
        <h3>Dossier déposé</h3>
        <div class="detail-grid">
            <p><strong>Fichier:</strong> ${submission.fileName}</p>
            <p><strong>Élève:</strong> ${submission.userEmail}</p>
            <p><strong>Type:</strong> ${submission.documentType}</p>
            <p><strong>Description:</strong> ${submission.description || 'Aucune description'}</p>
            <p><strong>Taille:</strong> ${formatFileSize(submission.fileSize)}</p>
            <p><strong>Format:</strong> ${submission.mimeType || 'Non précisé'}</p>
            <p><strong>Date de dépôt:</strong> ${formatDate(submission.submittedAt)}</p>
            <p><strong>Statut:</strong> ${formatStatus(submission.status)}</p>
            <p><strong>Fichier ouvrable:</strong> ${submission.storedFileName ? `<button type="button" class="btn btn-secondary" onclick="openSubmissionFile(${submission.id})">Ouvrir le fichier</button>` : 'Non disponible'}</p>
            ${submission.decisionDate ? `<p><strong>Date de décision:</strong> ${formatDate(submission.decisionDate)}</p>` : ''}
            ${submission.decisionReason ? `<p><strong>Motif:</strong> ${submission.decisionReason}</p>` : ''}
        </div>
    `;
}

function renderRegistrationDetail(registration) {
    return `
        <h3>Demande d'inscription</h3>
        <div class="detail-grid">
            <p><strong>Nom:</strong> ${registration.firstName} ${registration.lastName}</p>
            <p><strong>Classe:</strong> ${registration.class}</p>
            <p><strong>Email:</strong> ${registration.email}</p>
            <p><strong>Téléphone:</strong> ${registration.phone}</p>
            <p><strong>Tuteur:</strong> ${registration.parentName}</p>
            <p><strong>Téléphone du tuteur:</strong> ${registration.parentPhone}</p>
            <p><strong>Date de demande:</strong> ${formatDate(registration.registrationDate)}</p>
            <p><strong>Statut:</strong> ${formatStatus(registration.status)}</p>
            ${registration.decisionDate ? `<p><strong>Date de décision:</strong> ${formatDate(registration.decisionDate)}</p>` : ''}
            ${registration.decisionReason ? `<p><strong>Motif:</strong> ${registration.decisionReason}</p>` : ''}
        </div>
    `;
}

function formatDate(dateValue) {
    return dateValue ? new Date(dateValue).toLocaleDateString('fr-FR') : 'Non précisé';
}

function formatFileSize(size) {
    if (!size) {
        return 'Non précisée';
    }

    if (size < 1024) {
        return `${size} octets`;
    }

    return `${(size / 1024).toFixed(1)} Ko`;
}

/*
async function loadAdminSubmissions() {
    const adminSubmissionsList = document.getElementById('adminSubmissionsList');
    const adminSubmissionsCount = document.getElementById('adminSubmissionsCount');

    try {
        const response = await fetch(`${API_BASE_URL}/submissions/admin`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const submissions = await response.json();

        if (!response.ok) {
            showAlert(submissions.error || 'Erreur lors du chargement des dossiers', 'error');
            return;
        }

        adminSubmissionsCount.textContent = submissions.length;
        adminSubmissionsList.innerHTML = '';

        if (submissions.length === 0) {
            adminSubmissionsList.innerHTML = '<p>Aucun dossier déposé pour le moment</p>';
            return;
        }

        submissions.forEach(submission => {
            const submissionEl = document.createElement('article');
            submissionEl.className = 'admin-item';
            submissionEl.innerHTML = `
                <div>
                    <h4>${submission.fileName}</h4>
                    <p><strong>Élève:</strong> ${submission.userEmail}</p>
                    <p><strong>Type:</strong> ${submission.documentType}</p>
                    <p><strong>Description:</strong> ${submission.description || 'Aucune description'}</p>
                    <p><strong>Date:</strong> ${new Date(submission.submittedAt).toLocaleDateString('fr-FR')}</p>
                    ${submission.decisionReason ? `<p><strong>Motif:</strong> ${submission.decisionReason}</p>` : ''}
                </div>
                <div class="admin-decision">
                    <span class="submission-status status-${submission.status || 'pending'}">${formatStatus(submission.status)}</span>
                    ${renderDecisionControls('submission', submission.id, submission.status)}
                </div>
            `;
            adminSubmissionsList.appendChild(submissionEl);
        });
    } catch (error) {
        console.error('Error loading admin submissions:', error);
        showAlert('Erreur lors du chargement des dossiers', 'error');
    }
}

async function loadAdminRegistrations() {
    const adminRegistrationsList = document.getElementById('adminRegistrationsList');
    const adminRegistrationsCount = document.getElementById('adminRegistrationsCount');

    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const registrations = await response.json();

        if (!response.ok) {
            showAlert(registrations.error || 'Erreur lors du chargement des demandes', 'error');
            return;
        }

        adminRegistrationsCount.textContent = registrations.length;
        adminRegistrationsList.innerHTML = '';

        if (registrations.length === 0) {
            adminRegistrationsList.innerHTML = '<p>Aucune demande d\'inscription pour le moment</p>';
            return;
        }

        registrations.forEach(registration => {
            const registrationEl = document.createElement('article');
            registrationEl.className = 'admin-item';
            registrationEl.innerHTML = `
                <div>
                    <h4>${registration.firstName} ${registration.lastName}</h4>
                    <p><strong>Classe:</strong> ${registration.class}</p>
                    <p><strong>Email:</strong> ${registration.email}</p>
                    <p><strong>Téléphone:</strong> ${registration.phone}</p>
                    <p><strong>Tuteur:</strong> ${registration.parentName} - ${registration.parentPhone}</p>
                    <p><strong>Date:</strong> ${new Date(registration.registrationDate).toLocaleDateString('fr-FR')}</p>
                    ${registration.decisionReason ? `<p><strong>Motif:</strong> ${registration.decisionReason}</p>` : ''}
                </div>
                <div class="admin-decision">
                    <span class="submission-status status-${registration.status || 'pending'}">${formatStatus(registration.status)}</span>
                    ${renderDecisionControls('registration', registration.id, registration.status)}
                </div>
            `;
            adminRegistrationsList.appendChild(registrationEl);
        });
    } catch (error) {
        console.error('Error loading admin registrations:', error);
        showAlert('Erreur lors du chargement des demandes', 'error');
    }
}
*/

function formatStatus(status) {
    if (status === 'accepted') {
        return 'Accepté';
    }

    if (status === 'rejected') {
        return 'Rejeté';
    }

    return 'En attente';
}

function renderDecisionControls(type, id, status) {
    if (status !== 'pending') {
        return '';
    }

    const reasonId = `${type}Reason${id}`;

    return `
        <div class="decision-controls">
            <textarea id="${reasonId}" placeholder="Raison ou remarque"></textarea>
            <div class="decision-buttons">
                <button type="button" class="btn btn-success" onclick="updateDecision('${type}', ${id}, 'accepted')">Accepter</button>
                <button type="button" class="btn btn-danger" onclick="updateDecision('${type}', ${id}, 'rejected')">Refuser</button>
            </div>
        </div>
    `;
}

async function updateDecision(type, id, status) {
    const reasonInput = document.getElementById(`${type}Reason${id}`);
    const reason = reasonInput ? reasonInput.value.trim() : '';
    const endpoint = type === 'registration' ? 'registrations' : 'submissions';

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status, reason })
        });
        const data = await response.json();

        if (response.ok) {
            showAlert(data.message, 'success');
            loadAdminDashboard();
        } else {
            showAlert(data.error || 'Erreur lors de la décision', 'error');
        }
    } catch (error) {
        console.error('Error updating decision:', error);
        showAlert('Erreur lors de la décision', 'error');
    }
}

async function submitDocument(event) {
    event.preventDefault();

    if (!authToken) {
        showAlert('Veuillez vous connecter d\'abord', 'error');
        return;
    }

    const docType = document.getElementById('docType').value;
    const docDescription = document.getElementById('docDescription').value;
    const docFile = document.getElementById('docFile').files[0];

    if (!docFile) {
        showAlert('Veuillez sélectionner un fichier', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('description', docDescription);
    formData.append('document', docFile);

    try {
        const response = await fetch(`${API_BASE_URL}/submissions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Dossier envoyé avec succès!', 'success');
            event.target.reset();
            loadSubmissions();
        } else {
            showAlert(data.error || 'Erreur lors de l\'envoi du dossier', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de l\'envoi du dossier', 'error');
    }
}

async function openSubmissionFile(submissionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}/file`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            showAlert(data.error || 'Impossible d\'ouvrir le fichier', 'error');
            return;
        }

        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
    } catch (error) {
        console.error('Error opening submission file:', error);
        showAlert('Impossible d\'ouvrir le fichier', 'error');
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
