const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const rawData = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading database:', error);
      return {
        users: [],
        courses: [],
        registrations: [],
        interactions: [],
        submissions: []
      };
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('Error saving database:', error);
      return false;
    }
  }

  // Users
  getUsers() {
    return this.data.users || [];
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email === email);
  }

  addUser(user) {
    const id = Math.max(...this.data.users.map(u => u.id), 0) + 1;
    const newUser = { ...user, id, createdAt: new Date().toISOString() };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Courses
  getCourses() {
    return this.data.courses || [];
  }

  getCourseById(id) {
    return this.data.courses.find(c => c.id === id);
  }

  // Registrations
  getRegistrations() {
    return this.data.registrations || [];
  }

  addRegistration(registration) {
    const id = Math.max(...this.data.registrations.map(r => r.id || 0), 0) + 1;
    const newRegistration = { 
      ...registration, 
      id, 
      registrationDate: new Date().toISOString(),
      status: 'pending'
    };
    this.data.registrations.push(newRegistration);
    this.save();
    return newRegistration;
  }

  updateRegistrationStatus(id, status, reason) {
    const registration = this.data.registrations.find(r => r.id === id);

    if (!registration) {
      return null;
    }

    registration.status = status;
    registration.decisionReason = reason || '';
    registration.decisionDate = new Date().toISOString();
    this.save();
    return registration;
  }

  // Interactions
  getInteractions() {
    return this.data.interactions || [];
  }

  addInteraction(interaction) {
    const id = Math.max(...this.data.interactions.map(i => i.id || 0), 0) + 1;
    const newInteraction = {
      ...interaction,
      id,
      createdAt: new Date().toISOString(),
      replies: []
    };
    this.data.interactions.push(newInteraction);
    this.save();
    return newInteraction;
  }

  replyToInteraction(interactionId, reply) {
    const interaction = this.data.interactions.find(i => i.id === interactionId);
    if (interaction) {
      reply.createdAt = new Date().toISOString();
      interaction.replies.push(reply);
      this.save();
      return reply;
    }
    return null;
  }

  // Submissions
  getSubmissions() {
    return this.data.submissions || [];
  }

  addSubmission(submission) {
    const id = Math.max(...this.data.submissions.map(s => s.id || 0), 0) + 1;
    const newSubmission = {
      ...submission,
      id,
      submittedAt: new Date().toISOString()
    };
    this.data.submissions.push(newSubmission);
    this.save();
    return newSubmission;
  }

  updateSubmissionStatus(id, status, reason) {
    const submission = this.data.submissions.find(s => s.id === id);

    if (!submission) {
      return null;
    }

    submission.status = status;
    submission.decisionReason = reason || '';
    submission.decisionDate = new Date().toISOString();
    this.save();
    return submission;
  }
}

module.exports = new Database();
