import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated, login, type RequestWithAuth } from "./simpleAuth";
import multer from "multer";
import * as XLSX from "xlsx";
import { z } from "zod";

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define validation schemas
const leadSchema = z.object({
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  source: z.string(),
  region: z.string().nullable(),
  product: z.string().nullable(),
  content: z.string().nullable(),
  status: z.string().default("new"),
  tags: z.string().nullable(),
  assignedTo: z.string().nullable(),
  stage: z.string().default("reception"),
  value: z.number().nullable(),
  notes: z.string().nullable(),
});

type LeadInput = z.infer<typeof leadSchema>;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/login', login);

  const getUser: RequestHandler = async (req, res) => {
    try {
      const userId = (req as RequestWithAuth).user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  };
  app.get('/api/auth/user', isAuthenticated, getUser);

  // Lead routes
  const getLeads: RequestHandler = async (req, res) => {
    try {
      const filters = {
        source: req.query.source as string,
        region: req.query.region as string,
        status: req.query.status as string,
        assignedTo: req.query.assignedTo as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      
      const result = await storage.getLeads(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  };
  app.get('/api/leads', isAuthenticated, getLeads);

  const getLead: RequestHandler = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  };
  app.get('/api/leads/:id', isAuthenticated, getLead);

  const createLead: RequestHandler = async (req, res) => {
    try {
      const leadData = leadSchema.parse(req.body) as LeadInput;
      leadData.assignedTo = leadData.assignedTo || (req as RequestWithAuth).user.id;
      
      const now = new Date();
      const lead = await storage.createLead({
        ...leadData,
        id: 0, // SQLite will auto-increment this
        lastContactedAt: null,
        createdAt: now,
        updatedAt: now,
      });
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create lead" });
      }
    }
  };
  app.post('/api/leads', isAuthenticated, createLead);

  const updateLead: RequestHandler = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leadData = leadSchema.partial().parse(req.body) as Partial<LeadInput>;
      
      const lead = await storage.updateLead(id, {
        ...leadData,
        updatedAt: new Date(),
      });
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update lead" });
      }
    }
  };
  app.put('/api/leads/:id', isAuthenticated, updateLead);

  const deleteLead: RequestHandler = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLead(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  };
  app.delete('/api/leads/:id', isAuthenticated, deleteLead);

  const assignLeads: RequestHandler = async (req, res) => {
    try {
      const { leadIds, userId } = req.body;
      await storage.assignLeads(leadIds, userId);
      res.status(200).json({ message: "Leads assigned successfully" });
    } catch (error) {
      console.error("Error assigning leads:", error);
      res.status(500).json({ message: "Failed to assign leads" });
    }
  };
  app.post('/api/leads/assign', isAuthenticated, assignLeads);

  const updateLeadStage: RequestHandler = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { stage } = req.body;
      
      const lead = await storage.updateLeadStage(id, stage);
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead stage:", error);
      res.status(500).json({ message: "Failed to update lead stage" });
    }
  };
  app.put('/api/leads/:id/stage', isAuthenticated, updateLeadStage);

  // Lead import/export
  const importLeads: RequestHandler = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const leads = [];
      const errors = [];

      for (let i = 0; i < data.length; i++) {
        try {
          const row = data[i] as any;
          const leadData = {
            name: row['Tên'] || row['Name'] || '',
            phone: row['Số điện thoại'] || row['Phone'] || '',
            email: row['Email'] || '',
            source: 'manual',
            region: row['Khu vực'] || row['Region'] || '',
            product: row['Sản phẩm'] || row['Product'] || '',
            content: null,
            status: 'new',
            tags: null,
            notes: row['Ghi chú'] || row['Notes'] || '',
            assignedTo: (req as RequestWithAuth).user.id,
            stage: 'reception',
            value: null,
          };

          const validatedLead = leadSchema.parse(leadData) as LeadInput;
          const now = new Date();
          const createdLead = await storage.createLead({
            ...validatedLead,
            id: 0, // SQLite will auto-increment this
            lastContactedAt: null,
            createdAt: now,
            updatedAt: now,
          });
          leads.push(createdLead);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push({ row: i + 1, error: error.errors });
          } else {
            errors.push({ row: i + 1, error: "Failed to create lead" });
          }
        }
      }

      res.json({
        message: `Imported ${leads.length} leads successfully`,
        leads,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error("Error importing leads:", error);
      res.status(500).json({ message: "Failed to import leads" });
    }
  };
  app.post('/api/leads/import', isAuthenticated, upload.single('file'), importLeads);

  const server = createServer(app);
  return server;
}
