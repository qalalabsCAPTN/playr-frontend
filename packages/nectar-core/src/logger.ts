type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      ...(meta && { meta })
    };

    if (!this.isProduction) {
      console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, meta || '');
    } else {
      // In production, we'd pipe this to Sentry, DataDog, etc.
      // Sentry.captureMessage(message, { level, extra: meta });
      console[level](JSON.stringify(payload));
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  captureException(error: Error, meta?: any) {
    if (!this.isProduction) {
      console.error(error);
    } else {
      // Sentry.captureException(error, { extra: meta });
      console.error(JSON.stringify({
        level: 'error',
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        meta
      }));
    }
  }
}

export const logger = new Logger();
