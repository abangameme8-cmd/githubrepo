# SmartBite Frontend + ServeSoft Backend Integration Guide

## Overview

This integration combines the **SmartBite** React frontend with the **ServeSoft** PHP backend, creating a fully functional restaurant ordering and management system.

## Architecture

- **Frontend**: SmartBite React application (TypeScript + Vite + TailwindCSS)
- **Backend**: ServeSoft PHP API (MySQL database)
- **Authentication**: PHP session-based authentication
- **Communication**: RESTful API with CORS enabled

## Key Changes Made

### 1. API Integration Layer

Created `servesoft-api.js` that acts as an adapter between the React frontend and PHP backend:
- Translates SmartBite API calls to ServeSoft endpoints
- Handles session-based authentication (credentials included in requests)
- Maps data structures between frontend and backend formats

### 2. Role Mapping

Mapped SmartBite roles to ServeSoft roles:
- `customer` → `customer`
- `owner` → `manager` (restaurant manager)
- `agent` → `driver` (delivery agent)
- `admin` → `admin`

### 3. Context Updates

Updated all React Context providers to use ServeSoft API:
- **AuthContext**: Session-based authentication with role mapping
- **CartContext**: Syncs with ServeSoft cart system
- **RestaurantContext**: Fetches restaurants from ServeSoft database
- **MenuContext**: Manages menu items via ServeSoft API
- **OrderContext**: Handles order creation and status updates

### 4. CORS Configuration

Added CORS headers to all ServeSoft PHP API files:
- `api_auth.php`
- `api_customer.php`
- `api_manager.php`
- `api_driver.php`
- `api_admin.php`
- `bootstrap.php`

Headers configured:
```php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### 5. Environment Configuration

Updated `.env` file:
```
VITE_SERVESOFT_API_URL=http://localhost/github%20REpo/servesoft
```

## Setup Instructions

### Prerequisites

1. **PHP Development Environment**
   - PHP 7.4+ with MySQL support
   - Apache/Nginx web server
   - MySQL 5.7+ or MariaDB

2. **Node.js Environment**
   - Node.js 16+
   - npm or yarn

### Backend Setup (ServeSoft)

1. Place ServeSoft files in your web server directory:
   ```
   /path/to/webroot/github REpo/servesoft/
   ```

2. Configure database in `config.php`:
   ```php
   $servername = "localhost";
   $username = "root";
   $password = "";
   $database = "SERVESOFT";
   ```

3. Run the database seed:
   ```bash
   php seed_data.php
   ```

4. Ensure the web server is running and accessible at `http://localhost`

### Frontend Setup (SmartBite)

1. Navigate to SmartBite directory:
   ```bash
   cd "github REpo/smartbite"
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Update `.env` if your ServeSoft path differs:
   ```
   VITE_SERVESOFT_API_URL=http://localhost/your-path/servesoft
   ```

4. Start development server:
   ```bash
   npm run dev:client
   ```

5. Access the application at `http://localhost:5173`

## Testing the Integration

### 1. User Registration & Login

- Visit `http://localhost:5173/register`
- Create a new account (automatically assigned customer role)
- Login with credentials
- Session cookie will be stored for authentication

### 2. Customer Features

- Browse restaurants
- View menu items
- Add items to cart
- Place orders
- Track order status

### 3. Manager Features (Restaurant Owner)

- Admin must first assign manager role to a user
- Manage restaurant menu items
- View and update order statuses
- Manage reservations

### 4. Driver Features (Delivery Agent)

- Admin must assign driver role to a staff member
- View available deliveries
- Accept delivery jobs
- Update delivery status

### 5. Admin Features

- Manage users and roles
- Create and manage restaurants
- View system-wide statistics

## API Endpoints Used

### Authentication
- `POST /api_auth.php?action=login` - User login
- `POST /api_auth.php?action=register` - User registration
- `GET /api_auth.php?action=check` - Verify session
- `POST /api_auth.php?action=logout` - Logout

### Customer APIs
- `GET /api_customer.php?action=get_menu&restaurant_id={id}` - Get menu
- `GET /api_customer.php?action=get_cart` - Get cart
- `POST /api_customer.php` (action: add_to_cart, remove_from_cart, place_order)
- `GET /api_customer.php?action=get_orders` - Get customer orders

### Manager APIs
- `GET /api_manager.php?action=get_orders` - Get restaurant orders
- `POST /api_manager.php` (action: update_order_status, add_menu_item, etc.)
- `GET /api_manager.php?action=get_menu` - Get restaurant menu
- `GET /api_manager.php?action=get_tables` - Get restaurant tables

### Driver APIs
- `GET /api_driver.php?action=get_deliveries` - Get deliveries
- `POST /api_driver.php` (action: accept_delivery, update_delivery_milestone)

### Admin APIs
- `GET /api_admin.php?action=get_restaurants` - Get all restaurants
- `GET /api_admin.php?action=get_users` - Get all users
- `POST /api_admin.php` (action: create_restaurant, assign roles, etc.)

## Known Limitations

1. **Socket.IO Features**: Real-time features from SmartBite are disabled (order updates, live tracking)
2. **Payment Gateway**: CamPay integration is not connected (cash on delivery works)
3. **Image Uploads**: Uses placeholders instead of actual image uploads
4. **Reviews System**: Not fully integrated with ServeSoft database

## Troubleshooting

### CORS Issues
- Verify CORS headers in PHP files
- Check browser console for specific CORS errors
- Ensure credentials are being sent with requests

### Session Issues
- Check PHP session configuration
- Verify cookies are being stored (check browser dev tools)
- Ensure same-origin policy for sessions

### Database Connection
- Verify MySQL is running
- Check database credentials in `config.php`
- Ensure SERVESOFT database exists and is populated

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`
- Clear build cache: `rm -rf dist`
- Check for TypeScript errors: `npm run build`

## Next Steps

1. Set up SSL/HTTPS for production
2. Configure production CORS origins
3. Implement proper error logging
4. Add request rate limiting
5. Set up automated database backups
6. Configure production environment variables

## Support

For issues or questions:
1. Check the browser console for frontend errors
2. Check PHP error logs for backend issues
3. Verify database queries in MySQL
4. Test API endpoints directly using tools like Postman

## Success Indicators

The integration is working correctly when:
- ✅ Users can register and login
- ✅ Restaurants and menus are displayed
- ✅ Cart operations work (add, remove, update)
- ✅ Orders can be placed and tracked
- ✅ Different user roles see appropriate dashboards
- ✅ Build completes without errors
