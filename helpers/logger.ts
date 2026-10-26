import { Marker } from './markers';

type Level = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private readonly lines: string[] = [];

  constructor(private readonly scope: string) {}

  private write(level: Level, marker: Marker | undefined, message: string) {
    const tag = marker ? ` [${marker}]` : '';
    const line = `${new Date().toISOString()} [${level}] [${this.scope}]${tag} ${message}`;
    this.lines.push(line);
    console.log(line);
  }

  info(message: string): void;
  info(marker: Marker, message: string): void;
  info(markerOrMessage: string, message?: string): void {
    this.dispatch('INFO', markerOrMessage, message);
  }

  warn(message: string): void;
  warn(marker: Marker, message: string): void;
  warn(markerOrMessage: string, message?: string): void {
    this.dispatch('WARN', markerOrMessage, message);
  }

  error(message: string): void;
  error(marker: Marker, message: string): void;
  error(markerOrMessage: string, message?: string): void {
    this.dispatch('ERROR', markerOrMessage, message);
  }

  debug(message: string): void;
  debug(marker: Marker, message: string): void;
  debug(markerOrMessage: string, message?: string): void {
    this.dispatch('DEBUG', markerOrMessage, message);
  }

  private dispatch(level: Level, markerOrMessage: string, message?: string) {
    if (message === undefined) {
      this.write(level, undefined, markerOrMessage);
    } else {
      this.write(level, markerOrMessage as Marker, message);
    }
  }

  dump(): string {
    return this.lines.join('\n');
  }
}