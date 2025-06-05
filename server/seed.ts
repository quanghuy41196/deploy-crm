import { storage } from "./storage";
import { nanoid } from "nanoid";

async function seedData() {
  try {
    // Tạo users với các role khác nhau
    const users = [
      {
        id: "admin_1",
        email: "admin@vilead.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        profileImageUrl: "https://ui-avatars.com/api/?name=Admin+User"
      },
      {
        id: "leader_a",
        email: "leader.a@vilead.com",
        firstName: "Nguyễn Văn",
        lastName: "Anh",
        role: "leader",
        profileImageUrl: "https://ui-avatars.com/api/?name=Nguyen+Van+Anh"
      },
      {
        id: "sale_a1",
        email: "sale.a1@vilead.com",
        firstName: "Trần Thị",
        lastName: "Bình",
        role: "sale",
        profileImageUrl: "https://ui-avatars.com/api/?name=Tran+Thi+Binh"
      },
      {
        id: "sale_a2",
        email: "sale.a2@vilead.com",
        firstName: "Lê Văn",
        lastName: "Cường",
        role: "sale",
        profileImageUrl: "https://ui-avatars.com/api/?name=Le+Van+Cuong"
      },
      {
        id: "sale_a3",
        email: "sale.a3@vilead.com",
        firstName: "Phạm Thị",
        lastName: "Dung",
        role: "sale",
        profileImageUrl: "https://ui-avatars.com/api/?name=Pham+Thi+Dung"
      }
    ];

    // Tạo leads cho Nhóm A
    const leads = [
      {
        name: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyenvana@email.com",
        source: "facebook",
        region: "ha_noi",
        product: "Website",
        status: "new",
        stage: "reception",
        value: "15000000",
        notes: "Quan tâm thiết kế website bán hàng",
        assignedTo: "sale_a1"
      },
      {
        name: "Trần Thị B",
        phone: "0912345678",
        email: "tranthib@email.com",
        source: "zalo",
        region: "ho_chi_minh",
        product: "Marketing",
        status: "contacted",
        stage: "consulting",
        value: "8000000",
        notes: "Cần hỗ trợ quảng cáo Facebook",
        assignedTo: "sale_a2"
      },
      {
        name: "Lê Văn C",
        phone: "0923456789",
        email: "levanc@email.com",
        source: "google_ads",
        region: "da_nang",
        product: "Đào tạo",
        status: "potential",
        stage: "quoted",
        value: "25000000",
        notes: "Đào tạo nhân viên marketing",
        assignedTo: "sale_a3"
      },
      {
        name: "Phạm Thị D",
        phone: "0934567890",
        email: "phamthid@email.com",
        source: "manual",
        region: "ha_noi",
        product: "Website",
        status: "new",
        stage: "reception",
        value: "12000000",
        notes: "Startup cần website landing page",
        assignedTo: "sale_a1"
      },
      {
        name: "Hoàng Văn E",
        phone: "0945678901",
        email: "hoangvane@email.com",
        source: "facebook",
        region: "ho_chi_minh",
        product: "Marketing",
        status: "contacted",
        stage: "negotiating",
        value: "20000000",
        notes: "Chuỗi nhà hàng cần chiến dịch marketing",
        assignedTo: "sale_a2"
      }
    ];

    // Tạo customers cho Nhóm A
    const customers = [
      {
        name: "Công ty TNHH ABC",
        phone: "0281234567",
        email: "contact@abc.com",
        address: "123 Nguyễn Huệ, Q1, TP.HCM",
        type: "company",
        assignedTo: "sale_a1"
      },
      {
        name: "Công ty TNHH XYZ",
        phone: "0249876543",
        email: "info@xyz.com",
        address: "456 Trần Phú, Hà Nội",
        type: "company",
        assignedTo: "sale_a2"
      },
      {
        name: "Startup DEF",
        phone: "0267891234",
        email: "hello@def.com",
        address: "789 Lê Lợi, Đà Nẵng",
        type: "startup",
        assignedTo: "sale_a3"
      }
    ];

    // Tạo tasks cho Nhóm A
    const tasks = [
      {
        title: "Gọi điện cho khách hàng ABC",
        description: "Tư vấn về gói dịch vụ website",
        type: "call",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        priority: "high",
        status: "pending",
        assignedTo: "sale_a1",
        createdBy: "leader_a"
      },
      {
        title: "Chuẩn bị báo giá cho XYZ",
        description: "Báo giá gói marketing tổng thể",
        type: "quote",
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        priority: "medium",
        status: "pending",
        assignedTo: "sale_a2",
        createdBy: "leader_a"
      },
      {
        title: "Follow up lead Hoàng Văn E",
        description: "Thảo luận về chiến lược marketing cho chuỗi nhà hàng",
        type: "follow_up",
        dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
        priority: "high",
        status: "in_progress",
        assignedTo: "sale_a2",
        createdBy: "leader_a"
      },
      {
        title: "Demo sản phẩm cho Startup DEF",
        description: "Trình bày giải pháp website cho startup",
        type: "demo",
        dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        priority: "medium",
        status: "pending",
        assignedTo: "sale_a3",
        createdBy: "leader_a"
      }
    ];

    // Tạo products
    const products = [
      {
        name: "Website bán hàng",
        description: "Thiết kế website bán hàng chuyên nghiệp",
        price: "15000000",
        category: "website",
        status: "active"
      },
      {
        name: "Quảng cáo Facebook",
        description: "Dịch vụ quảng cáo Facebook Ads",
        price: "5000000",
        category: "marketing",
        status: "active"
      },
      {
        name: "Đào tạo Marketing",
        description: "Khóa học đào tạo marketing online",
        price: "25000000",
        category: "training",
        status: "active"
      },
      {
        name: "Landing Page",
        description: "Thiết kế trang đích chuyển đổi cao",
        price: "8000000",
        category: "website",
        status: "active"
      },
      {
        name: "SEO Tổng thể",
        description: "Dịch vụ SEO website lên TOP Google",
        price: "12000000",
        category: "marketing",
        status: "active"
      }
    ];

    // Tạo orders cho Nhóm A
    const orders = [
      {
        orderNumber: "ORD001",
        value: "15000000",
        status: "completed",
        customerId: 1,
        createdBy: "sale_a1",
        items: [
          {
            productId: 1,
            quantity: 1,
            price: "15000000"
          }
        ]
      },
      {
        orderNumber: "ORD002",
        value: "5000000",
        status: "pending",
        customerId: 2,
        createdBy: "sale_a2",
        items: [
          {
            productId: 2,
            quantity: 1,
            price: "5000000"
          }
        ]
      },
      {
        orderNumber: "ORD003",
        value: "8000000",
        status: "processing",
        customerId: 3,
        createdBy: "sale_a3",
        items: [
          {
            productId: 4,
            quantity: 1,
            price: "8000000"
          }
        ]
      }
    ];

    // Tạo automation rules
    const automationRules = [
      {
        name: "Tự động gán lead Nhóm A",
        description: "Gán lead mới cho nhân viên sales Nhóm A theo khu vực",
        trigger: "new_lead",
        conditions: {
          region: "ha_noi"
        },
        actions: {
          assignTo: "sale_a1"
        },
        createdBy: "leader_a"
      },
      {
        name: "Nhắc nhở follow up Nhóm A",
        description: "Tự động tạo task nhắc nhở follow up sau 3 ngày cho Nhóm A",
        trigger: "lead_created",
        conditions: {
          stage: "reception"
        },
        actions: {
          createTask: {
            title: "Follow up lead",
            dueDate: "3d"
          }
        },
        createdBy: "leader_a"
      }
    ];

    // Insert data
    for (const user of users) {
      await storage.upsertUser(user);
    }

    for (const lead of leads) {
      await storage.createLead(lead);
    }

    for (const customer of customers) {
      await storage.createCustomer(customer);
    }

    for (const task of tasks) {
      await storage.createTask(task);
    }

    for (const product of products) {
      await storage.createProduct(product);
    }

    for (const order of orders) {
      await storage.createOrder(order);
    }

    for (const rule of automationRules) {
      await storage.createAutomationRule(rule);
    }

    console.log("Seed data for Team A completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// Run seed
seedData();