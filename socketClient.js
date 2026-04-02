/**
 * Socket.io Client Manager
 * Handles real-time communication with backend
 * 
 * Usage:
 *   socketClient.connect()
 *   socketClient.on('application:new', (data) => { ... })
 *   socketClient.emit('application:submit', data)
 */

class SocketIOClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.notificationCallbacks = [];
    this.eventHandlers = new Map();
  }

  /**
   * Connect to Socket.io server
   */
  connect() {
    // Use the same host as the API
    const protocol = window.location.protocol.includes('https') ? 'https' : 'http';
    const hostname = window.location.hostname;
    const port = window.location.port;
    const socketUrl = `${protocol}//${hostname}${port ? ':' + port : ''}`;

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(socketUrl, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
          transports: ['websocket', 'polling']
        });

        // Connection established
        this.socket.on('connect', () => {
          console.log('[Socket] Connected:', this.socket.id);
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Emit connection event
          this.emit('connection:ready', {
            socketId: this.socket.id,
            timestamp: new Date()
          });

          resolve({
            success: true,
            socketId: this.socket.id
          });
        });

        // Authentication/user join
        this.socket.on('connection:confirmed', (data) => {
          console.log('[Socket] Authentication confirmed:', data);
          this._notifyListeners('connection:authenticated', data);
        });

        // Connection errors
        this.socket.on('error', (error) => {
          console.error('[Socket] Error:', error);
          this._notifyListeners('error', { error, message: error.toString() });
        });

        // Reconnection attempts
        this.socket.on('reconnect_attempt', () => {
          this.reconnectAttempts++;
          console.log(`[Socket] Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        });

        // Disconnection
        this.socket.on('disconnect', () => {
          console.log('[Socket] Disconnected');
          this.isConnected = false;
          this._notifyListeners('connection:disconnected', { timestamp: new Date() });
        });

        // Set up all event listeners
        this._setupEventListeners();

      } catch (error) {
        console.error('[Socket] Connection error:', error);
        reject({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Setup all Socket.io event listeners
   */
  _setupEventListeners() {
    // ═══ APPLICATION EVENTS ═══
    this.socket.on('application:new', (data) => {
      console.log('[Socket] New application:', data);
      this._notifyListeners('application:new', data);
    });

    this.socket.on('application:success', (data) => {
      console.log('[Socket] Application success:', data);
      this._notifyListeners('application:success', data);
      this._showNotification('✅ ' + data.message, 'success');
    });

    this.socket.on('application:statusChanged', (data) => {
      console.log('[Socket] Application status changed:', data);
      this._notifyListeners('application:statusChanged', data);
      this._showNotification(`${data.icon} ${data.message}`, 'info');
    });

    this.socket.on('application:statusUpdate', (data) => {
      console.log('[Socket] Status update (admin):', data);
      this._notifyListeners('application:statusUpdate', data);
    });

    this.socket.on('application:bulkStatusUpdate', (data) => {
      console.log('[Socket] Bulk status update:', data);
      this._notifyListeners('application:bulkStatusUpdate', data);
    });

    // ═══ INTERVIEW EVENTS ═══
    this.socket.on('interview:scheduled', (data) => {
      console.log('[Socket] Interview scheduled:', data);
      this._notifyListeners('interview:scheduled', data);
      this._showNotification(`${data.icon} ${data.message}`, 'info');
    });

    this.socket.on('interview:result', (data) => {
      console.log('[Socket] Interview result:', data);
      this._notifyListeners('interview:result', data);
      const msgType = data.result === 'pass' ? 'success' : 'warning';
      this._showNotification(`${data.icon} ${data.message}`, msgType);
    });

    // ═══ DASHBOARD EVENTS ═══
    this.socket.on('dashboard:ready', (data) => {
      console.log('[Socket] Dashboard ready:', data);
      this._notifyListeners('dashboard:ready', data);
    });

    this.socket.on('dashboard:update', (data) => {
      console.log('[Socket] Dashboard update:', data);
      this._notifyListeners('dashboard:update', data);
    });

    // ═══ PRESENCE EVENTS ═══
    this.socket.on('user:offline', (data) => {
      console.log('[Socket] User offline. Connected users:', data.totalConnected);
      this._notifyListeners('user:offline', data);
    });

    this.socket.on('application:viewingIndicator', (data) => {
      console.log('[Socket] Admin viewing:', data);
      this._notifyListeners('application:viewingIndicator', data);
    });

    // ═══ CUSTOM EVENT HANDLERS ═══
    // Allow registration of custom handlers
    for (const [event, handler] of this.eventHandlers.entries()) {
      this.socket.on(event, handler);
    }
  }

  /**
   * Authenticate/Join as a user
   * @param {string} userId - User ID
   * @param {string} role - User role (student/admin/recruiter)
   * @param {string} email - User email
   */
  joinUser(userId, role, email) {
    if (!this.isConnected) {
      console.warn('[Socket] Not connected yet');
      return;
    }

    this.emit('user:join', {
      userId,
      role,
      email
    });

    console.log(`[Socket] User joined as ${role}: ${email}`);
  }

  /**
   * Emit application submission
   * @param {object} applicationData
   */
  submitApplication(applicationData) {
    this.emit('application:submit', applicationData);
  }

  /**
   * Emit status update
   * @param {object} statusData
   */
  updateApplicationStatus(statusData) {
    this.emit('application:statusUpdate', statusData);
  }

  /**
   * Subscribe to dashboard updates
   * @param {string} role - User role
   * @param {string} userId - User ID
   */
  subscribeToDashboard(role, userId) {
    this.emit('dashboard:subscribe', { role, userId });
  }

  /**
   * Register a notification callback
   * @param {function} callback - Callback function
   */
  onNotification(callback) {
    this.notificationCallbacks.push(callback);
  }

  /**
   * Register custom event handler
   * @param {string} event - Event name
   * @param {function} handler - Event handler
   */
  on(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);
    }
    // Also store for future connections
    this.eventHandlers.set(event, handler);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} handler - Event handler
   */
  off(event, handler) {
    if (this.socket) {
      this.socket.off(event, handler);
    }
    this.eventHandlers.delete(event);
  }

  /**
   * Emit an event to server
   * @param {string} event - Event name
   * @param {object} data - Event data
   */
  emit(event, data) {
    if (!this.isConnected) {
      console.warn('[Socket] Not connected, queuing event:', event);
      return Promise.reject(new Error('Socket not connected'));
    }

    return new Promise((resolve, reject) => {
      this.socket.emit(event, data, (response) => {
        if (response && response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Show browser notification
   * @param {string} message - Notification message
   * @param {string} type - Type (success/warning/error/info)
   */
  _showNotification(message, type = 'info') {
    // Store in notifications array for dashboard display
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    // Call registered callbacks
    for (const callback of this.notificationCallbacks) {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    }

    // Browser notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
      const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
      const title = type.charAt(0).toUpperCase() + type.slice(1);
      new Notification(`${icon} ${title}`, {
        body: message,
        icon: '/favicon.ico',
        tag: 'placement-portal'
      });
    }

    return notification;
  }

  /**
   * Notify all registered listeners
   * @private
   */
  _notifyListeners(event, data) {
    for (const callback of this.notificationCallbacks) {
      try {
        callback({
          event,
          data,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error in listener:', error);
      }
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log('[Socket] Disconnected');
    }
  }

  /**
   * Check if connected
   */
  isSocketConnected() {
    return this.isConnected;
  }

  /**
   * Get socket ID
   */
  getSocketId() {
    return this.socket ? this.socket.id : null;
  }
}

// Create and export singleton instance
const socketClient = new SocketIOClient();

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
