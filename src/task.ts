import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export type BuildCategoriesTree = (
  getData: () => Promise<{
    data: Category[] | void;
  }>
) => Promise<CategoryListElement[]>;

const getItemOrder = (title?: string): null | number => {
  return parseInt(title);
};

const isValidOrder = (order: unknown) => {
  return typeof order === 'number' && !Number.isNaN(order);
};

const buildCategory = (category: Category): CategoryListElement => {
  const {
    id,
    MetaTagDescription: metaTagDescription,
    children,
    Title: title,
    name,
  } = category;
  const order = getItemOrder(title);

  return {
    id,
    image: metaTagDescription,
    name,
    order: isValidOrder(order) ? order : id,
    children: children ? sortByOrderAscending(children.map(buildCategory)) : [],
    showOnHome: false,
  };
};

const sortByOrderAscending = <T extends { order: number }>(elements: T[]) =>
  elements.sort((a, b) => a.order - b.order);

export const buildCategoryTree: BuildCategoriesTree = async (getData) => {
  try {
    const data = (await getData())?.data || [];

    const result = sortByOrderAscending(
      data.map((category, i) => {
        const newCategory = buildCategory(category);

        return {
          ...newCategory,
          showOnHome:
            data.length <= 5 || category.id !== newCategory.order || i < 3,
        };
      })
    );

    return result;
  } catch {
    return [];
  }
};
