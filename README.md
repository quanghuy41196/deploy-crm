# VileadCRM - Hướng dẫn Triển khai

## Yêu cầu hệ thống
- Node.js phiên bản 16.x trở lên
- NPM hoặc Yarn
- PostgreSQL hoặc MySQL (tùy theo database đang sử dụng)

## Các bước triển khai

### 1. Chuẩn bị môi trường

1.1. Tạo file môi trường:
```bash
cp .env.example .env
```

1.2. Cập nhật các biến môi trường trong file `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Other configurations
API_URL=https://your-api-domain.com
CLIENT_URL=https://your-client-domain.com
```

### 2. Build ứng dụng

2.1. Cài đặt dependencies:
```bash
# Backend
cd server
npm install --production

# Frontend
cd client
npm install --production
```

2.2. Build frontend:
```bash
cd client
npm run build
```

### 3. Triển khai lên server

#### 3.1. Sử dụng PM2 (Khuyến nghị)

Cài đặt PM2:
```bash
npm install -g pm2
```

Tạo file `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'vilead-crm-api',
      script: './server/dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

Khởi động ứng dụng:
```bash
pm2 start ecosystem.config.js
```

#### 3.2. Sử dụng Docker (Tùy chọn)

1. Build Docker image:
```bash
docker build -t vilead-crm .
```

2. Chạy container:
```bash
docker run -d -p 3000:3000 --name vilead-crm vilead-crm
```

### 4. Cấu hình Nginx (Web Server)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
        expires 30d;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL/HTTPS (Khuyến nghị)

Sử dụng Let's Encrypt để cài đặt SSL miễn phí:

```bash
sudo certbot --nginx -d your-domain.com
```

### 6. Monitoring và Maintenance

- Sử dụng PM2 để monitoring:
```bash
pm2 monit
```

- Kiểm tra logs:
```bash
pm2 logs
```

- Restart ứng dụng:
```bash
pm2 restart all
```

## Các lưu ý quan trọng

1. Bảo mật:
   - Luôn sử dụng HTTPS
   - Cấu hình tường lửa
   - Thường xuyên cập nhật các dependencies
   - Backup dữ liệu định kỳ

2. Performance:
   - Enable Gzip compression
   - Sử dụng CDN cho static assets
   - Cấu hình caching phù hợp

3. Monitoring:
   - Theo dõi CPU/Memory usage
   - Monitor response time
   - Cấu hình alerts khi có sự cố

## Support

Nếu bạn gặp vấn đề trong quá trình triển khai, vui lòng tạo issue trên repository hoặc liên hệ team support. 