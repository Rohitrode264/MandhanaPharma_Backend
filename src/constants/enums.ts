export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum CategoryScope {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
}

export enum ProductScope {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
  BOTH = 'both',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ProductType {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  INJECTION = 'injection',
  SYRUP = 'syrup',
  CREAM = 'cream',
  SOLUTION = 'solution',
  FOAM = 'foam',
  OINTMENT = 'ointment',
  DROPS = 'drops',
  SACHET = 'sachet',
  OTHER = 'other',
}
