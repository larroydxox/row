interface Item { value: number }
interface Category { items: Item[] }

export const getCategoryTotal = (category: Category): number =>
  category.items.reduce((a, i) => a + i.value, 0)

export const getTotal = (categories: Category[]): number =>
  categories.reduce((acc, c) => acc + getCategoryTotal(c), 0)
