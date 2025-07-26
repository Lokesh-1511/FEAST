/**
 * Mock Data Storage
 * In-memory storage for development when Firebase is not configured
 */

class MockStorage {
  constructor() {
    this.vendors = new Map();
    this.prices = new Map();
    this.surplus = new Map();
    this.emergency = new Map();
  }

  // Mock collection methods
  collection(name) {
    return {
      doc: (id) => ({
        set: async (data) => {
          this[name].set(id, { ...data, id });
          return { id };
        },
        get: async () => ({
          exists: this[name].has(id),
          data: () => this[name].get(id)
        }),
        update: async (updates) => {
          if (this[name].has(id)) {
            const existing = this[name].get(id);
            this[name].set(id, { ...existing, ...updates });
          }
          return { id };
        },
        delete: async () => {
          this[name].delete(id);
          return { id };
        }
      }),
      where: (field, operator, value) => ({
        get: async () => ({
          forEach: (callback) => {
            Array.from(this[name].values())
              .filter(item => this.filterByWhere(item, field, operator, value))
              .forEach(item => callback({ data: () => item }));
          }
        }),
        orderBy: (field, direction) => ({
          get: async () => ({
            forEach: (callback) => {
              Array.from(this[name].values())
                .filter(item => this.filterByWhere(item, field, operator, value))
                .sort((a, b) => this.sortByField(a, b, field, direction))
                .forEach(item => callback({ data: () => item }));
            }
          }),
          limit: (count) => ({
            get: async () => ({
              forEach: (callback) => {
                Array.from(this[name].values())
                  .filter(item => this.filterByWhere(item, field, operator, value))
                  .sort((a, b) => this.sortByField(a, b, field, direction))
                  .slice(0, count)
                  .forEach(item => callback({ data: () => item }));
              }
            })
          })
        }),
        limit: (count) => ({
          get: async () => ({
            forEach: (callback) => {
              Array.from(this[name].values())
                .filter(item => this.filterByWhere(item, field, operator, value))
                .slice(0, count)
                .forEach(item => callback({ data: () => item }));
            }
          })
        })
      }),
      orderBy: (field, direction) => ({
        get: async () => ({
          forEach: (callback) => {
            Array.from(this[name].values())
              .sort((a, b) => this.sortByField(a, b, field, direction))
              .forEach(item => callback({ data: () => item }));
          }
        }),
        limit: (count) => ({
          get: async () => ({
            forEach: (callback) => {
              Array.from(this[name].values())
                .sort((a, b) => this.sortByField(a, b, field, direction))
                .slice(0, count)
                .forEach(item => callback({ data: () => item }));
            }
          })
        })
      }),
      limit: (count) => ({
        get: async () => ({
          forEach: (callback) => {
            Array.from(this[name].values())
              .slice(0, count)
              .forEach(item => callback({ data: () => item }));
          }
        })
      }),
      get: async () => ({
        forEach: (callback) => {
          Array.from(this[name].values()).forEach(item => 
            callback({ data: () => item })
          );
        }
      })
    };
  }

  filterByWhere(item, field, operator, value) {
    if (!field || !operator) return true;
    
    const fieldValue = this.getNestedField(item, field);
    
    switch (operator) {
      case '==':
        return fieldValue === value;
      case '!=':
        return fieldValue !== value;
      case '>':
        return fieldValue > value;
      case '>=':
        return fieldValue >= value;
      case '<':
        return fieldValue < value;
      case '<=':
        return fieldValue <= value;
      case 'array-contains':
        return Array.isArray(fieldValue) && fieldValue.includes(value);
      default:
        return true;
    }
  }

  sortByField(a, b, field, direction = 'asc') {
    const aVal = this.getNestedField(a, field);
    const bVal = this.getNestedField(b, field);
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  }

  getNestedField(obj, field) {
    return field.split('.').reduce((o, key) => o && o[key], obj);
  }

  // Get all data for debugging
  getAllData() {
    return {
      vendors: Array.from(this.vendors.values()),
      prices: Array.from(this.prices.values()),
      surplus: Array.from(this.surplus.values()),
      emergency: Array.from(this.emergency.values())
    };
  }

  // Clear all data
  clearAllData() {
    this.vendors.clear();
    this.prices.clear();
    this.surplus.clear();
    this.emergency.clear();
  }

  // Add sample data for testing
  addSampleData() {
    // Sample vendor
    this.vendors.set('vendor-1', {
      id: 'vendor-1',
      name: 'Ram Kumar',
      shopName: 'Fresh Vegetables Store',
      location: {
        address: '123 Market Street',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      verified: true,
      createdAt: new Date().toISOString()
    });

    // Sample price
    this.prices.set('price-1', {
      id: 'price-1',
      vendorId: 'vendor-1',
      item: 'tomatoes',
      price: 25,
      unit: 'kg',
      verified: true,
      timestamp: new Date().toISOString()
    });

    console.log('📝 Sample data added to mock storage');
  }
}

module.exports = MockStorage;
