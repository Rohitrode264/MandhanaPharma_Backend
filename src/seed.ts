import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { User } from './models/User.model';
import { Tag } from './models/Tag.model';
import { Category } from './models/Category.model';
import { Product } from './models/Product.model';
import { UserRole, ProductType, ProductStatus, ProductScope } from './constants/enums';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // 1. Ensure we have an admin/editor user to link as creator
    let admin: any = await User.findOne({ role: { $in: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.EDITOR] } });
    if (!admin) {
      console.log('No admin user found. Creating a default editor user...');
      admin = await User.create({
        email: 'editor@mandanapharma.com',
        password: 'Password123!',
        role: UserRole.EDITOR,
      });
      console.log(`Created editor user: ${admin.email}`);
    } else {
      console.log(`Using existing user for ownership: ${admin.email}`);
    }

    const userId = admin._id;

    // 2. Insert Tags
    console.log('Creating tags...');
    await Tag.deleteMany({ slug: { $in: ['heart-care', 'infections', 'pain-management', 'best-seller', 'fda-approved'] } });
    
    const heartCareTag: any = await Tag.create({ name: 'Heart Care', slug: 'heart-care', group: 'Health Conditions', isActive: true });
    const infectionsTag: any = await Tag.create({ name: 'Infections', slug: 'infections', group: 'Health Conditions', isActive: true });
    const painManagementTag: any = await Tag.create({ name: 'Pain Management', slug: 'pain-management', group: 'Health Conditions', isActive: true });
    const bestSellerTag: any = await Tag.create({ name: 'Best Seller', slug: 'best-seller', group: 'Badges', isActive: true });
    const fdaApprovedTag: any = await Tag.create({ name: 'FDA Approved', slug: 'fda-approved', group: 'Badges', isActive: true });

    console.log('Tags created successfully!');

    // 3. Insert Parent Categories and Subcategories
    console.log('Creating categories...');
    await Category.deleteMany({ slug: { $in: ['prescription-medicines', 'cardiology', 'antibiotics', 'otc-wellness', 'pain-relief'] } });

    // Category: Prescription Medicines
    const parentPrescription: any = await Category.create({
      name: 'Prescription Medicines',
      slug: 'prescription-medicines',
      description: 'Medicines requiring a valid doctor prescription.',
      isActive: true,
    });

    // Category: Cardiology
    const catCardiology: any = await Category.create({
      name: 'Cardiology',
      slug: 'cardiology',
      description: 'Heart and cardiovascular system medications.',
      isActive: true,
    });

    const catAntibiotics: any = await Category.create({
      name: 'Antibiotics',
      slug: 'antibiotics',
      description: 'Bacterial infection treatments.',
      isActive: true,
    });

    // Category: OTC & Wellness
    const parentOTC: any = await Category.create({
      name: 'OTC & Wellness',
      slug: 'otc-wellness',
      description: 'Over-the-counter self-care and wellness products.',
      isActive: true,
    });

    // Category: Pain Relief
    const catPainRelief: any = await Category.create({
      name: 'Pain Relief',
      slug: 'pain-relief',
      description: 'Pain management medications.',
      isActive: true,
    });

    console.log('Categories created successfully!');

    // 4. Insert Products
    console.log('Creating products...');
    await Product.deleteMany({ slug: { $in: ['lipitor-10mg', 'amoxil-500mg', 'crocin-pain-relief'] } });

    // Product 1: Cardiology
    await Product.create({
      name: 'Lipitor 10mg',
      slug: 'lipitor-10mg',
      genericName: 'Atorvastatin',
      brandName: 'Pfizer',
      categories: [catCardiology._id],
      tags: [heartCareTag._id, bestSellerTag._id],
      productType: ProductType.TABLET,
      scope: ProductScope.DOMESTIC,
      strength: '10mg',
      dosageForm: 'Oral Tablet',
      composition: 'Atorvastatin Calcium 10mg',
      packaging: {
        size: '10 Tablets',
        type: 'Strip',
        unitCount: 10,
      },
      manufacturer: 'Pfizer India',
      countryOfOrigin: 'India',
      prescriptionRequired: true,
      pricing: {
        currency: 'INR',
        salePrice: 98,
        mrp: 120,
        unitLabel: 'Strip',
      },
      inventory: {
        isInStock: true,
        stockQty: 150,
      },
      images: [
        {
          url: 'https://placehold.co/600x400',
          alt: 'Lipitor 10mg Box',
          isPrimary: true,
        },
      ],
      status: ProductStatus.PUBLISHED,
      createdBy: userId,
      updatedBy: userId,
    });

    // Product 2: Antibiotics
    await Product.create({
      name: 'Amoxil 500mg',
      slug: 'amoxil-500mg',
      genericName: 'Amoxicillin',
      brandName: 'GSK',
      categories: [catAntibiotics._id],
      tags: [infectionsTag._id],
      productType: ProductType.CAPSULE,
      scope: ProductScope.BOTH,
      strength: '500mg',
      dosageForm: 'Capsule',
      composition: 'Amoxicillin Trihydrate 500mg',
      packaging: {
        size: '15 Capsules',
        type: 'Blister Pack',
        unitCount: 15,
      },
      manufacturer: 'GlaxoSmithKline',
      countryOfOrigin: 'India',
      prescriptionRequired: true,
      pricing: {
        currency: 'INR',
        salePrice: 72,
        mrp: 85,
        unitLabel: 'Pack',
      },
      inventory: {
        isInStock: true,
        stockQty: 200,
      },
      images: [
        {
          url: 'https://placehold.co/600x400',
          alt: 'Amoxil 500mg Capsules',
          isPrimary: true,
        },
      ],
      status: ProductStatus.PUBLISHED,
      createdBy: userId,
      updatedBy: userId,
    });

    // Product 3: Pain Relief
    await Product.create({
      name: 'Crocin Pain Relief',
      slug: 'crocin-pain-relief',
      genericName: 'Paracetamol & Caffeine',
      brandName: 'Haleon',
      categories: [catPainRelief._id],
      tags: [painManagementTag._id, bestSellerTag._id],
      productType: ProductType.TABLET,
      scope: ProductScope.INTERNATIONAL,
      strength: '650mg / 50mg',
      dosageForm: 'Oral Tablet',
      composition: 'Paracetamol 650mg, Caffeine 50mg',
      packaging: {
        size: '15 Tablets',
        type: 'Strip',
        unitCount: 15,
      },
      manufacturer: 'Haleon PLC',
      countryOfOrigin: 'India',
      prescriptionRequired: false,
      pricing: {
        currency: 'INR',
        salePrice: 35,
        mrp: 40,
        unitLabel: 'Strip',
      },
      inventory: {
        isInStock: true,
        stockQty: 500,
      },
      images: [
        {
          url: 'https://placehold.co/600x400',
          alt: 'Crocin Pain Relief Tablets',
          isPrimary: true,
        },
      ],
      status: ProductStatus.PUBLISHED,
      createdBy: userId,
      updatedBy: userId,
    });

    console.log('Products created successfully!');
    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
