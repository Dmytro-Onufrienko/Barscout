export type Ingredient = {
  name: string;
  measure: string;
};

export type Cocktail = {
  id: string;
  name: string;
  category: string;
  alcoholic: string;
  glass: string;
  instructions: string;
  thumbnail: string;
  ingredients: Ingredient[];
};

export type RawCocktail = {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strDrinkThumb: string;
  [key: string]: string | null;
};

export function rawToCocktail(raw: RawCocktail): Cocktail {
  const ingredients: Ingredient[] = [];

  for (let i = 1; i <= 15; i++) {
    const name = raw[`strIngredient${i}`];
    const measure = raw[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: measure?.trim() ?? '' });
    }
  }

  return {
    id: raw.idDrink,
    name: raw.strDrink,
    category: raw.strCategory ?? '',
    alcoholic: raw.strAlcoholic ?? '',
    glass: raw.strGlass ?? '',
    instructions: raw.strInstructions ?? '',
    thumbnail: raw.strDrinkThumb ?? '',
    ingredients,
  };
}
