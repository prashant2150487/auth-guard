# Create Product API Documentation

## Endpoint
```
POST /api/products
```

## Authentication
- **Required**: Yes
- **Type**: Bearer Token (JWT)
- **Permission Required**: `products.create`

## Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_jwt_token>"
}
```

## Request Body

### Required Fields
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `title` | String | Product title | Required, min 3 characters, cannot be empty |
| `description` | String | Product description | Required, min 10 characters, cannot be empty |

### Optional Fields
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `subtitle` | String | Short subtitle/summary | `null` |
| `permission` | String | Required permission to access | `null` |
| `image` | String | Image URL | `null` |
| `price` | Decimal | Product price | `null` |
| `isActive` | Boolean | Active status | `true` |

## Example Payloads

### Minimal Payload (Frontend Modal)
```json
{
  "title": "Guard Reporting Project",
  "description": "Comprehensive reporting system for guard management with real-time analytics and insights."
}
```

### Complete Payload (Frontend Modal with Permission)
```json
{
  "title": "Guard Reporting Project",
  "subtitle": "Real-time analytics dashboard",
  "description": "Comprehensive reporting system for guard management with real-time analytics and insights.",
  "permission": "reports.read"
}
```

### Full Payload (All Fields)
```json
{
  "title": "Guard Reporting Project",
  "subtitle": "Real-time analytics dashboard",
  "description": "Comprehensive reporting system for guard management with real-time analytics and insights.",
  "permission": "reports.read",
  "image": "https://example.com/images/reporting-dashboard.png",
  "price": 99.99,
  "isActive": true
}
```

## Success Response

### Status Code: `201 Created`

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "title": "Guard Reporting Project",
    "subtitle": "Real-time analytics dashboard",
    "description": "Comprehensive reporting system for guard management with real-time analytics and insights.",
    "image": null,
    "price": null,
    "isActive": true,
    "permission": "reports.read",
    "createdAt": "2025-12-02T07:04:38.000Z",
    "updatedAt": "2025-12-02T07:04:38.000Z"
  }
}
```

## Error Responses

### 400 Bad Request - Missing Title
```json
{
  "success": false,
  "message": "Title is required"
}
```

### 400 Bad Request - Missing Description
```json
{
  "success": false,
  "message": "Description is required"
}
```

### 400 Bad Request - Title Too Short
```json
{
  "success": false,
  "message": "Title must be at least 3 characters long"
}
```

### 400 Bad Request - Description Too Short
```json
{
  "success": false,
  "message": "Description must be at least 10 characters long"
}
```

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "image",
      "message": "Validation isUrl on image failed"
    }
  ]
}
```

### 401 Unauthorized - No Token
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "success": false,
  "message": "Access denied. Required permission: products.create"
}
```

### 409 Conflict - Duplicate Product
```json
{
  "success": false,
  "message": "A product with this information already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## cURL Examples

### Basic Request
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Guard Reporting Project",
    "description": "Comprehensive reporting system for guard management."
  }'
```

### Complete Request
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Guard Reporting Project",
    "subtitle": "Real-time analytics dashboard",
    "description": "Comprehensive reporting system for guard management with real-time analytics and insights.",
    "permission": "reports.read",
    "image": "https://example.com/images/reporting-dashboard.png",
    "price": 99.99,
    "isActive": true
  }'
```

## JavaScript/Fetch Example

```javascript
const createProduct = async (productData) => {
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }

    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Usage
const newProduct = {
  title: "Guard Reporting Project",
  subtitle: "Real-time analytics dashboard",
  description: "Comprehensive reporting system for guard management.",
  permission: "reports.read"
};

createProduct(newProduct)
  .then(result => console.log('Product created:', result))
  .catch(error => console.error('Error:', error));
```

## Axios Example

```javascript
import axios from 'axios';

const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/products',
      productData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server');
    } else {
      // Error setting up request
      throw new Error(error.message);
    }
  }
};

// Usage
const newProduct = {
  title: "Guard Reporting Project",
  subtitle: "Real-time analytics dashboard",
  description: "Comprehensive reporting system for guard management.",
  permission: "reports.read"
};

createProduct(newProduct)
  .then(result => console.log('Product created:', result))
  .catch(error => console.error('Error:', error));
```

## Notes

1. **Permission Field**: The `permission` field is stored in the response but not in the database. It's used by the frontend to control access to the product card.

2. **Trimming**: All string fields (`title`, `subtitle`, `description`) are automatically trimmed of leading/trailing whitespace.

3. **Validation**: The endpoint validates:
   - Required fields are present and not empty
   - Title is at least 3 characters
   - Description is at least 10 characters
   - Image URL is valid (if provided)

4. **Authentication**: All product routes require authentication via JWT token.

5. **Authorization**: The `products.create` permission is required to create products.

6. **Timestamps**: `createdAt` and `updatedAt` are automatically managed by Sequelize.
