// Log a message with timestamp
function logMessage(level, message, extraData = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp: timestamp,
    level: level,
    message: message,
    ...extraData
  };

  console.log(`[${timestamp}] [${level}] ${message}`, extraData);
  saveLogToStorage(logEntry);
}

// Save log to localStorage
function saveLogToStorage(logEntry) {
  try {
    const existingLogs = localStorage.getItem('app_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }
    
    localStorage.setItem('app_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save log', error);
  }
}

// Log error message
export function logError(message, error) {
  const errorData = {
    error: error?.message,
    stack: error?.stack
  };
  logMessage('ERROR', message, errorData);
}

// Log warning message
export function logWarning(message, data) {
  logMessage('WARN', message, data);
}

// Log info message
export function logInfo(message, data) {
  logMessage('INFO', message, data);
}

// Get all logs
export function getAllLogs() {
  const logs = localStorage.getItem('app_logs');
  return logs ? JSON.parse(logs) : [];
}

// Clear all logs
export function clearAllLogs() {
  localStorage.removeItem('app_logs');
}
