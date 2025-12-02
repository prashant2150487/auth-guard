# Create Product - Quick Reference Guide

## 🎯 Overview
The `createProduct` endpoint has been optimized to work seamlessly with the frontend modal. It accepts product information and creates a new product in the database.

## 📋 What Changed

### Backend Controller Updates
✅ Added `permission` field to request body  
✅ Enhanced validation (title min 3 chars, description min 10 chars)  
✅ Better error handling with specific error types  
✅ Automatic string trimming for cleaner data  
✅ Sequelize validation error handling  
✅ Permission field included in response for frontend

### Frontend Modal Optimization
✅ Added `useCallback` for performance  
✅ Added `useEffect` for form reset  
✅ ESC key support to close modal  
✅ Backdrop click to close  
✅ Body scroll lock when modal open  
✅ Loading state with disabled inputs  
✅ ARIA attributes for accessibility  
✅ Fixed typo: "shaidow-xl" → "shadow-xl"

## 🚀 Quick Start

### 1. Frontend Usage (Already Implemented)
The modal in `/Guard-client/src/pages/docs/CreateProductModal.jsx` is ready to use:

```javascript
const handleSaveProduct = async ({ title, subtitle, description, permission }) => {
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        subtitle,
        description,
        permission
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return data;
  } catch (error) {
    throw error;
  }
};
```

### 2. Backend API (Updated)
Location: `/node-perms-guard/src/controllers/productController.js`

**Endpoint:** `POST /api/products`  
**Auth Required:** Yes (JWT Bearer Token)  
**Permission Required:** `products.create`

**Payload:**
```json
{
  "title": "Guard Reporting Project",
  "subtitle": "Real-time analytics dashboard",
  "description": "Comprehensive reporting system for guard management.",
  "permission": "reports.read"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "title": "Guard Reporting Project",
    "subtitle": "Real-time analytics dashboard",
    "description": "Comprehensive reporting system for guard management.",
    "permission": "reports.read",
    "isActive": true,
    "createdAt": "2025-12-02T07:04:38.000Z",
    "updatedAt": "2025-12-02T07:04:38.000Z"
  }
}
```

## 📁 Files Created

### 1. API Documentation
**File:** `docs/API_CREATE_PRODUCT.md`
- Complete API reference
- All request/response examples
- Error codes and messages
- cURL, Fetch, and Axios examples

### 2. Test Suite
**File:** `tests/createProduct.test.js`
- 9 comprehensive test cases
- Success and failure scenarios
- Run with: `node tests/createProduct.test.js`

### 3. Postman Collection
**File:** `docs/Guard_Products_API.postman_collection.json`
- Import into Postman
- All product endpoints
- Validation test cases
- Environment variables configured

## ✅ Validation Rules

| Field | Required | Min Length | Max Length | Type |
|-------|----------|------------|------------|------|
| title | ✅ Yes | 3 chars | - | String |
| description | ✅ Yes | 10 chars | - | String |
| subtitle | ❌ No | - | - | String |
| permission | ❌ No | - | - | String |
| image | ❌ No | - | - | URL |
| price | ❌ No | - | - | Decimal |
| isActive | ❌ No | - | - | Boolean |

## 🔒 Required Permissions

- **Create Product:** `products.create`
- **View Products:** `products.read`
- **Update Product:** `products.update`
- **Delete Product:** `products.delete`

## 🧪 Testing

### Option 1: Using the Test Suite
```bash
cd /home/lucentinnovation/Desktop/My\ project/guard/node-perms-guard
node tests/createProduct.test.js
```

### Option 2: Using Postman
1. Open Postman
2. Import `docs/Guard_Products_API.postman_collection.json`
3. Set `baseUrl` to `http://localhost:5000`
4. Run "Login" request to get token
5. Copy token to `authToken` variable
6. Test any endpoint

### Option 3: Using cURL
```bash
# Login first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'

# Copy the token and use it
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Product",
    "description": "This is a test product description."
  }'
```

## 🐛 Common Errors

### 400 - Title is required
```json
{
  "success": false,
  "message": "Title is required"
}
```
**Fix:** Provide a non-empty title

### 400 - Description is required
```json
{
  "success": false,
  "message": "Description is required"
}
```
**Fix:** Provide a non-empty description

### 400 - Title must be at least 3 characters long
```json
{
  "success": false,
  "message": "Title must be at least 3 characters long"
}
```
**Fix:** Use a title with 3+ characters

### 401 - Not authorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```
**Fix:** Include valid JWT token in Authorization header

### 403 - Access denied
```json
{
  "success": false,
  "message": "Access denied. Required permission: products.create"
}
```
**Fix:** User needs `products.create` permission

## 💡 Tips

1. **Auto-trimming:** All string fields are automatically trimmed
2. **Permission Field:** Not stored in DB, only returned in response for frontend use
3. **Default Values:** `isActive` defaults to `true` if not provided
4. **Null Values:** Optional fields default to `null` if not provided
5. **Timestamps:** `createdAt` and `updatedAt` are auto-managed

## 🔗 Related Files

- **Controller:** `node-perms-guard/src/controllers/productController.js`
- **Routes:** `node-perms-guard/src/routes/productRoutes.js`
- **Model:** `node-perms-guard/src/models/productModel.js`
- **Frontend Modal:** `Guard-client/src/pages/docs/CreateProductModal.jsx`
- **Frontend Page:** `Guard-client/src/pages/docs/index.jsx`

## 📞 Next Steps

1. ✅ Backend controller optimized
2. ✅ Frontend modal optimized
3. ✅ Documentation created
4. ✅ Tests created
5. ✅ Postman collection created

**Ready to integrate!** The frontend modal can now call the backend API to create products.

### Integration Example
Update `Guard-client/src/pages/docs/index.jsx`:

```javascript
const handleSaveProduct = async ({ title, subtitle, description, permission }) => {
  try {
    const token = localStorage.getItem('token'); // or from Redux
    
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        subtitle,
        description,
        permission
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    // Add to local state
    const newProject = {
      id: data.data.id,
      title: data.data.title,
      permission: data.data.permission,
      description: data.data.subtitle 
        ? `${data.data.subtitle} — ${data.data.description}`
        : data.data.description,
      link: `/docs/product/${data.data.id}`,
    };
    
    setCustomProjects((prev) => [...prev, newProject]);
    setShowCreateModal(false);
    
    // Optional: Show success message
    console.log('Product created successfully!', data);
    
  } catch (error) {
    console.error('Error creating product:', error);
    // Optional: Show error message to user
    alert(error.message);
  }
};
```

---

**Created:** 2025-12-02  
**Last Updated:** 2025-12-02  
**Version:** 1.0
