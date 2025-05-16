// User preferences management
const DEFAULT_PREFERENCES = {
  theme: 'light',
  animationsEnabled: true,
  animationSpeed: 'normal'
};

// Function to get user preferences from localStorage
function getUserPreferences() {
  const storedPrefs = localStorage.getItem('userPreferences');
  if (storedPrefs) {
    try {
      return JSON.parse(storedPrefs);
    } catch (error) {
      console.error('Error parsing preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }
  return DEFAULT_PREFERENCES;
}

// Function to save user preferences to localStorage
function saveUserPreferences(preferences) {
  const currentPrefs = getUserPreferences();
  const updatedPrefs = { ...currentPrefs, ...preferences };
  localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
  return updatedPrefs;
}

// Function to check if animations are enabled
function isAnimationEnabled() {
  return getUserPreferences().animationsEnabled;
}

// Function to apply theme
function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    
    root.classList.remove('light', 'dark');
    root.classList.add(systemTheme);
    updateThemeIcon(systemTheme);
  } else {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    updateThemeIcon(theme);
  }
}

// Function to update theme toggle icon
function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

// Function to update animation speed
function updateAnimationSpeed(speed) {
  document.body.classList.remove('animation-speed-slow', 'animation-speed-normal', 'animation-speed-fast');
  document.body.classList.add(`animation-speed-${speed}`);
}

// Function to apply all preferences
function applyPreferences() {
  const preferences = getUserPreferences();
  
  // Apply theme
  applyTheme(preferences.theme);
  
  // Update theme toggle
  const themeToggle = document.getElementById('theme-mode');
  if (themeToggle) {
    themeToggle.checked = preferences.theme === 'dark';
  }
  
  // Update theme buttons
  setActiveButton(`theme-${preferences.theme}`);
  
  // Apply animation settings
  const animToggle = document.getElementById('animations-toggle');
  if (animToggle) {
    animToggle.checked = preferences.animationsEnabled;
  }
  
  updateAnimationSpeed(preferences.animationSpeed);
  setActiveButton(`speed-${preferences.animationSpeed}`);
  
  // Update preview buttons state
  const previewButtons = document.querySelectorAll('[data-animation]');
  previewButtons.forEach(button => {
    button.disabled = !preferences.animationsEnabled;
  });
}

// Function to trigger animation on element
function triggerAnimation(element, animationType) {
  if (!element || !isAnimationEnabled()) return;
  
  element.classList.remove('animate-pulse', 'animate-bounce', 'animate-rotate');
  
  // Force a reflow to restart the animation
  void element.offsetWidth;
  
  element.classList.add(`animate-${animationType}`);
  
  // Remove the animation class after it completes
  setTimeout(() => {
    element.classList.remove(`animate-${animationType}`);
  }, 1000);
}

// Function to set active button in a group
function setActiveButton(buttonId) {
  // Get the parent group of the button
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  const group = button.closest('.button-group');
  if (!group) return;
  
  // Remove active class from all buttons in group
  group.querySelectorAll('.animated-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to the selected button
  button.classList.add('active');
}

// Tab functionality
function setupTabs() {
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const tabId = trigger.getAttribute('data-tab');
      
      // Update active tab trigger
      tabTriggers.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');
      
      // Show active tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
    });
  });
}

// Event listeners for theme toggle
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-button');
  const themeSwitch = document.getElementById('theme-mode');
  
  themeToggleBtn.addEventListener('click', () => {
    const preferences = getUserPreferences();
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    
    saveUserPreferences({ theme: newTheme });
    applyTheme(newTheme);
    
    // Update the switch to match
    if (themeSwitch) {
      themeSwitch.checked = newTheme === 'dark';
    }
    
    // Update theme buttons
    setActiveButton(`theme-${newTheme}`);
    
    // Add animation for feedback
    themeToggleBtn.classList.add('animate-rotate');
    setTimeout(() => {
      themeToggleBtn.classList.remove('animate-rotate');
    }, 500);
  });
  
  if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
      const newTheme = themeSwitch.checked ? 'dark' : 'light';
      saveUserPreferences({ theme: newTheme });
      applyTheme(newTheme);
      setActiveButton(`theme-${newTheme}`);
    });
  }
}

// Setup theme selection buttons
function setupThemeButtons() {
  const themeButtons = {
    'theme-light': 'light',
    'theme-dark': 'dark',
    'theme-system': 'system'
  };
  
  Object.entries(themeButtons).forEach(([buttonId, theme]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
        saveUserPreferences({ theme });
        applyTheme(theme);
        setActiveButton(buttonId);
        
        // Update theme toggle to match
        const themeSwitch = document.getElementById('theme-mode');
        if (themeSwitch) {
          themeSwitch.checked = theme === 'dark' || 
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
      });
    }
  });
}

// Setup animation toggle
function setupAnimationToggle() {
  const animToggle = document.getElementById('animations-toggle');
  if (animToggle) {
    animToggle.addEventListener('change', () => {
      saveUserPreferences({ animationsEnabled: animToggle.checked });
      
      // Update preview buttons state
      const previewButtons = document.querySelectorAll('[data-animation]');
      previewButtons.forEach(button => {
        button.disabled = !animToggle.checked;
      });
    });
  }
}

// Setup animation speed buttons
function setupAnimationSpeedButtons() {
  const speedButtons = {
    'speed-slow': 'slow',
    'speed-normal': 'normal',
    'speed-fast': 'fast'
  };
  
  Object.entries(speedButtons).forEach(([buttonId, speed]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
        saveUserPreferences({ animationSpeed: speed });
        updateAnimationSpeed(speed);
        setActiveButton(buttonId);
      });
    }
  });
}

// Setup animation preview buttons
function setupAnimationPreviewButtons() {
  const previewButtons = document.querySelectorAll('[data-animation]');
  previewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const animationType = button.getAttribute('data-animation');
      if (animationType) {
        triggerAnimation(button, animationType);
      }
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved preferences
  applyPreferences();
  
  // Setup UI interactions
  setupTabs();
  setupThemeToggle();
  setupThemeButtons();
  setupAnimationToggle();
  setupAnimationSpeedButtons();
  setupAnimationPreviewButtons();
  
  // Add card animation
  const card = document.querySelector('.preferences-card');
  if (card) {
    card.classList.add('animate-slide-in');
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const preferences = getUserPreferences();
    if (preferences.theme === 'system') {
      applyTheme('system');
    }
  });
});