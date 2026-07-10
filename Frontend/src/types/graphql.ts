export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export type FotorImage = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  width: number | null;
  height: number | null;
  type: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type ImagePage = {
  data: FotorImage[];
  nextCursor: string | null;
};

export type GetImagesResponse = {
  images: ImagePage;
};

export type GetCategoriesResponse = {
  categories: Category[];
};
