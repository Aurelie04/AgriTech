# Arimma Agriculture Platform

A comprehensive agricultural technology platform built with Next.js, TypeScript, and Tailwind CSS, featuring multi-role authentication and MySQL database integration.

## Features

- **Multi-Role Authentication**: Support for Farmers, Buyers, Traders, Financiers, and Logistics providers
- **Role-Based Dashboards**: Customized interfaces for each user type
- **Profile Management**: Comprehensive profile setup with role-specific fields
- **Modern UI**: Built with Tailwind CSS for responsive design
- **Database Integration**: MySQL database with comprehensive schema
- **JWT Authentication**: Secure token-based authentication

## User Roles

### 1. Farmer
- Farm management and crop tracking
- Product listing and marketplace access
- Farm analytics and reporting

### 2. Buyer
- Product catalog browsing
- Order management
- Supplier connections

### 3. Trader
- Market price tracking
- Trading platform access
- Market analytics

### 4. Financier
- Loan application processing
- Portfolio management
- Risk assessment tools

### 5. Logistics
- Fleet management
- Delivery order handling
- Storage facility management

## Database Schema

The application uses MySQL with the following main tables:

- `users`: User authentication and basic info
- `user_profiles`: Detailed profile information with role-specific fields
- `email_verification_tokens`: Email verification system
- `password_reset_tokens`: Password reset functionality
- `user_sessions`: JWT token management

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 2. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE arimma_db;
```

2. Import the database schema:
```bash
mysql -u root -p arimma_db < database/schema.sql
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=arimma_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Project Structure

```
arimma-agriculture/
├── src/
│   ├── app/
│   │   ├── api/auth/          # Authentication API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── LoginForm.tsx     # Login form component
│   │   └── RegisterForm.tsx  # Registration form component
│   └── contexts/
│       └── AuthContext.tsx   # Authentication context
├── lib/
│   ├── auth.ts              # Authentication utilities
│   └── database.ts          # Database connection
├── database/
│   └── schema.sql           # Database schema
└── config/
    └── database.config.ts   # Database configuration
```

## Sample Users

The database includes sample users for testing:

- **Farmer**: farmer@arimma.com
- **Buyer**: buyer@arimma.com  
- **Trader**: trader@arimma.com
- **Financier**: financier@arimma.com
- **Logistics**: logistics@arimma.com

*Note: These are sample accounts with placeholder passwords. Update them in production.*

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Connection Testing

The application includes database connection testing. Check the console for connection status messages.

## Security Considerations

1. **Change JWT Secret**: Update the JWT secret in production
2. **Database Security**: Use strong passwords and proper MySQL security settings
3. **Environment Variables**: Never commit `.env.local` to version control
4. **HTTPS**: Use HTTPS in production
5. **Input Validation**: All inputs are validated on both client and server side

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.