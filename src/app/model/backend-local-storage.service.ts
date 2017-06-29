import { Injectable } from '@angular/core';
import {BackendServiceAPI} from './backend-service-api';
import {TranslationProject} from './translation-project';

@Injectable()
export class BackendLocalStorageService extends BackendServiceAPI {

  private PRAEFIX = 'tinytranslator.';
  private PRAEFIX_PROJECT = this.PRAEFIX + 'project.';
  private KEY_APIKEY = this.PRAEFIX + 'googletranslate.apikey';

  constructor() {
    super();
    if (!localStorage) {
      throw new Error('oops, local storage not supported');
    }
  }

  /**
   * Store a project.
   */
  store(project: TranslationProject) {
    if (!project.id) {
      project.id = BackendServiceAPI.generateUUID();
    }
    localStorage.setItem(this.keyForProject(project), project.serialize());
  }

  /**
   * Get all stored projects.
   */
  projects(): TranslationProject[] {
    const projectKeys = this.getProjectKeys();
    return projectKeys.map(key => {return TranslationProject.deserialize(localStorage.getItem(key))});
  }

  delete(project: TranslationProject) {
    if (project && project.id) {
      const key = this.keyForProject(project);
      localStorage.removeItem(key);
    }
  }

  /**
   * Save API Key in store.
   * @param key
   */
  storeAutoTranslateApiKey(key: string) {
    if (!key) {
      localStorage.removeItem(this.KEY_APIKEY);
    } else {
      localStorage.setItem(this.KEY_APIKEY, key);
    }
  }

  /**
   * Get API key from store.
   * @return {null}
   */
  autoTranslateApiKey(): string {
    return localStorage.getItem(this.KEY_APIKEY);
  }

  private keyForProject(project: TranslationProject) {
    return this.PRAEFIX_PROJECT + project.id;
  }

  private getProjectKeys(): string[] {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PRAEFIX_PROJECT)) {
        result.push(key);
      }
    }
    return result;
  }

}
