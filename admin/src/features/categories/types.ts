export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null; // set when this is a sub-category
  _count?: { products: number };
};
