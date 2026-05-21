# 🍸 BarScout & Mixology — Повний план розробки

> **Стек:** React Native + Expo (SDK 51+), JavaScript/TypeScript
> **Призначення:** покроковий roadmap для імплементації через Claude Code в терміналі
> **Принцип:** один логічний крок = один коміт. Кожен коміт атомарний, проходить білд, не ламає попередній стан.

---

## 📋 Як користуватися цим документом

1. **Кожен крок (Step)** = окрема сесія в Claude Code = окремий коміт (який робиш ТИ САМ).
2. **Claude Code НЕ робить `git commit`** — він лише пише код і в кінці пропонує тобі готовий commit message.
3. **Формат коміту:** `[ФАЗА.КРОК] короткий опис` (приклад: `[2.1] add bottom tabs navigation`).
4. **Перед кожним кроком** Claude Code читає секцію кроку: контекст → файли → дії → перевірка → пропозиція message.
5. **Після того як Claude Code завершив Step** — ти:
  - перевіряєш зміни (`git status`, `git diff`)
  - запускаєш `npm start` і тестуєш
  - сам робиш `git add .` та `git commit -m "..."` з запропонованим (або відредагованим) message
6. **Після кожної фази** виконується **Revision Block** — ревізія: що зроблено, що далі, чи нічого не зламано.
7. **Ліміти Claude Code:** якщо ліміт близько — зупинись на найближчому "Чекпоінт" і закоміться сам. Не починай новий Step без запасу контексту.
8. **Принцип атомарності:** ніколи не міксуй два Steps в одному коміті. Краще зайвий коміт, ніж зламаний rollback.

---

## ⚙️ Інструкція для Claude Code (читати перед стартом)

**Claude Code, ти НЕ робиш git-операції.** Конкретно — ти НЕ викликаєш `git add`, `git commit`, `git push`, `git checkout`, `git reset`. Це все робить користувач вручну.

**Твоя роль на кожному Step:**
1. Прочитай секцію поточного Step з цього файлу
2. Виконай тільки описані в "Дії" зміни в коді (створення файлів, редагування, встановлення npm-пакетів через команди)
3. Перевір що зміни мають сенс і що TypeScript/білд не зламано
4. У кінці виведи блок такого формату:

```
✅ Step X.Y завершено

📝 Що зроблено:
- коротко по пунктах

📂 Змінені/створені файли:
- src/...
- src/...

⚠️ Що перевірити вручну перед комітом:
- запусти `npm start`
- перевір [конкретне очікування з секції "Перевірка"]
- [інші ручні перевірки якщо є]

💬 Запропонований commit message:
[X.Y] short description in english

(тіло коміту, опціонально):
- bullet point 1
- bullet point 2
```

**Не комітьcя сам. Не пушай. Користувач робить це власноруч після перевірки.**

---

## 🗂 Зміст

- [Фаза 0. Підготовка та ініціалізація](#фаза-0)
- [Фаза 1. Базова навігація та структура](#фаза-1)
- [Фаза 2. Mixology Randomizer (CocktailDB + UI)](#фаза-2)
- [Фаза 3. Сенсори та Haptics (Shake-to-Shuffle)](#фаза-3)
- [Фаза 4. Bar Finder (Геолокація + Overpass + Deep Linking)](#фаза-4)
- [Фаза 5. Degustation Journal (Камера + FileSystem)](#фаза-5)
- [Фаза 6. AsyncStorage та персистентність](#фаза-6)
- [Фаза 7. Полірування, UX, помилки, темна тема](#фаза-7)
- [Фаза 8. EAS Build & Submit](#фаза-8)
- [Глобальні Revision Points](#revision)

---

<a name="фаза-0"></a>

## 🚀 ФАЗА 0. Підготовка та ініціалізація

### Step 0.1 — Створення Expo-проекту

**Контекст:** Чистий старт. Базовий шаблон Expo з TypeScript (для типобезпеки сенсорів та API).

**Файли:** новий каталог `barscout-app/`

**Дії:**
```bash
npx create-expo-app@latest barscout-app --template blank-typescript
cd barscout-app
```

⚠️ **Claude Code:** не роби `git init`/`git add`/`git commit`. Якщо `create-expo-app` не зробив `git init` автоматично — згадай про це в фінальному блоці, користувач сам ініціалізує репо.

**Перевірка (виконує користувач):**
- `npm start` запускається без помилок
- Метро бандлер відкривається
- Можна відсканувати QR через Expo Go

**Запропонований commit message:** `[0.1] init expo project with typescript template`

---

### Step 0.2 — Структура каталогів та `.gitignore`

**Контекст:** Готуємо архітектуру одразу, щоб не рефакторити пізніше. Дотримуємось feature-based структури.

**Файли:** створити каталоги
```
src/
├── screens/         # екрани (Randomizer, BarFinder, Journal, Detail)
├── components/      # переюзні компоненти (Card, Button, SafeArea)
├── navigation/      # навігаційні стеки
├── hooks/           # кастомні хуки (useShakeDetector, useLocation)
├── services/        # API клієнти (cocktailApi, overpassApi)
├── storage/         # AsyncStorage обгортки
├── theme/           # кольори, шрифти, spacing
├── types/           # TS типи
└── utils/           # хелпери
```

**Дії:**
- Створи всі каталоги через `mkdir -p`
- В кожному каталозі додай `.gitkeep` (бо git не трекає порожні папки)
- Доповни `.gitignore`:
  ```
  # Expo
  .expo/
  dist/
  web-build/

  # Native
  *.orig.*
  *.jks
  *.p8
  *.p12
  *.key
  *.mobileprovision

  # IDE
  .vscode/
  .idea/

  # OS
  .DS_Store
  Thumbs.db

  # EAS
  /android
  /ios
  ```

**Перевірка:**
- `tree src/` показує всі каталоги
- `git status` — нові файли видно

**Запропонований commit message:** `[0.2] add project structure and gitignore`

---

### Step 0.3 — Встановлення базових залежностей навігації

**Контекст:** Ставимо ТІЛЬКИ навігацію зараз. Сенсори, камеру, геолокацію — поетапно у відповідних фазах, щоб не змішувати помилки залежностей.

**Дії:**
```bash
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons
```

**Перевірка:**
- `package.json` оновлено
- `npm start` все ще працює без помилок

**Запропонований commit message:** `[0.3] install navigation dependencies`

---

### Step 0.4 — Налаштування theme (кольори, типографіка, spacing)

**Контекст:** Централізована тема — критично для RN, бо CSS-каскаду немає. Без неї стилі будуть розповзатися.

**Файли:**
- `src/theme/colors.ts` — палітра (light + dark)
- `src/theme/typography.ts` — розміри шрифтів, ваги
- `src/theme/spacing.ts` — відступи (xs=4, sm=8, md=16, lg=24, xl=32)
- `src/theme/index.ts` — re-export

**Деталізація:**
- Кольори: основні (primary, background, surface, text, textMuted, error, success)
- Окремий об'єкт для light і dark
- Уникай хардкоду кольорів у компонентах — лише через theme

**Перевірка:**
- `import { colors, spacing, typography } from '@/theme'` працює (після Step 0.5)

**Запропонований commit message:** `[0.4] add theme tokens (colors, typography, spacing)`

---

### Step 0.5 — Path aliases (`@/`) через `tsconfig` та `babel.config.js`

**Контекст:** Імпорти типу `../../../components/Card` стають пеклом. Робимо `@/components/Card`.

**Файли:**
- `tsconfig.json` — `"paths": { "@/*": ["./src/*"] }, "baseUrl": "."`
- `babel.config.js` — додати `babel-plugin-module-resolver`

**Дії:**
```bash
npm install -D babel-plugin-module-resolver
```

В `babel.config.js`:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './src' },
        },
      ],
    ],
  };
};
```

**Перевірка:**
- Перезапусти Metro з очисткою кешу: `npx expo start -c`
- Тестовий імпорт `import { colors } from '@/theme'` має працювати

**Запропонований commit message:** `[0.5] configure path aliases`

---

### 🔍 REVISION 0 — Підсумок Фази 0

**Виконано:**
- ✅ Базовий Expo-проект з TypeScript
- ✅ Структура каталогів feature-based
- ✅ Залежності навігації
- ✅ Тема (кольори, spacing, typography)
- ✅ Path aliases

**Перевір перед Фазою 1:**
- [ ] `npm start` запускає без warnings
- [ ] git log показує 5 коммітів
- [ ] Жоден файл не зламаний (всі імпорти валідні)

**Наступне:** Створюємо навігацію та екрани-заглушки.

---

<a name="фаза-1"></a>

## 🧭 ФАЗА 1. Базова навігація та структура

### Step 1.1 — Екрани-заглушки

**Контекст:** Спочатку статичні екрани з заголовком. Без логіки. Це дозволить перевірити навігацію ізольовано.

**Файли:**
- `src/screens/RandomizerScreen.tsx`
- `src/screens/BarFinderScreen.tsx`
- `src/screens/JournalScreen.tsx`
- `src/screens/CocktailDetailScreen.tsx`

**Деталізація кожного:**
- Імпорт `View`, `Text`, `StyleSheet` з `react-native`
- `SafeAreaView` з `react-native-safe-area-context`
- Темний/світлий бекграунд через `useColorScheme()` + theme
- `StyleSheet.create()` — НЕ inline styles

**Перевірка:**
- TypeScript компілюється
- Кожен файл експортує default компонент

**Запропонований commit message:** `[1.1] add placeholder screens`

---

### Step 1.2 — Bottom Tabs Navigator

**Контекст:** Три основні таби (Randomizer, BarFinder, Journal). Detail-екран додамо в Step 1.3 окремим stack.

**Файли:**
- `src/navigation/RootNavigator.tsx` — створює `NavigationContainer`
- `src/navigation/BottomTabs.tsx` — створює `createBottomTabNavigator`
- `App.tsx` — заміняє дефолтний контент на `<RootNavigator />`

**Деталізація:**
- Іконки: `@expo/vector-icons` → `Ionicons` (cocktail-glass-like → wine, navigate-circle, journal)
- `tabBarActiveTintColor`, `inactiveTintColor` з theme
- Hide header на таб-навігаторі (заголовки робитимуть екрани самі)

**Потенційні проблеми:**
- Якщо `App.tsx` вже містить старий код — повністю замінити
- На iOS перший запуск може показати білий екран — перезапусти `expo start -c`

**Перевірка:**
- Три таби внизу екрану
- Кліки перемикають екрани
- Активний таб виділений

**Запропонований commit message:** `[1.2] add bottom tabs navigator with 3 screens`

---

### Step 1.3 — Native Stack для Randomizer (з Detail)

**Контекст:** Randomizer-таб має внутрішню навігацію: список → деталі коктейлю. Інкапсулюємо stack у таб.

**Файли:**
- `src/navigation/RandomizerStack.tsx`

**Деталізація:**
- `createNativeStackNavigator` (НЕ `createStackNavigator` — нативний швидший)
- Екрани: `Randomizer` (initial) → `CocktailDetail`
- Headers: показати на цьому стеку, заголовок з theme

**В `BottomTabs.tsx`** заміни компонент таба на `RandomizerStack`.

**Перевірка:**
- Тимчасова кнопка "Go to Detail" на RandomizerScreen веде на CocktailDetail
- Swipe-назад працює (нативний жест)

**Запропонований commit message:** `[1.3] add randomizer stack with detail screen`

---

### Step 1.4 — TypeScript типи для навігації

**Контекст:** RN-навігація без типів → постійні `any` і помилки в `navigation.navigate()`. Робимо одразу.

**Файли:**
- `src/types/navigation.ts`

**Деталізація:**
```ts
export type RandomizerStackParamList = {
  Randomizer: undefined;
  CocktailDetail: { cocktailId: string };
};

export type RootTabParamList = {
  RandomizerTab: undefined;
  BarFinderTab: undefined;
  JournalTab: undefined;
};
```

- Додай `declare global { namespace ReactNavigation { interface RootParamList extends RootTabParamList {} } }` для глобальної типізації.

**Перевірка:**
- В компонентах `useNavigation<NativeStackNavigationProp<RandomizerStackParamList>>()` працює з автокомплітом

**Запропонований commit message:** `[1.4] add navigation typescript types`

---

### 🔍 REVISION 1 — Підсумок Фази 1

**Виконано:**
- ✅ Три екрани-заглушки
- ✅ Bottom tabs з іконками
- ✅ Stack-навігація для Randomizer
- ✅ TS-типи навігації

**Тест-сценарій (мануально):**
1. Відкрий додаток → бачиш Randomizer таб
2. Перемкнись на BarFinder → екран змінюється
3. Назад на Randomizer → клік на "Detail" → відкривається CocktailDetail
4. Swipe-назад → повертає на Randomizer

**Чого ще немає:** жодної бізнес-логіки. Це нормально.

**Наступне:** Підключаємо CocktailDB API.

---

<a name="фаза-2"></a>

## 🍹 ФАЗА 2. Mixology Randomizer (CocktailDB + UI)

### Step 2.1 — API-клієнт для CocktailDB

**Контекст:** Виносимо мережевий шар окремо від UI. Це дозволить пізніше додати кешування, retry, моки для тестів.

**Файли:**
- `src/services/cocktailApi.ts`
- `src/types/cocktail.ts`

**Деталізація `cocktailApi.ts`:**
- Base URL: `https://www.thecocktaildb.com/api/json/v1/1`
- Ендпоінти:
  - `getRandomCocktail()` → `/random.php`
  - `searchByName(query: string)` → `/search.php?s={query}`
  - `getById(id: string)` → `/lookup.php?i={id}`
- Кожна функція має `try/catch`, повертає типізовані дані
- Помилки кидати як `class CocktailApiError extends Error`

**Деталізація `types/cocktail.ts`:**
- Бекенд повертає `strDrink`, `strInstructions`, `strIngredient1..15`, `strMeasure1..15`
- Створи трансформер: `rawToCocktail(raw): Cocktail` — нормалізує інгредієнти в масив `{ name, measure }`

**Потенційні проблеми:**
- CocktailDB іноді повертає `null` для відсутніх інгредієнтів — фільтруй
- Поля повертаються як `string`, навіть числові

**Перевірка:**
- Тимчасово в RandomizerScreen додай `useEffect(() => { getRandomCocktail().then(console.log); }, [])`
- Лог у Metro показує об'єкт коктейлю

**Запропонований commit message:** `[2.1] add cocktaildb api client and types`

---

### Step 2.2 — Хук `useRandomCocktail`

**Контекст:** Виносимо логіку завантаження в кастомний хук. Це готує ґрунт для Shake-to-Shuffle (Фаза 3), де той самий хук буде викликатися з сенсора.

**Файли:**
- `src/hooks/useRandomCocktail.ts`

**Деталізація:**
```ts
export function useRandomCocktail() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const shuffle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRandomCocktail();
      setCocktail(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cocktail, loading, error, shuffle };
}
```

**Перевірка:** TS-типи коректні, хук компілюється.

**Запропонований commit message:** `[2.2] add useRandomCocktail hook`

---

### Step 2.3 — Компонент `CocktailCard`

**Контекст:** Переюзний UI-блок для коктейля. Буде використовуватися в Randomizer, Journal та результатах пошуку.

**Файли:**
- `src/components/CocktailCard.tsx`

**Деталізація:**
- Props: `{ cocktail: Cocktail; onPress?: () => void }`
- Компоненти: `Pressable` (НЕ `TouchableOpacity` — кращий API для нових RN), `Image`, `Text`
- `Image`: `source={{ uri: cocktail.thumbnail }}` + ОБОВ'ЯЗКОВО фіксовані розміри (`width`, `height` у style)
- `resizeMode="cover"`
- Тінь: `shadowColor`, `shadowOpacity`, `shadowRadius`, `shadowOffset` (iOS) + `elevation` (Android)
- Border radius

**Потенційні проблеми:**
- Без розмірів `Image` з мережевим URI не покажеться
- Тіні: на Android тільки `elevation` працює, на iOS — `shadow*`

**Перевірка:** Картка рендериться з картинкою.

**Запропонований commit message:** `[2.3] add cocktail card component`

---

### Step 2.4 — RandomizerScreen: підключення хука та UI

**Контекст:** Збираємо все разом. Тимчасова кнопка "Shuffle" для тесту — пізніше замінимо на shake-жест.

**Файли:**
- `src/screens/RandomizerScreen.tsx` (повна реалізація)

**Деталізація:**
- Виклик `shuffle()` при першому рендері (через `useEffect(..., [])`)
- Стани:
  - `loading` → `ActivityIndicator` по центру
  - `error` → текст помилки + кнопка Retry
  - `cocktail` → `CocktailCard` + кнопка "🎲 Shuffle Again"
- Натиск на картку → `navigation.navigate('CocktailDetail', { cocktailId: cocktail.id })`

**Потенційні проблеми:**
- Не забути prop `keyboardShouldPersistTaps` для майбутніх форм (тут не критично)
- `ActivityIndicator` size="large" — щоб було видно

**Перевірка:** Запусти → коктейль завантажується → кнопка Shuffle вантажить новий.

**Запропонований commit message:** `[2.4] implement randomizer screen with shuffle button`

---

### Step 2.5 — CocktailDetailScreen: повна картка коктейлю

**Контекст:** Окремий екран для деталей: список інгредієнтів, інструкція, велике зображення.

**Файли:**
- `src/screens/CocktailDetailScreen.tsx`

**Деталізація:**
- Отримання `cocktailId` через `route.params`
- Виклик `getById()` через `useEffect`
- `ScrollView` (вертикальний) — інструкції можуть бути довгі
- Секції:
  - Hero image (повна ширина, висота ~300)
  - Назва, категорія, склянка, алкогольний/безалкогольний
  - Список інгредієнтів (`FlatList` зайвий, бо їх ≤15 — звичайний `.map()` ОК)
  - Інструкція (текст)
- Кнопка "💾 Save to Journal" — поки що заглушка (підключимо у Фазі 6)

**Потенційні проблеми:**
- iOS: при свайпі назад може втрачатися стан — це нормально, навмисна поведінка стека
- Перевір що `route.params` типізований правильно

**Перевірка:** Натиск на картку з Randomizer → відкриваються деталі з повною інформацією.

**Запропонований commit message:** `[2.5] implement cocktail detail screen`

---

### Step 2.6 — Loading skeleton та error states

**Контекст:** Покращуємо UX. Замість сухого спіннера — скелетон. Error має чітку кнопку повтору.

**Файли:**
- `src/components/CocktailCardSkeleton.tsx`
- `src/components/ErrorView.tsx`

**Деталізація:**
- Skeleton: сірі плейсхолдери розміром як CocktailCard, з простою opacity-анімацією (`Animated.loop`)
- ErrorView: іконка + текст + кнопка Retry (приймає `onRetry` як проп)

**Замінити в RandomizerScreen та CocktailDetailScreen** дефолтні стани на ці компоненти.

**Перевірка:** Вимкни Wi-Fi → побач ErrorView → увімкни → клік Retry → коктейль вантажиться.

**Запропонований commit message:** `[2.6] add loading skeleton and error states`

---

### 🔍 REVISION 2 — Підсумок Фази 2

**Виконано:**
- ✅ API-клієнт CocktailDB з типами
- ✅ Кастомний хук `useRandomCocktail`
- ✅ `CocktailCard` (reusable)
- ✅ RandomizerScreen з кнопкою Shuffle
- ✅ CocktailDetailScreen з повними деталями
- ✅ Skeleton + Error states

**Тест-сценарій:**
1. Відкрий Randomizer → коктейль вантажиться
2. Shuffle → інший коктейль
3. Тап на картку → деталі з інгредієнтами
4. Вимкни мережу, Shuffle → ErrorView → Retry → працює

**Чого ще немає:** жесту струшування. Логіка готова, лишилось підключити сенсор.

**Наступне:** Акселерометр і Haptics.

---

<a name="фаза-3"></a>

## 📳 ФАЗА 3. Сенсори та Haptics (Shake-to-Shuffle)

### Step 3.1 — Встановлення expo-sensors та expo-haptics

**Дії:**
```bash
npx expo install expo-sensors expo-haptics
```

**Перевірка:** `package.json` оновлено, проект білдиться.

**Запропонований commit message:** `[3.1] install expo-sensors and expo-haptics`

---

### Step 3.2 — Хук `useShakeDetector`

**Контекст:** Інкапсулюємо ВСЮ логіку детекції струшування. Решта коду просто отримує колбек "було струшено".

**Файли:**
- `src/hooks/useShakeDetector.ts`

**Деталізація алгоритму:**

```ts
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef } from 'react';

const SHAKE_THRESHOLD = 1.78;       // g-сила для детекції
const SHAKE_TIMEOUT_MS = 1000;      // мінімум між шейками (cooldown)
const UPDATE_INTERVAL_MS = 100;     // 10 Гц — баланс точності та продуктивності

export function useShakeDetector(onShake: () => void, enabled = true) {
  const lastShakeRef = useRef(0);
  const callbackRef = useRef(onShake);

  // Тримаємо актуальний callback без перепідписки
  useEffect(() => { callbackRef.current = onShake; }, [onShake]);

  useEffect(() => {
    if (!enabled) return;

    Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (force > SHAKE_THRESHOLD && now - lastShakeRef.current > SHAKE_TIMEOUT_MS) {
        lastShakeRef.current = now;
        callbackRef.current();
      }
    });

    return () => subscription.remove();
  }, [enabled]);
}
```

**Чому саме так:**
- `useRef` для `lastShake` — не викликає ре-рендер
- `callbackRef` — щоб не перепідписуватися при кожному ре-рендері з новим `onShake`
- `enabled` проп — можна вимкнути, коли екран не у фокусі (для батареї)

**Потенційні проблеми:**
- На емуляторі акселерометр не працює — тестуй на реальному пристрої
- iOS Simulator має меню "Device → Shake Gesture" для тесту
- На Android emulator — Extended Controls → Virtual Sensors

**Перевірка:** Додай тимчасовий `console.log('SHAKE!')` у callback → струси телефон → бачиш лог.

**Запропонований commit message:** `[3.2] add useShakeDetector hook`

---

### Step 3.3 — Інтеграція shake-жесту в RandomizerScreen

**Контекст:** Підключаємо хук до екрану. Жест активний тільки коли екран у фокусі.

**Файли:**
- `src/screens/RandomizerScreen.tsx` (модифікація)

**Деталізація:**
- Імпортуй `useFocusEffect` з `@react-navigation/native` АБО використай `useIsFocused`
- `useShakeDetector(shuffle, isFocused)` — щоб не споживати батарею на інших табах

**Чому це важливо:**
- В документі-завданні явно вказано: "активний сенсор у фоні швидко розрядить батарею"
- При переході на BarFinder підписка має знятися

**Перевірка:**
1. Randomizer → струси → коктейль змінюється
2. Перейди на BarFinder → струси → НІЧОГО не відбувається (бо підписку знято)

**Запропонований commit message:** `[3.3] integrate shake-to-shuffle on randomizer screen`

---

### Step 3.4 — Хук `useHaptics` та тактильний відгук

**Контекст:** Окрема обгортка над expo-haptics — щоб не імпортувати в кожному екрані, плюс централізована точка для майбутньої опції "вимкнути вібрацію".

**Файли:**
- `src/hooks/useHaptics.ts`

**Деталізація:**
```ts
import * as Haptics from 'expo-haptics';

export function useHaptics() {
  return {
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    selection: () => Haptics.selectionAsync(),
  };
}
```

**Використання в RandomizerScreen:**
- При успішному завантаженні коктейлю (після shake) → `haptics.success()`
- При помилці → `haptics.error()`
- При тапі на картку → `haptics.light()`

**Потенційні проблеми:**
- На Android emulator вібрації нема — це нормально
- На iOS Simulator Taptic Engine не симулюється

**Перевірка:** На реальному пристрої струси → відчуваєш вібрацію разом з новим коктейлем.

**Запропонований commit message:** `[3.4] add haptics feedback for shake and interactions`

---

### Step 3.5 — Візуальний фідбек на shake

**Контекст:** Окрім вібрації — невелика анімація на картці (масштабування або bounce). Це робить UX преміальним.

**Файли:**
- `src/screens/RandomizerScreen.tsx` (модифікація)
- АБО `src/components/CocktailCard.tsx` з опціональним `animateOnMount`

**Деталізація:**
- Використай `Animated.Value` + `Animated.spring` або `react-native-reanimated`
- Простий варіант: scale 0.9 → 1.0 з spring (без додаткових залежностей)

**Якщо хочеш Reanimated (рекомендовано, кращий perf):**
```bash
npx expo install react-native-reanimated
```
+ налаштування `babel.config.js` (плагін `react-native-reanimated/plugin` ОСТАННІМ в масиві плагінів).

**Перевірка:** Після shake коктейль "влітає" з невеликим bounce.

**Запропонований commit message:** `[3.5] add scale animation on cocktail load`

---

### 🔍 REVISION 3 — Підсумок Фази 3

**Виконано:**
- ✅ `useShakeDetector` з throttling та cooldown
- ✅ Shake-to-Shuffle на Randomizer
- ✅ Підписка автоматично знімається при втраті фокусу (батарея!)
- ✅ Haptics на ключових подіях
- ✅ Візуальна анімація

**Тест-сценарій (РЕАЛЬНИЙ пристрій):**
1. Randomizer відкритий → струси → новий коктейль + вібрація + анімація
2. Швидко струсити двічі → реагує лише на перший (cooldown працює)
3. Перейди на BarFinder → струси → нічого
4. Поверніся на Randomizer → струси → знов працює

**Чого ще немає:** Bar Finder з геолокацією.

**Наступне:** Геолокація та Overpass API.

---

<a name="фаза-4"></a>

## 📍 ФАЗА 4. Bar Finder (Геолокація + Overpass + Deep Linking)

### Step 4.1 — Встановлення expo-location та конфігурація дозволів

**Дії:**
```bash
npx expo install expo-location
```

**Файл:** `app.json` (модифікація)

**Деталізація:**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Дозвольте доступ до геолокації для пошуку барів поруч з вами."
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Для пошуку барів поруч з вами потрібен доступ до геолокації."
      }
    },
    "android": {
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
    }
  }
}
```

**Потенційні проблеми:**
- Якщо тестуєш в Expo Go — нативні дозволи вже зашиті, але рядки описів не персональні
- При EAS Build потрібен `prebuild` або dev-client для нативних змін

**Перевірка:** `npx expo start` без помилок конфігурації.

**Запропонований commit message:** `[4.1] add expo-location and permission configs`

---

### Step 4.2 — Хук `useLocation` з обробкою дозволів

**Контекст:** Інкапсулюємо весь pipeline: запит дозволу → отримання координат → обробка відмови.

**Файли:**
- `src/hooks/useLocation.ts`

**Деталізація стану:**
```ts
type LocationState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'success'; coords: { latitude: number; longitude: number } }
  | { status: 'error'; message: string };
```

**Логіка:**
1. `requestPermission()` через `Location.requestForegroundPermissionsAsync()`
2. Якщо `granted` → `Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })`
3. Якщо `denied` і `canAskAgain === false` → пропонуй `Linking.openSettings()`

**API хука:**
```ts
return { state, requestLocation, openSettings };
```

**Потенційні проблеми:**
- `getCurrentPositionAsync` може зависати в приміщенні без GPS — додай timeout (наприклад, `Promise.race` з 15 сек)
- На emulator геолокація задається через Extended Controls
- iOS: перший запит у симуляторі — Features → Location → Apple

**Перевірка:** Викликай `requestLocation()` → бачиш модалку дозволу → отримуєш координати в console.

**Запропонований commit message:** `[4.2] add useLocation hook with permission handling`

---

### Step 4.3 — Overpass API клієнт

**Контекст:** Подібно до cocktailApi, виносимо запити до Overpass окремо.

**Файли:**
- `src/services/overpassApi.ts`
- `src/types/bar.ts`

**Деталізація:**
- Base URL: `https://overpass-api.de/api/interpreter`
- Метод POST з body як `data=` + URL-encoded Overpass QL

Приклад запиту:
```ts
const query = `
  [out:json][timeout:25];
  (
    node["amenity"="bar"](around:${radius},${lat},${lon});
    node["amenity"="pub"](around:${radius},${lat},${lon});
  );
  out body;
`;

const response = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: `data=${encodeURIComponent(query)}`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});
```

**Тип `Bar`:**
```ts
export type Bar = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  tags: Record<string, string>; // address, website, opening_hours
  distanceMeters?: number; // обчислюється на клієнті
};
```

**Хелпер `calculateDistance`** (формула Haversine):
- В `src/utils/geo.ts`
- Обчислює відстань між двома координатами в метрах

**Потенційні проблеми:**
- Overpass може повертати 429 (rate limit) — додай retry з backoff
- Не всі бари мають `tags.name` — фільтруй або показуй "Unnamed bar"
- API публічний → не зловживай частими запитами

**Перевірка:** З тестовими координатами Києва (`50.4501, 30.5234`) повертається список барів.

**Запропонований commit message:** `[4.3] add overpass api client for bars search`

---

### Step 4.4 — Компонент `BarListItem`

**Файли:**
- `src/components/BarListItem.tsx`

**Деталізація:**
- Props: `{ bar: Bar; onPress: () => void }`
- Показує: ім'я, відстань (з `distanceMeters` → "850 m" або "1.2 km"), іконку (Ionicons "beer")
- Доступний для тапу (Pressable)

**Перевірка:** Рендериться окремо тестово.

**Запропонований commit message:** `[4.4] add bar list item component`

---

### Step 4.5 — BarFinderScreen: повна реалізація

**Контекст:** Збираємо все: запит локації → запит барів → список → обробка станів.

**Файли:**
- `src/screens/BarFinderScreen.tsx`

**Деталізація — стани UI:**
1. `idle` → велика кнопка "🔍 Знайти бари поруч"
2. `requesting` → ActivityIndicator "Отримуємо локацію..."
3. `denied` → текст пояснення + кнопка "Відкрити налаштування"
4. `loading bars` → ActivityIndicator "Шукаємо бари..."
5. `success` → `FlatList<Bar>` з `BarListItem`
6. `error` → ErrorView + Retry
7. `empty` → "Барів поблизу не знайдено" + кнопка "Збільшити радіус"

**Деталізація — FlatList оптимізації (з документа):**
- `keyExtractor={(item) => item.id}`
- `initialNumToRender={10}`
- `windowSize={5}`
- `removeClippedSubviews` (Android boost)

**Радіус пошуку:**
- Стан `radius` (default 1000m)
- Перемикач: 500m / 1km / 2km / 5km

**Сортування:**
- За замовчуванням — за відстанню (від ближнього)

**Перевірка:**
- Дозвіл → отримання координат → запит → список з відстанями
- Pull-to-refresh працює

**Запропонований commit message:** `[4.5] implement bar finder screen with overpass integration`

---

### Step 4.6 — Deep Linking до карт

**Контекст:** Тап на бар → відкривається Apple Maps (iOS) або Google Maps (Android) з прокладеним маршрутом.

**Файли:**
- `src/utils/mapLinking.ts`

**Деталізація:**
```ts
import { Linking, Platform } from 'react-native';

export async function openInMaps(lat: number, lon: number, label: string) {
  const encodedLabel = encodeURIComponent(label);
  const url = Platform.select({
    ios: `maps:0,0?q=${encodedLabel}@${lat},${lon}`,
    android: `geo:0,0?q=${lat},${lon}(${encodedLabel})`,
  });

  if (!url) return;

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    // Fallback на веб-Google-Maps
    await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
  }
}
```

**Підключи в BarFinderScreen:** при тапі на `BarListItem` викликай `openInMaps(bar.lat, bar.lon, bar.name)`.

**Потенційні проблеми:**
- На emulator без Google Maps → fallback на веб
- На iOS Simulator Apple Maps може не відкритися — це нормально

**Перевірка:** Тап на бар → відкривається нативна мапа з маркером.

**Запропонований commit message:** `[4.6] add deep linking to native maps`

---

### Step 4.7 — Кешування результатів пошуку (sessionStorage-like)

**Контекст:** Не запитувати Overpass щоразу при поверненні на екран. Кешуємо в пам'яті (НЕ AsyncStorage — це для Фази 6).

**Файли:**
- `src/services/overpassApi.ts` (модифікація) — додай простий in-memory cache

**Деталізація:**
- Ключ кешу: `${lat.toFixed(3)}_${lon.toFixed(3)}_${radius}`
- TTL: 5 хвилин
- Простий `Map<string, { data, timestamp }>`

**Перевірка:** Швидке повторне відкриття BarFinder не робить новий запит.

**Запропонований commit message:** `[4.7] add in-memory cache for overpass results`

---

### 🔍 REVISION 4 — Підсумок Фази 4

**Виконано:**
- ✅ Дозволи геолокації (iOS + Android)
- ✅ `useLocation` з обробкою всіх кейсів
- ✅ Overpass API клієнт + Haversine distance
- ✅ BarFinderScreen з FlatList оптимізаціями
- ✅ Deep linking до Apple/Google Maps
- ✅ In-memory кеш

**Тест-сценарій:**
1. Відкрий BarFinder → дозвіл → координати → список барів
2. Тап на бар → відкривається нативна мапа
3. Зміни радіус → новий запит
4. Pull-to-refresh → оновлення

**Edge cases для перевірки:**
- [ ] Відмова в дозволі → пояснення + кнопка налаштувань
- [ ] Відсутність мережі → ErrorView
- [ ] Локація в пустелі (0 барів) → empty state

**Наступне:** Камера та Journal.

---

<a name="фаза-5"></a>

## 📸 ФАЗА 5. Degustation Journal (Камера + FileSystem)

### Step 5.1 — Встановлення expo-camera та expo-file-system

**Дії:**
```bash
npx expo install expo-camera expo-file-system
```

**`app.json`** — плагін камери (як у документі):
```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Дозвольте доступ до камери для фотографування коктейлів."
        }
      ]
    ]
  }
}
```

**Перевірка:** Білд проходить.

**Запропонований commit message:** `[5.1] install expo-camera and expo-file-system`

---

### Step 5.2 — Хук `useCameraPermission`

**Файли:**
- `src/hooks/useCameraPermission.ts`

**Деталізація:**
- Аналогічно `useLocation` — стани idle/requesting/granted/denied
- Експонує `requestPermission()` та `openSettings()`

**Запропонований commit message:** `[5.2] add camera permission hook`

---

### Step 5.3 — Екран `CameraScreen` з кастомним інтерфейсом

**Контекст:** Окремий екран, доступний з Journal. Показує live-preview, кнопку зйомки, перемикач передня/задня камера.

**Файли:**
- `src/screens/CameraScreen.tsx`

**Деталізація:**
- Імпорт `CameraView` з `expo-camera`
- `useRef<CameraView>` для виклику `.takePictureAsync()`
- UI:
  - Top bar: кнопка "Закрити" (закриває екран)
  - Camera view (заповнює середину)
  - Bottom bar: кнопка-затвор по центру, перемикач камер справа
- Стани:
  - Дозвіл не отримано → екран пояснення + кнопка "Дозволити"
  - Готовність → live-preview
  - Зйомка йде → блокувати кнопку (`disabled`)

**Параметри `takePictureAsync`:**
```ts
const photo = await cameraRef.current?.takePictureAsync({
  quality: 0.8,           // компресія
  skipProcessing: false,
});
// photo.uri — file:// в кеші
```

**Потенційні проблеми:**
- Camera в Expo Go обмежена — деякі функції тільки в dev-client
- На iOS перший запит дозволу через `Camera.requestCameraPermissionsAsync()`
- НЕ використовуй deprecated `expo-camera/legacy` — потрібен новий `CameraView` API

**Перевірка:** Камера показує preview, тап на затвор знімає фото, в console URI виду `file:///.../cache/Camera/xxx.jpg`.

**Запропонований commit message:** `[5.3] add camera screen with custom ui`

---

### Step 5.4 — Утиліта `photoStorage` для роботи з файлами

**Контекст:** Виносимо логіку переміщення фото з кешу в documentDirectory. Це окремий слой над FileSystem.

**Файли:**
- `src/services/photoStorage.ts`

**Деталізація:**
```ts
import * as FileSystem from 'expo-file-system';

const PHOTOS_DIR = `${FileSystem.documentDirectory}cocktail_photos/`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

export async function savePhotoPermanently(cacheUri: string): Promise<string> {
  await ensureDir();
  const filename = `${Date.now()}.jpg`;
  const newUri = `${PHOTOS_DIR}${filename}`;
  await FileSystem.moveAsync({ from: cacheUri, to: newUri });
  return newUri;
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (e) {
    console.warn('Failed to delete photo', e);
  }
}

export async function getPhotoSize(uri: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(uri, { size: true });
  return info.exists ? (info as any).size : 0;
}
```

**Потенційні проблеми:**
- `expo-file-system` має новий API (SDK 52+) — перевір документацію під свою версію
- `documentDirectory` може бути `null` на старих версіях — fallback не потрібен у Expo
- Не забути про випадок коли source-file вже стерто ОС з кешу

**Перевірка:** Виклик `savePhotoPermanently` повертає новий URI у форматі `file:///.../Documents/cocktail_photos/xxx.jpg`.

**Запропонований commit message:** `[5.4] add photo storage utility`

---

### Step 5.5 — Підключення камери до flow збереження

**Контекст:** Після зйомки фото → переміщення в постійне сховище → повернення URI назад на попередній екран.

**Файли:**
- `src/screens/CameraScreen.tsx` (модифікація)

**Деталізація:**
- Після `takePictureAsync` → одразу `savePhotoPermanently(photo.uri)`
- Передача URI назад через navigation: `navigation.navigate('JournalEntry', { photoUri })`
- АБО через callback з попереднього екрану (через `route.params.onPhotoCaptured`)
  - ⚠️ Передавати функції в params — анти-патерн React Navigation. Краще використати глобальний state (Zustand/Context) або повернути URI через `navigate('PreviousScreen', { photoUri })`

**Рекомендований підхід:**
- Camera екран НЕ зберігає сам — повертає `photoUri` (з кешу) попередньому екрану
- Попередній екран (форма Journal entry) робить `savePhotoPermanently` тільки якщо користувач натиснув "Зберегти запис"
- Це уникає накопичення мертвих фото при скасуванні

**Запропонований commit message:** `[5.5] wire camera screen to return photo uri`

---

### Step 5.6 — Форма Journal Entry

**Файли:**
- `src/screens/JournalEntryScreen.tsx`
- `src/types/journalEntry.ts`

**Тип:**
```ts
export type JournalEntry = {
  id: string;             // uuid
  cocktailId?: string;    // опц. посилання на CocktailDB
  cocktailName: string;
  photoUri?: string;      // file://
  rating: number;         // 1-5
  notes: string;
  createdAt: string;      // ISO
};
```

**UI:**
- Поле "Назва коктейлю" (`TextInput`)
- Поле "Нотатки" (`TextInput multiline`)
- Рейтинг (5 зірочок, тап вибирає)
- Прев'ю фото (якщо є) + кнопки "Зробити фото" / "Замінити"
- Кнопки "Скасувати" / "Зберегти"

**Логіка збереження:**
1. Якщо є `photoUri` з кешу → `savePhotoPermanently`
2. Створити `JournalEntry` об'єкт
3. Зберегти через `journalStorage` (наступний крок, поки заглушка)
4. Закрити екран

**Потенційні проблеми:**
- `KeyboardAvoidingView` обов'язковий для iOS — без нього клавіатура накриває поля
- `TextInput multiline` має задавати `minHeight`

**Перевірка:** Форма заповнюється, фото робиться, "Зберегти" поки виводить в console.

**Запропонований commit message:** `[5.6] add journal entry form screen`

---

### 🔍 REVISION 5 — Підсумок Фази 5

**Виконано:**
- ✅ Camera permissions + кастомний UI камери
- ✅ Photo storage utility (move з кешу в documents)
- ✅ Journal entry form з прев'ю фото
- ✅ Базова структура типу JournalEntry

**Чого ще немає:** persist шар (AsyncStorage) — наступна фаза.

**Тест-сценарій:**
1. Journal → "Додати запис" → форма
2. "Зробити фото" → CameraScreen → знімок → повернення з URI
3. Заповнюєш дані → "Зберегти" → лог в console з повним об'єктом
4. Фото видно в прев'ю після зйомки

**Наступне:** AsyncStorage для збереження entries та обраних коктейлів.

---

<a name="фаза-6"></a>

## 💾 ФАЗА 6. AsyncStorage та персистентність

### Step 6.1 — Встановлення AsyncStorage

**Дії:**
```bash
npx expo install @react-native-async-storage/async-storage
```

**Запропонований commit message:** `[6.1] install async-storage`

---

### Step 6.2 — Storage layer: `journalStorage`

**Контекст:** Як описано в документі-завданні: один ключ = один JSON-масив записів. Простіше за реляційну БД, але достатньо для MVP.

**Файли:**
- `src/storage/journalStorage.ts`

**Деталізація:**
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JournalEntry } from '@/types/journalEntry';

const KEY = '@barscout:journal_entries_v1';

export const journalStorage = {
  async getAll(): Promise<JournalEntry[]> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async save(entry: JournalEntry): Promise<void> {
    const all = await this.getAll();
    const idx = all.findIndex((e) => e.id === entry.id);
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry); // нові — зверху
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  },

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((e) => e.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
```

**Чому версія в ключі (`v1`):**
- Якщо в майбутньому зміниш структуру — можна додати міграцію `v1 → v2`
- Розповсюджена практика з документа

**Запропонований commit message:** `[6.2] add journal storage layer`

---

### Step 6.3 — Storage layer: `favoritesStorage`

**Файли:**
- `src/storage/favoritesStorage.ts`

**Деталізація:**
- Зберігає `string[]` (масив cocktailId з CocktailDB)
- API: `getAll()`, `add(id)`, `remove(id)`, `has(id)`, `toggle(id)`

**Запропонований commit message:** `[6.3] add favorites storage layer`

---

### Step 6.4 — Context для глобального стану

**Контекст:** Замість пропсів через 5 рівнів — Context. Redux/Zustand тут оверкіл для невеликого додатку.

**Файли:**
- `src/contexts/JournalContext.tsx`
- `src/contexts/FavoritesContext.tsx`

**Деталізація `JournalContext`:**
```ts
type JournalContextValue = {
  entries: JournalEntry[];
  loading: boolean;
  saveEntry: (entry: JournalEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};
```

- При маунті провайдера → `journalStorage.getAll()` → set state
- `saveEntry` → storage + оновлення локального state (оптимістичне)
- `deleteEntry` → так само + видалення фото через `deletePhoto(entry.photoUri)`

**Обгортка в `App.tsx`:**
```tsx
<JournalProvider>
  <FavoritesProvider>
    <RootNavigator />
  </FavoritesProvider>
</JournalProvider>
```

**Потенційні проблеми:**
- При видаленні entry треба ще видалити фото з FS — інакше "сирітські" файли
- Context викликає ре-рендер ВСІХ споживачів при будь-якій зміні — для невеликого додатку ОК

**Запропонований commit message:** `[6.4] add journal and favorites contexts`

---

### Step 6.5 — Інтеграція JournalEntryScreen зі сховищем

**Файли:**
- `src/screens/JournalEntryScreen.tsx` (модифікація)

**Деталізація:**
- Замінити заглушку `console.log` на `await saveEntry(entry)` з контексту
- Перед збереженням — генерація `id` через `crypto.randomUUID()` (Expo має поліфіл) або власна функція

**Запропонований commit message:** `[6.5] wire journal form to storage`

---

### Step 6.6 — JournalScreen: список записів

**Файли:**
- `src/screens/JournalScreen.tsx` (повна реалізація)
- `src/components/JournalListItem.tsx`

**Деталізація:**
- `FlatList<JournalEntry>` з даних контексту
- Empty state: "Поки що пусто. Додай перший коктейль!"
- Кожен item: фото (мініатюра), назва, рейтинг (зірки), дата
- Тап → перехід на детальний перегляд (`JournalDetailScreen`)
- Swipe-to-delete АБО кнопка-сміттник в детальному перегляді
- FAB (Floating Action Button) "+" знизу → перехід на `JournalEntryScreen`

**Потенційні проблеми:**
- Локальні `file://` URI в `<Image>` працюють, але переконайся що шлях абсолютний
- FAB має не перекривати останній item — додай `paddingBottom` до FlatList

**Запропонований commit message:** `[6.6] implement journal list screen`

---

### Step 6.7 — JournalDetailScreen + видалення

**Файли:**
- `src/screens/JournalDetailScreen.tsx`

**Деталізація:**
- Повна інформація: велике фото, всі поля, дата
- Кнопка редагування → відкриває JournalEntryScreen в режимі edit
- Кнопка видалення → `Alert.alert` для підтвердження → `deleteEntry`

**Запропонований commit message:** `[6.7] add journal detail screen with delete`

---

### Step 6.8 — Інтеграція favorites в Randomizer/Detail

**Файли:**
- `src/screens/CocktailDetailScreen.tsx` (модифікація)

**Деталізація:**
- Кнопка-серце в header (через `navigation.setOptions({ headerRight: ... })`)
- Колір серця: пустий якщо НЕ в favorites, заповнений — якщо в favorites
- Тап → `toggleFavorite(cocktailId)` + haptics.light()

**Бонус:** окремий екран "Favorites" або секція на JournalScreen.

**Запропонований commit message:** `[6.8] add favorites toggle on cocktail detail`

---

### 🔍 REVISION 6 — Підсумок Фази 6

**Виконано:**
- ✅ Storage layers (journal + favorites) з версіонуванням
- ✅ Contexts для глобального стану
- ✅ Повна форма entry + список + детальний перегляд + видалення
- ✅ Favorites toggle на коктейлях

**Тест-сценарій (повний цикл):**
1. Randomizer → коктейль → серце → додано в favorites
2. Journal → "+" → форма → камера → фото → нотатки → зберегти
3. Запис з'являється у списку з фото
4. Тап → деталі → видалити → підтвердження → запис зник, фото фізично видалене з FS
5. Перезапусти додаток → дані залишаються

**Перевір edge cases:**
- [ ] Зберегти без фото → працює
- [ ] Швидке створення 10 записів поспіль → жодного не загублено
- [ ] Видалення → фото справді стерте (перевір через `FileSystem.getInfoAsync`)

**Наступне:** Полірування — темна тема, помилки мережі, анімації.

---

<a name="фаза-7"></a>

## ✨ ФАЗА 7. Полірування, UX, помилки, темна тема

### Step 7.1 — Темна тема через `useColorScheme` + ThemeContext

**Файли:**
- `src/theme/ThemeContext.tsx`
- модифікації екранів — використовувати тему через хук

**Деталізація:**
- `useColorScheme()` з RN повертає 'light' | 'dark' | null
- `ThemeContext` дозволяє override (опція "auto / light / dark" в налаштуваннях)
- Всі компоненти беруть кольори з контексту, НЕ напряму з модуля

**Перевірка:** Переключи системну тему → додаток слідує за нею.

**Запропонований commit message:** `[7.1] add dark theme support`

---

### Step 7.2 — NetInfo: обробка офлайн

**Дії:**
```bash
npx expo install @react-native-community/netinfo
```

**Файли:**
- `src/hooks/useNetInfo.ts`
- `src/components/OfflineBanner.tsx`

**Деталізація:**
- Хук слухає зміни мережі
- Банер зверху "Немає інтернету" коли офлайн
- В API клієнтах перевіряти стан перед запитом

**Запропонований commit message:** `[7.2] add offline detection and banner`

---

### Step 7.3 — Error boundaries

**Файли:**
- `src/components/ErrorBoundary.tsx`

**Деталізація:**
- Class component з `componentDidCatch`
- Обгортає корінь додатку
- При падінні показує дружній екран + "Перезапустити"

**Запропонований commit message:** `[7.3] add error boundary`

---

### Step 7.4 — Пуш-нотифікації не робимо (out of scope)

⚠️ Цей крок навмисно пропущено — не входить у вимоги.

---

### Step 7.5 — Іконка додатку та splash screen

**Файли:**
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1284x2778 або адаптивно)
- `app.json` — посилання на ассети

**Деталізація:**
- Іконка: коктейльний келих, плоский стиль
- Splash: чорний фон + лого по центру
- `expo-splash-screen` для контролю коли ховати splash

```bash
npx expo install expo-splash-screen
```

**В `App.tsx`:**
```tsx
SplashScreen.preventAutoHideAsync();
// ...
useEffect(() => {
  if (ready) SplashScreen.hideAsync();
}, [ready]);
```

**Запропонований commit message:** `[7.5] add app icon and splash screen`

---

### Step 7.6 — Loading transitions та мікроанімації

**Файли:**
- Різні екрани

**Деталізація:**
- `Animated.View` з fadeIn для контенту після завантаження
- Tab bar — анімація при переключенні (надається з коробки)
- Тап на кнопки — невелика анімація scale (Pressable's onPressIn/Out)

**Запропонований commit message:** `[7.6] add micro-animations and transitions`

---

### Step 7.7 — Validation та edge cases форм

**Файли:**
- `src/screens/JournalEntryScreen.tsx` (модифікація)

**Деталізація:**
- Назва коктейлю — required, не пуста
- Нотатки — макс 500 символів (показувати лічильник)
- Рейтинг — required, мін 1
- Кнопка "Зберегти" disabled поки не валідно
- На submit якщо помилка — `haptics.error()` + alert

**Запропонований commit message:** `[7.7] add form validation`

---

### Step 7.8 — Accessibility (a11y)

**Деталізація:**
- Усі `Pressable` мають `accessibilityRole="button"`, `accessibilityLabel`
- `<Image>` має `accessibilityLabel` (опис картинки)
- Контраст кольорів перевірити (WCAG AA)
- VoiceOver/TalkBack test scenarios

**Запропонований commit message:** `[7.8] improve accessibility`

---

### 🔍 REVISION 7 — Підсумок Фази 7

**Виконано:**
- ✅ Темна тема
- ✅ Офлайн-режим (banner + перевірки)
- ✅ Error boundary
- ✅ Іконка та splash
- ✅ Анімації
- ✅ Валідація форм
- ✅ Accessibility

**Тест-сценарій:**
1. Переключи системну тему → додаток слідує
2. Вимкни Wi-Fi → банер з'являється → перевір що Randomizer/BarFinder показують помилки
3. Викликай примусову помилку (через тимчасовий `throw`) → ErrorBoundary показує fallback
4. VoiceOver включений (iOS Settings) → таби озвучуються

**Наступне:** EAS Build для деплойменту.

---

<a name="фаза-8"></a>

## 🚢 ФАЗА 8. EAS Build & Submit

### Step 8.1 — Встановлення EAS CLI

**Дії:**
```bash
npm install -g eas-cli
eas login
```

**Запропонований commit message:** *Без коміту — це локальна команда.*

---

### Step 8.2 — Конфігурація EAS

**Дії:**
```bash
eas build:configure
```

**Файли:**
- `eas.json` (генерується автоматично)

**Деталізація — додай профілі:**
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Чому потрібен `preview` з APK:**
- Для тестування на реальних Android-пристроях БЕЗ Google Play
- AAB можна встановити лише через Play Store

**Запропонований commit message:** `[8.2] configure eas build profiles`

---

### Step 8.3 — Прев'ю-збірка Android (APK для тесту)

**Дії:**
```bash
eas build --platform android --profile preview
```

**Перевірка:**
- Білд проходить на EAS-серверах (~15-25 хв)
- Завантаж APK з посилання → встанови на Android-пристрій → перевір всі функції

**Потенційні проблеми:**
- Перший білд може впасти через місinг permissions у `app.json` — перевір
- Reanimated babel-плагін має бути ОСТАННІМ у списку плагінів — інакше білд падає на нативному рівні

**Запропонований commit message:** *Без коміту — це збірка.*

---

### Step 8.4 — Production-збірка Android (AAB)

**Дії:**
```bash
eas build --platform android --profile production
```

**Перевірка:** AAB готовий до завантаження в Google Play Console.

---

### Step 8.5 — Production-збірка iOS

⚠️ **Потрібен Apple Developer Account ($99/рік).**

**Дії:**
```bash
eas build --platform ios --profile production
```

**Перевірка:**
- EAS попросить Apple ID + App Store Connect API key
- IPA готовий

---

### Step 8.6 — Submit в магазини

**Дії:**
```bash
# Android
eas submit --platform android --latest

# iOS
eas submit --platform ios --latest
```

**Перевірка:**
- Google Play Console — додаток у статусі "В обробці"
- App Store Connect — TestFlight доступний

---

### 🔍 REVISION 8 — Підсумок Фази 8

**Виконано:**
- ✅ EAS налаштовано
- ✅ Прев'ю + production білди
- ✅ Submit в магазини (опц.)

**Наступне:** додаток у store review → реліз → моніторинг.

---

<a name="revision"></a>

## 🔄 Глобальні Revision Points

### Після Фази 3 (мінімальна демо-версія):
Додаток уже демонструє ключову відмінність від веб: shake-to-shuffle. Можна показувати як MVP, навіть без BarFinder/Journal.

### Після Фази 5:
Усі три "great mobile features" задіяні — сенсори, геолокація, камера. Це повноцінне навчальне портфоліо-демо.

### Після Фази 6:
Додаток автономний — працює без бекенду, користувач має історію взаємодій.

### Після Фази 7:
Продакшн-ready. Готовий до зовнішніх користувачів.

### Після Фази 8:
Реліз.

---

## 📊 Метрики прогресу (для самоконтролю)

| Фаза | К-ть кроків | К-ть коммітів | Складність | Залежність від попередніх |
|------|-------------|---------------|------------|---------------------------|
| 0 | 5 | 5 | 🟢 Низька | — |
| 1 | 4 | 4 | 🟢 Низька | 0 |
| 2 | 6 | 6 | 🟡 Середня | 0, 1 |
| 3 | 5 | 5 | 🟠 Висока (потребує девайс) | 0, 1, 2 |
| 4 | 7 | 7 | 🟠 Висока | 0, 1 |
| 5 | 6 | 6 | 🟠 Висока (потребує девайс) | 0, 1 |
| 6 | 8 | 8 | 🟡 Середня | 0, 1, 2, 5 |
| 7 | 8 | 7 | 🟡 Середня | усі попередні |
| 8 | 6 | 1 | 🟢 Низька (рутина) | усі попередні |
| **Σ** | **55** | **~49** | — | — |

---

## ⚠️ Чекліст перед стартом кожної сесії з Claude Code

Перед тим як давати Claude Code новий step:

1. **Перевір останній коміт:** `git log --oneline -5` — переконайся що попередній Step ти вже закомітив сам.
2. **Контекст збережено:** Claude Code має знати на якому ти кроці (скажи: "ми зараз на Step X.Y, читай секцію з ROADMAP.md").
3. **Нагадай Claude Code:** "не роби git-операції, тільки запропонуй commit message в кінці".
4. **Девайс під рукою** для кроків з сенсорами/камерою/GPS.
5. **Не починай новий Step якщо ліміт контексту > 70%** — попроси Claude Code дати фінальний блок зі статусом, закоміться сам, відкрий нову сесію.
6. **Після кожного Step:**
  - запусти `npm start` і перевір що додаток працює
  - подивись `git status` та `git diff` — переконайся що зміни логічні
  - якщо все ок → `git add .` → `git commit -m "[X.Y] ..."` (бери message з блоку Claude Code, можеш редагувати)
7. **При помилці білда** — НЕ переходь до наступного Step. Виправ (можна попросити Claude Code допомогти, але не комітьcя зі зламаним кодом).

---

## 🛟 Швидкі рецепти при поширених проблемах

### "Unable to resolve module" після додавання залежності
```bash
rm -rf node_modules .expo
npm install
npx expo start -c
```

### Білд падає на Reanimated
- Перевір що `react-native-reanimated/plugin` ОСТАННІЙ в `babel.config.js` plugins
- `npx expo start -c` (очистка кешу)

### iOS: "App Transport Security has blocked"
- Перевір що всі URLs використовують HTTPS
- TheCocktailDB і Overpass — обидва підтримують HTTPS

### Android: камера не запускається
- Перевір що permission в `app.json` додано
- Перебілди dev-client: `eas build --profile development --platform android`

### Сенсори не реагують на Expo Go
- Expo Go має обмеження для деяких нативних модулів
- Створи dev-client: `eas build --profile development`

---

## 📚 Корисні референси (з документа-завдання)

- **TheCocktailDB API:** https://www.thecocktaildb.com/api.php
- **Overpass API docs:** https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL
- **Expo SDK reference:** https://docs.expo.dev/versions/latest/
- **React Navigation:** https://reactnavigation.org/docs/getting-started/

---

## 🎯 Кінцева мета

Після виконання усіх 8 фаз ти отримаєш:

- 🔹 **Робочий React Native додаток** з нативними фічами, які НЕМОЖЛИВО реалізувати у веб-React
- 🔹 **Чисту git-історію** з ~49 атомарними комітами, кожен з яких можна ревертнути
- 🔹 **Готовий до публікації** артефакт (APK/AAB/IPA)
- 🔹 **Глибоке розуміння** відмінностей: Bridge, Native UI Tree, Permissions, FileSystem, Sensors
- 🔹 **Портфоліо-проект** з реальною цінністю для CV

Удачі! 🚀