// WebSocket service for real-time updates
class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    const token = localStorage.getItem('auth_token');
    
    try {
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.attemptReconnect();
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'NEW_LEAD':
        this.emit('newLead', payload);
        break;
      case 'LEAD_UPDATED':
        this.emit('leadUpdated', payload);
        break;
      case 'NEW_MESSAGE':
        this.emit('newMessage', payload);
        break;
      case 'APPOINTMENT_REMINDER':
        this.emit('appointmentReminder', payload);
        break;
      case 'TRANSACTION_UPDATE':
        this.emit('transactionUpdate', payload);
        break;
      case 'OFFER_UPDATE':
        this.emit('offerUpdate', payload);
        break;
      case 'PROPERTY_INQUIRY':
        this.emit('propertyInquiry', payload);
        break;
      case 'TASK_CREATED':
        this.emit('taskCreated', payload);
        break;
      case 'DEADLINE_APPROACHING':
        this.emit('deadlineApproaching', payload);
        break;
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  send(type, payload) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  // Subscription methods for different data types
  subscribeToLeads() {
    this.send('SUBSCRIBE', { type: 'leads' });
  }

  subscribeToConversations() {
    this.send('SUBSCRIBE', { type: 'conversations' });
  }

  subscribeToTransactions() {
    this.send('SUBSCRIBE', { type: 'transactions' });
  }

  subscribeToAppointments() {
    this.send('SUBSCRIBE', { type: 'appointments' });
  }

  subscribeToOffers() {
    this.send('SUBSCRIBE', { type: 'offers' });
  }
}

export default new WebSocketService();