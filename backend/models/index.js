const sequelize = require('../config/db');
const User = require('./User');
const Shop = require('./Shop');
const Product = require('./Product');
const { Order, OrderItem } = require('./Order');

// Relations
User.hasOne(Shop, { foreignKey: 'owner_id' });
Shop.belongsTo(User, { foreignKey: 'owner_id' });

Shop.hasMany(Product, { foreignKey: 'shop_id' });
Product.belongsTo(Shop, { foreignKey: 'shop_id' });

User.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(User, { foreignKey: 'customer_id' });

Order.belongsTo(Shop, { foreignKey: 'shop_id' }); // To simplify, order is per shop

Order.belongsTo(User, { as: 'rider', foreignKey: 'rider_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  User,
  Shop,
  Product,
  Order,
  OrderItem
};
