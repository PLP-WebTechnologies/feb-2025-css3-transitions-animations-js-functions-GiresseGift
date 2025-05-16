// A utility to handle user preferences with localStorage
type Theme = 'light' | 'dark' | 'system';
type AnimationSpeed = 'slow' | 'normal' | 'fast';
type ColorScheme = 'default' | 'blue' | 'purple' | 'green';

interface UserPreferences {
  theme: Theme;
  animationsEnabled: boolean;
  animationSpeed: AnimationSpeed;
  colorScheme: ColorScheme;
  lastUpdated: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  animationsEnabled: true,
  animationSpeed: 'normal',
  colorScheme: 'default',
  lastUpdated: Date.now()
};

// Key for storing in localStorage
const STORAGE_KEY = 'user_preferences';

// Get preferences from localStorage or return defaults
export function getUserPreferences(): UserPreferences {
  try {
    const storedPreferences = localStorage.getItem(STORAGE_KEY);
    if (storedPreferences) {
      return JSON.parse(storedPreferences) as UserPreferences;
    }
  } catch (error) {
    console.error('Failed to retrieve user preferences:', error);
  }

  return { ...DEFAULT_PREFERENCES };
}

// Save preferences to localStorage
export function saveUserPreferences(preferences: Partial<UserPreferences>): UserPreferences {
  try {
    // Get current preferences and merge with new ones
    const currentPreferences = getUserPreferences();
    const updatedPreferences: UserPreferences = {
      ...currentPreferences,
      ...preferences,
      lastUpdated: Date.now()
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
    
    return updatedPreferences;
  } catch (error) {
    console.error('Failed to save user preferences:', error);
    return getUserPreferences();
  }
}

// Set a specific preference
export function setPreference<K extends keyof UserPreferences>(
  key: K, 
  value: UserPreferences[K]
): UserPreferences {
  const update = { [key]: value } as Partial<UserPreferences>;
  return saveUserPreferences(update);
}

// Check if a specific animation is enabled
export function isAnimationEnabled(): boolean {
  const { animationsEnabled } = getUserPreferences();
  return animationsEnabled;
}

// Get animation speed modifier based on user preference
export function getAnimationSpeedClass(): string {
  const { animationSpeed } = getUserPreferences();
  
  switch (animationSpeed) {
    case 'slow':
      return 'animation-duration-slow';
    case 'fast':
      return 'animation-duration-fast';
    default:
      return '';
  }
}

// Toggle theme between light and dark
export function toggleTheme(): Theme {
  const { theme } = getUserPreferences();
  const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
  saveUserPreferences({ theme: newTheme });
  return newTheme;
}

// Toggle animations on/off
export function toggleAnimations(): boolean {
  const { animationsEnabled } = getUserPreferences();
  const newValue = !animationsEnabled;
  saveUserPreferences({ animationsEnabled: newValue });
  return newValue;
}