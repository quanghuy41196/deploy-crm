import { db } from "./db";

export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  region: string | null;
  product: string | null;
  content: string | null;
  status: string;
  tags: string | null;
  assignedTo: string | null;
  stage: string;
  value: number | null;
  notes: string | null;
  lastContactedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: User): Promise<User>;
  
  // Lead operations
  getLeads(filters?: {
    source?: string;
    region?: string;
    status?: string;
    assignedTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ leads: Lead[]; total: number }>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: Lead): Promise<Lead>;
  updateLead(id: number, lead: Partial<Lead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  assignLeads(leadIds: number[], userId: string): Promise<void>;
  updateLeadStage(id: number, stage: string): Promise<Lead>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return result as User | undefined;
  }

  async upsertUser(userData: User): Promise<User> {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, first_name, last_name, profile_image_url, role)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        profile_image_url = excluded.profile_image_url,
        role = excluded.role,
        updated_at = CURRENT_TIMESTAMP
    `);
    
    stmt.run(
      userData.id,
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.profileImageUrl,
      userData.role
    );
    
    return this.getUser(userData.id) as Promise<User>;
  }

  async getLeads(filters?: {
    source?: string;
    region?: string;
    status?: string;
    assignedTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ leads: Lead[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM leads WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM leads WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.source) {
      query += ' AND source = ?';
      countQuery += ' AND source = ?';
      params.push(filters.source);
    }
    if (filters?.region) {
      query += ' AND region = ?';
      countQuery += ' AND region = ?';
      params.push(filters.region);
    }
    if (filters?.status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters?.assignedTo) {
      query += ' AND assigned_to = ?';
      countQuery += ' AND assigned_to = ?';
      params.push(filters.assignedTo);
    }
    if (filters?.search) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      countQuery += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const leads = await db.prepare(query).all(...params) as Lead[];
    const [{ total }] = await db.prepare(countQuery).all(...params.slice(0, -2)) as [{ total: number }];

    return { leads, total };
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const result = await db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    return result as Lead | undefined;
  }

  async createLead(lead: Lead): Promise<Lead> {
    const stmt = db.prepare(`
      INSERT INTO leads (
        name, phone, email, source, region, product, content,
        status, tags, assigned_to, stage, value, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      lead.name,
      lead.phone,
      lead.email,
      lead.source,
      lead.region,
      lead.product,
      lead.content,
      lead.status,
      lead.tags,
      lead.assignedTo,
      lead.stage,
      lead.value,
      lead.notes
    );
    
    return this.getLead(result.lastInsertRowid as number) as Promise<Lead>;
  }

  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    const fields = Object.keys(lead).map(k => `${k} = ?`).join(', ');
    const values = Object.values(lead);
    
    const stmt = db.prepare(`
      UPDATE leads
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.getLead(id) as Promise<Lead>;
  }

  async deleteLead(id: number): Promise<void> {
    await db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  }

  async assignLeads(leadIds: number[], userId: string): Promise<void> {
    const stmt = db.prepare('UPDATE leads SET assigned_to = ? WHERE id = ?');
    for (const leadId of leadIds) {
      stmt.run(userId, leadId);
    }
  }

  async updateLeadStage(id: number, stage: string): Promise<Lead> {
    return this.updateLead(id, { stage });
  }
}

export const storage = new DatabaseStorage();
