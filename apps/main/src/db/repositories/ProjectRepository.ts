// apps/main/src/db/repositories/ProjectRepository.ts
// Mirrors crm.py project CRUD functions exactly

import Database from 'better-sqlite3';
import { Project } from '../../../../packages/core/src/types/db';

export class ProjectRepository {
  constructor(private db: Database.Database) {}

  // Mirrors crm.py:save_project
  async saveProject(projectData: Project): Promise<number | null> {
    try {
      const now = new Date().toISOString();
      const sanitizedData = {
        ...projectData,
        last_updated: now,
        creation_date: projectData.creation_date || now,
      };

      if (sanitizedData.id) {
        // Update existing project
        const fields = Object.keys(sanitizedData).filter(k => k !== 'id');
        const setClause = fields.map(k => `${k} = ?`).join(', ');
        const values = fields.map(k => sanitizedData[k]);
        values.push(sanitizedData.id);

        const stmt = this.db.prepare(`UPDATE projects SET ${setClause} WHERE id = ?`);
        stmt.run(...values);
        return sanitizedData.id;
      } else {
        // Insert new project
        const fields = Object.keys(sanitizedData).filter(k => k !== 'id');
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(k => sanitizedData[k]);

        const stmt = this.db.prepare(`INSERT INTO projects (${fields.join(', ')}) VALUES (${placeholders})`);
        const result = stmt.run(...values);
        return result.lastInsertRowid as number;
      }
    } catch (error) {
      console.error('Error saving project:', error);
      return null;
    }
  }

  // Mirrors crm.py:load_project
  async loadProject(projectId: number): Promise<Project | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
      const row = stmt.get(projectId) as Project | undefined;
      return row || null;
    } catch (error) {
      console.error('Error loading project:', error);
      return null;
    }
  }

  // Mirrors crm.py:delete_project
  async deleteProject(projectId: number): Promise<boolean> {
    try {
      const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
      const result = stmt.run(projectId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // Mirrors crm.py:load_projects_for_customer
  async loadProjectsForCustomer(customerId: number): Promise<Project[]> {
    try {
      const stmt = this.db.prepare('SELECT * FROM projects WHERE customer_id = ?');
      return stmt.all(customerId) as Project[];
    } catch (error) {
      console.error('Error loading projects for customer:', error);
      return [];
    }
  }
}
