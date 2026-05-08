// API Base URL
const API_BASE_URL = '/api';

// Token storage
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    showPage('accueil');
    loadCourses();
    loadInteractions();
});

// Page Navigation
function showPage(pageId) {
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
            if (isAdmin()) {
                loadAdminDashboard();
            } else {
                showAlert('Accès réservé à l\'administrateur', 'error');
                showPage(authToken ? 'accueil' : 'connexion');
            }
        } else if (pageId === 'compte') {
            if (authToken) {
                displayAccountInfo();
                loadSubmissions();
            } else {
                showAlert('Veuillez vous connecter d\'abord', 'error');
                showPage('connexion');
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
            showPage('accueil');
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
    const accountLink = document.getElementById('accountLink');
    const adminLink = document.getElementById('adminLink');
    const logoutLink = document.getElementById('logoutLink');
    const newInteractionForm = document.getElementById('newInteractionForm');

    if (authToken && currentUser) {
        loginLink.style.display = 'none';
        accountLink.style.display = 'block';
        adminLink.style.display = isAdmin() ? 'block' : 'none';
        logoutLink.style.display = 'block';
        if (newInteractionForm) {
            newInteractionForm.style.display = 'block';
        }
    } else {
        loginLink.style.display = 'block';
        accountLink.style.display = 'none';
        adminLink.style.display = 'none';
        logoutLink.style.display = 'none';
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

// Registrations
async function submitRegistration(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('phone').value;
    const classLevel = document.getElementById('classLevel').value;
    const parentName = document.getElementById('parentName').value;
    const parentPhone = document.getElementById('parentPhone').value;

    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                class: classLevel,
                parentName,
                parentPhone
            })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Inscription envoyée avec succès! Nous vous contacterons bientôt.', 'success');
            event.target.reset();
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
            if (submission.userEmail === currentUser.email) {
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
                    <span class="submission-status ${statusClass}">${statusText}</span>
                `;
                submissionsList.appendChild(submissionEl);
            }
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
                </div>
                <span class="submission-status status-${submission.status || 'pending'}">${formatStatus(submission.status)}</span>
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
                </div>
                <span class="submission-status status-${registration.status || 'pending'}">${formatStatus(registration.status)}</span>
            `;
            adminRegistrationsList.appendChild(registrationEl);
        });
    } catch (error) {
        console.error('Error loading admin registrations:', error);
        showAlert('Erreur lors du chargement des demandes', 'error');
    }
}

function formatStatus(status) {
    if (status === 'accepted') {
        return 'Accepté';
    }

    if (status === 'rejected') {
        return 'Rejeté';
    }

    return 'En attente';
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

    try {
        const response = await fetch(`${API_BASE_URL}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                documentType: docType,
                description: docDescription,
                fileName: docFile.name,
                fileSize: docFile.size,
                mimeType: docFile.type
            })
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
