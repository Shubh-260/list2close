// API Client for centralized HTTP requests
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Lead Management
  async getLeads(filters = {}) {
    const response = await this.client.get('/leads', { params: filters });
    return response.data;
  }

  async createLead(leadData) {
    const response = await this.client.post('/leads', leadData);
    return response.data;
  }

  async updateLead(leadId, updates) {
    const response = await this.client.put(`/leads/${leadId}`, updates);
    return response.data;
  }

  async qualifyLead(leadId) {
    const response = await this.client.post(`/leads/${leadId}/qualify`);
    return response.data;
  }

  // Property Management
  async getProperties(filters = {}) {
    const response = await this.client.get('/properties', { params: filters });
    return response.data;
  }

  async createProperty(propertyData) {
    const response = await this.client.post('/properties', propertyData);
    return response.data;
  }

  async updateProperty(propertyId, updates) {
    const response = await this.client.put(`/properties/${propertyId}`, updates);
    return response.data;
  }

  async syndicateProperty(propertyId, platforms) {
    const response = await this.client.post(`/properties/${propertyId}/syndicate`, { platforms });
    return response.data;
  }

  // Communications
  async getConversations(filters = {}) {
    const response = await this.client.get('/conversations', { params: filters });
    return response.data;
  }

  async sendMessage(conversationId, messageData) {
    const response = await this.client.post(`/conversations/${conversationId}/messages`, messageData);
    return response.data;
  }

  async createConversation(contactData) {
    const response = await this.client.post('/conversations', contactData);
    return response.data;
  }

  // Calendar & Appointments
  async getAppointments(filters = {}) {
    const response = await this.client.get('/appointments', { params: filters });
    return response.data;
  }

  async createAppointment(appointmentData) {
    const response = await this.client.post('/appointments', appointmentData);
    return response.data;
  }

  async updateAppointment(appointmentId, updates) {
    const response = await this.client.put(`/appointments/${appointmentId}`, updates);
    return response.data;
  }

  // Transactions
  async getTransactions(filters = {}) {
    const response = await this.client.get('/transactions', { params: filters });
    return response.data;
  }

  async createTransaction(transactionData) {
    const response = await this.client.post('/transactions', transactionData);
    return response.data;
  }

  async updateTransaction(transactionId, updates) {
    const response = await this.client.put(`/transactions/${transactionId}`, updates);
    return response.data;
  }

  // Offers
  async getOffers(filters = {}) {
    const response = await this.client.get('/offers', { params: filters });
    return response.data;
  }

  async createOffer(offerData) {
    const response = await this.client.post('/offers', offerData);
    return response.data;
  }

  async updateOffer(offerId, updates) {
    const response = await this.client.put(`/offers/${offerId}`, updates);
    return response.data;
  }

  // Analytics
  async getDashboardMetrics(dateRange = {}) {
    const response = await this.client.get('/analytics/dashboard', { params: dateRange });
    return response.data;
  }

  async getPropertyAnalytics(propertyId) {
    const response = await this.client.get(`/analytics/properties/${propertyId}`);
    return response.data;
  }

  // File uploads
  async uploadFile(file, type = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.client.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Webhooks
  async createWebhook(webhookData) {
    const response = await this.client.post('/webhooks', webhookData);
    return response.data;
  }

  async getWebhooks() {
    const response = await this.client.get('/webhooks');
    return response.data;
  }
}

export default new ApiClient();