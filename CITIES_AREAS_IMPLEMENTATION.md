# Cities and Areas Implementation Guide

## Overview
This implementation provides a comprehensive solution for managing Egyptian cities and areas data in the PharmaEgy platform. It includes database schema updates, seed data, API endpoints, and Postman collection updates.

## Files Created/Modified

### 1. Data File
- **`data/egypt-cities-areas.json`**: Comprehensive JSON file containing all 27 Egyptian governorates with their respective areas (450+ areas total)

### 2. Database Schema Updates
- **`prisma/schema.prisma`**: Added `City` and `Area` models with proper relationships
  ```prisma
  model City {
    id        String   @id
    name      String
    nameAr    String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    areas     Area[]
  }

  model Area {
    id        String   @id @default(cuid())
    name      String
    cityId    String
    city      City     @relation(fields: [cityId], references: [id], onDelete: Cascade)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@unique([name, cityId])
  }
  ```

### 3. Seed Files
- **`prisma/cities-seed.js`**: Dedicated seed file for cities and areas data
- **`prisma/seed.js`**: Updated main seed file to include cities seeding

### 4. API Endpoints
- **`src/app/api/v1/locations/cities/route.ts`**: Main endpoint for retrieving all cities with areas
- **`src/app/api/v1/locations/cities/[cityId]/areas/route.ts`**: Endpoint for retrieving areas by specific city

### 5. Postman Collection
- **`APIv1.postman_collection.json`**: Added "Locations" folder with two new endpoints

## API Endpoints

### 1. Get All Cities with Areas
```
GET /api/v1/locations/cities
```
**Response:**
```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "id": "cairo",
        "name": "Cairo",
        "nameAr": "القاهرة",
        "areas": [
          {
            "id": "area_id_1",
            "name": "Nasr City"
          }
        ]
      }
    ],
    "totalCities": 27,
    "totalAreas": 450
  },
  "message": "Cities and areas retrieved successfully"
}
```

### 2. Get Areas by City
```
GET /api/v1/locations/cities/{cityId}/areas
```
**Response:**
```json
{
  "success": true,
  "data": {
    "city": {
      "id": "cairo",
      "name": "Cairo",
      "nameAr": "القاهرة"
    },
    "areas": [
      {
        "id": "area_id_1",
        "name": "Nasr City"
      }
    ],
    "totalAreas": 25
  },
  "message": "Areas for Cairo retrieved successfully"
}
```

## Next Steps

### 1. Database Migration
Run the following commands to apply the schema changes:
```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_city_area_models

# Seed the database with cities and areas
npm run prisma:seed
```

### 2. Environment Setup
Ensure your `.env` file has the correct `DATABASE_URL` configuration for PostgreSQL.

### 3. Testing
1. Start the development server: `npm run dev`
2. Test the endpoints using the updated Postman collection
3. Verify data consistency between frontend and backend

## Frontend Integration

### Usage Example
```typescript
// Fetch all cities for dropdown
const response = await fetch('/api/v1/locations/cities');
const { data } = await response.json();
const cities = data.cities;

// Fetch areas for specific city
const cityId = 'cairo';
const areasResponse = await fetch(`/api/v1/locations/cities/${cityId}/areas`);
const { data: areasData } = await areasResponse.json();
const areas = areasData.areas;
```

### Dropdown Component Example
```tsx
const CityAreaSelector = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    // Load cities on component mount
    fetch('/api/v1/locations/cities')
      .then(res => res.json())
      .then(data => setCities(data.data.cities));
  }, []);

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    const city = cities.find(c => c.id === cityId);
    setAreas(city?.areas || []);
  };

  return (
    <div>
      <select onChange={(e) => handleCityChange(e.target.value)}>
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city.id} value={city.id}>
            {city.name} - {city.nameAr}
          </option>
        ))}
      </select>
      
      {selectedCity && (
        <select>
          <option value="">Select Area</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
```

## Benefits

1. **Data Consistency**: Centralized source of truth for Egyptian cities and areas
2. **Frontend Ready**: API designed specifically for dropdown menus
3. **Scalable**: Easy to add new cities/areas or modify existing ones
4. **Multilingual**: Supports both English and Arabic city names
5. **Performance**: Optimized queries with proper indexing
6. **Documentation**: Complete Postman collection for testing

## Data Coverage

The implementation includes all 27 Egyptian governorates:
- Cairo (القاهرة) - 25 areas
- Giza (الجيزة) - 19 areas
- Alexandria (الإسكندرية) - 30 areas
- And 24 more governorates with their respective areas

Total: **450+ areas** across **27 governorates**