export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  
  // Nguồn và phân loại
  source: string;
  region: string;
  product: string;
  content: string;
  
  // Trạng thái và quy trình
  status: string; // Mới, Đã liên hệ, Tiềm năng, Không quan tâm
  stage: string; // Tiếp nhận, Tư vấn, Báo giá, Đàm phán, Đóng deal
  assignedTo: string;
  
  // Giá trị và theo dõi
  value: number;
  notes: string;
  tags: string[];
  lastContact: string;
  createdAt: string;
  updatedAt: string;
} 