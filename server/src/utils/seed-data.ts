import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from '../models/user.model';
import Category from '../models/category.model';
import Tag from '../models/tag.model';
import Product from '../models/product.model';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orchideya_dv';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Product.deleteMany({});

    console.log('Data cleared...');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created...');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Букеты', color: '#10b981' },
      { name: 'Розы', color: '#ef4444' },
      { name: 'Тюльпаны', color: '#f59e0b' },
      { name: 'Орхидеи', color: '#8b5cf6' },
      { name: 'Аксессуары', color: '#3b82f6' },
    ]);

    console.log('Categories created...');

    // Create tags
    const tags = await Tag.insertMany([
      { name: 'премиум' },
      { name: 'романтика' },
      { name: 'весна' },
      { name: 'яркие' },
      { name: 'нежность' },
      { name: 'классика' },
      { name: 'интерьер' },
      { name: 'минимализм' },
      { name: 'экзотика' },
      { name: 'роскошь' },
    ]);

    console.log('Tags created...');

    // Map category names to IDs
    const categoryMap: Record<string, any> = {};
    categories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    // Map tag names to IDs
    const tagMap: Record<string, any> = {};
    tags.forEach(tag => {
      tagMap[tag.name] = tag._id;
    });

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Романтический букет роз',
        description: 'Изысканная композиция из 25 красных роз премиум-класса с декоративной зеленью и элегантной упаковкой',
        price: 4500,
        category: categoryMap['Розы'],
        images: ['/uploads/luxury-red-roses-bouquet-elegant-wrapping.jpg', '/uploads/red-roses-close-up-premium-quality.jpg'],
        inStock: 12,
        featured: true,
        tags: [tagMap['премиум'], tagMap['романтика']],
      },
      {
        name: 'Весенние тюльпаны',
        description: 'Нежный букет из 51 разноцветного тюльпана в стильной упаковке',
        price: 3200,
        category: categoryMap['Тюльпаны'],
        images: ['/uploads/colorful-tulips-bouquet-spring-flowers.jpg', '/uploads/mixed-tulips-elegant-arrangement.jpg'],
        inStock: 8,
        featured: true,
        tags: [tagMap['весна'], tagMap['яркие']],
      },
      {
        name: 'Орхидея Фаленопсис',
        description: 'Элегантная белая орхидея в керамическом кашпо премиум-класса',
        price: 5800,
        category: categoryMap['Орхидеи'],
        images: ['/uploads/white-phalaenopsis-orchid-ceramic-pot-elegant.jpg', '/uploads/orchid-flowers-close-up-white-petals.jpg'],
        inStock: 5,
        featured: true,
        tags: [tagMap['премиум'], tagMap['интерьер']],
      },
      {
        name: 'Букет "Нежность"',
        description: 'Воздушная композиция из пионовидных роз, эустомы и гортензии в пастельных тонах',
        price: 6200,
        category: categoryMap['Букеты'],
        images: ['/uploads/pastel-flowers-bouquet-roses-eustoma-hydrangea.jpg', '/uploads/soft-pink-flowers-arrangement-elegant.jpg'],
        inStock: 6,
        featured: true,
        tags: [tagMap['нежность'], tagMap['премиум']],
      },
      {
        name: 'Монобукет белых роз',
        description: 'Классический букет из 15 белых роз с минималистичной упаковкой',
        price: 3800,
        category: categoryMap['Розы'],
        images: ['/uploads/white-roses-bouquet-minimalist-elegant.jpg', '/uploads/white-roses-close-up-premium-quality.jpg'],
        inStock: 15,
        tags: [tagMap['классика'], tagMap['минимализм']],
      },
    ]);

    console.log('Products created...');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
});
