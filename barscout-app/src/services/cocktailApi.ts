import type { Cocktail, CocktailPreview, RawCocktail } from '@/types/cocktail';
import { rawToCocktail } from '@/types/cocktail';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export class CocktailApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'CocktailApiError';
  }
}

async function fetchCocktails(url: string): Promise<Cocktail[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new CocktailApiError(`Request failed`, response.status);
  }

  const json = await response.json();

  if (!json.drinks) {
    return [];
  }

  return (json.drinks as RawCocktail[]).map(rawToCocktail);
}

export async function getRandomCocktail(): Promise<Cocktail> {
  const results = await fetchCocktails(`${BASE_URL}/random.php`);

  if (results.length === 0) {
    throw new CocktailApiError('No cocktail returned');
  }

  return results[0];
}

export async function searchByName(query: string): Promise<Cocktail[]> {
  return fetchCocktails(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
}

export async function getById(id: string): Promise<Cocktail> {
  const results = await fetchCocktails(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);

  if (results.length === 0) {
    throw new CocktailApiError(`Cocktail not found: ${id}`);
  }

  return results[0];
}

export async function getRandomFromCategory(category: string): Promise<Cocktail> {
  const previews = await filterByCategory(category);
  if (previews.length === 0) throw new CocktailApiError(`No cocktails in category: ${category}`);
  const pick = previews[Math.floor(Math.random() * previews.length)];
  return getById(pick.id);
}

export async function searchByIngredient(ingredient: string): Promise<CocktailPreview[]> {
  const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
  if (!response.ok) throw new CocktailApiError('Failed to search by ingredient', response.status);
  const json = await response.json();
  if (!json.drinks) return [];
  return (json.drinks as { idDrink: string; strDrink: string; strDrinkThumb: string }[]).map(
    (d) => ({ id: d.idDrink, name: d.strDrink, thumbnail: d.strDrinkThumb }),
  );
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/list.php?c=list`);
  if (!response.ok) throw new CocktailApiError('Failed to load categories', response.status);
  const json = await response.json();
  if (!json.drinks) return [];
  return (json.drinks as { strCategory: string }[]).map((d) => d.strCategory);
}

export async function filterByCategory(category: string): Promise<CocktailPreview[]> {
  const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  if (!response.ok) throw new CocktailApiError('Failed to filter by category', response.status);
  const json = await response.json();
  if (!json.drinks) return [];
  return (json.drinks as { idDrink: string; strDrink: string; strDrinkThumb: string }[]).map(
    (d) => ({ id: d.idDrink, name: d.strDrink, thumbnail: d.strDrinkThumb }),
  );
}
