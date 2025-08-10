import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// declare global { interface Window { MonacoEnvironment: any; } }

window.MonacoEnvironment = {
  getWorkerUrl: (_: string, label: string) => {
    const base = '/assets/monaco/vs';
    switch (label) {
      case 'json': return `${base}/language/json/json.worker.js`;
      case 'css': return `${base}/language/css/css.worker.js`;
      case 'scss': return `${base}/language/css/css.worker.js`;
      case 'less': return `${base}/language/css/css.worker.js`;
      case 'html': return `${base}/language/html/html.worker.js`;
      case 'handlebars': return `${base}/language/html/html.worker.js`;
      case 'razor': return `${base}/language/html/html.worker.js`;
      case 'typescript':
      case 'javascript': return `${base}/language/typescript/ts.worker.js`;
      default: return `${base}/editor/editor.worker.js`;
    }
  }
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
