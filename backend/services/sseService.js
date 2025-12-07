class SSEService {
  constructor() {
    this.clients = new Map();
    this.channels = ['kitchen', 'bar', 'admin', 'waiter', 'all'];
  }

  /**
   * Add client to SSE connections
   */
  addClient(clientId, res, channel = 'all') {
    if (!this.channels.includes(channel) && channel !== 'all') {
      channel = 'all';
    }

    const client = {
      id: clientId,
      res,
      channel,
      connectedAt: new Date()
    };

    this.clients.set(clientId, client);
    console.log(`SSE Client connected: ${clientId} on channel: ${channel}`);
    console.log(`Total clients: ${this.clients.size}`);
  }

  /**
   * Remove client from SSE connections
   */
  removeClient(clientId) {
    const removed = this.clients.delete(clientId);
    if (removed) {
      console.log(`SSE Client disconnected: ${clientId}`);
      console.log(`Total clients: ${this.clients.size}`);
    }
  }

  /**
   * Send event to specific client
   */
  sendToClient(clientId, event, data) {
    const client = this.clients.get(clientId);
    if (client && client.res) {
      try {
        client.res.write(`event: ${event}\n`);
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error(`Error sending to client ${clientId}:`, error.message);
        this.removeClient(clientId);
      }
    }
  }

  /**
   * Broadcast event to channel
   */
  broadcast(channel, event, data) {
    let count = 0;
    
    this.clients.forEach((client, clientId) => {
      if (client.channel === channel || channel === 'all' || client.channel === 'all') {
        this.sendToClient(clientId, event, data);
        count++;
      }
    });

    console.log(`Broadcasted "${event}" to channel "${channel}" - ${count} clients`);
    return count;
  }

  /**
   * Publish event to appropriate channel(s)
   */
  publish(channel, eventType, payload) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      payload
    };

    return this.broadcast(channel, eventType, event);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const stats = {
      totalConnections: this.clients.size,
      byChannel: {}
    };

    this.channels.forEach(channel => {
      stats.byChannel[channel] = 0;
    });

    this.clients.forEach(client => {
      if (stats.byChannel[client.channel] !== undefined) {
        stats.byChannel[client.channel]++;
      }
    });

    return stats;
  }

  /**
   * Get all active clients
   */
  getClients() {
    const clients = [];
    this.clients.forEach((client, clientId) => {
      clients.push({
        id: clientId,
        channel: client.channel,
        connectedAt: client.connectedAt
      });
    });
    return clients;
  }

  /**
   * Send heartbeat to all clients to keep connections alive
   */
  sendHeartbeat() {
    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, 'heartbeat', { timestamp: new Date().toISOString() });
    });
  }
}

// Singleton instance
const sseService = new SSEService();

// Send heartbeat every 30 seconds
setInterval(() => {
  sseService.sendHeartbeat();
}, 30000);

module.exports = sseService;
