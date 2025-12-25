# French Translation (i18n) Implementation Plan

## Overview
Implement internationalization (i18n) for the HarakaPay mobile app with French as primary language and English as secondary. Add language switcher to allow users to toggle between languages.

## User Requirements
- **Languages**: French (primary) + English (secondary)
- **Language Switcher**: Yes, in ProfileScreen
- **Text Standardization**: Standardize all text to French
- **Implementation**: i18next + react-i18next + expo-localization

## Current State
- **No i18n libraries installed**
- **37+ files with hardcoded text** in mixed French/English
- **DEFAULT_LANGUAGE = 'fr'** already defined in constants.ts
- App designed for French-speaking users in Congo

## Implementation Steps

### Phase 1: Setup and Configuration

#### 1.1 Install Dependencies
```bash
npm install i18next react-i18next expo-localization
```

**Dependencies**:
- `i18next` - Core i18n framework
- `react-i18next` - React bindings for i18next
- `expo-localization` - System language detection

#### 1.2 Create Translation File Structure
```
src/
  locales/
    fr/
      translation.json    # French translations (primary)
      auth.json          # Auth-specific translations
      payment.json       # Payment-specific translations
      common.json        # Common UI elements
    en/
      translation.json    # English translations
      auth.json
      payment.json
      common.json
    index.ts             # Export all translations
```

**Rationale**: Namespace separation (auth, payment, common) makes translations more maintainable and allows lazy loading.

#### 1.3 Configure i18next
Create `src/config/i18n.ts`:
- Initialize i18next with French as default language
- Configure fallback to English
- Set up namespace loading
- Integrate expo-localization for system language detection
- Configure interpolation and plural rules

**Key configuration**:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import frTranslation from './locales/fr/translation.json';
import enTranslation from './locales/en/translation.json';
// ... other namespaces

const LANGUAGE_KEY = '@harakapay:language';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'fr',
    defaultNS: 'translation',
    ns: ['translation', 'auth', 'payment', 'common'],
    resources: {
      fr: { translation: frTranslation, ... },
      en: { translation: enTranslation, ... },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Detect and set language on init
export const initializeLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  const systemLanguage = Localization.locale.split('-')[0];
  const language = savedLanguage || (systemLanguage === 'fr' ? 'fr' : 'fr'); // Default to French
  await i18n.changeLanguage(language);
};

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};
```

#### 1.4 Initialize i18n in App.tsx
Update `App.tsx` to initialize i18n before rendering:
```typescript
import './src/config/i18n';
import { initializeLanguage } from './src/config/i18n';

// In App component, call initializeLanguage() during startup
```

### Phase 2: Translation Key Extraction Strategy

#### 2.1 Translation Key Naming Convention
Use hierarchical naming with screen/component prefixes:

**Pattern**: `{screen}.{section}.{element}`

**Examples**:
- `auth.login.title` → "Connexion" / "Login"
- `auth.login.emailPlaceholder` → "Adresse e-mail" / "Email address"
- `dashboard.welcome` → "Bienvenue" / "Welcome"
- `payment.plans.upfront` → "Paiement intégral" / "Full payment"
- `common.buttons.save` → "Enregistrer" / "Save"
- `common.buttons.cancel` → "Annuler" / "Cancel"

#### 2.2 Create Translation Files by Priority

**Priority 1: Auth Screens** (5 files)
- LoginScreen
- RegisterScreen
- QuickRegisterScreen
- ForgotPasswordScreen
- ResetPasswordScreen

**Priority 2: Core Parent Screens** (6 files)
- DashboardScreen
- ProfileScreen
- LinkStudentScreen
- FeeDetailsScreen
- PaymentPlansScreen
- PaymentPlanDetailsScreen

**Priority 3: Payment Screens** (3 files)
- PaymentsScreen
- PaymentHistoryScreen
- PaymentStatusScreen

**Priority 4: Components** (16 files)
- EmptyState
- ChildCard
- NotificationsTab
- SendMessageModal
- MessagesTab
- etc.

**Priority 5: Navigation** (3 files)
- TabNavigator
- MainNavigator
- AuthNavigator

#### 2.3 Sample Translation Files

**src/locales/fr/auth.json**:
```json
{
  "login": {
    "title": "Connexion",
    "emailPlaceholder": "Numéro de téléphone",
    "passwordPlaceholder": "Mot de passe",
    "loginButton": "Se connecter",
    "forgotPassword": "Mot de passe oublié?",
    "noAccount": "Pas de compte?",
    "registerLink": "S'inscrire",
    "errors": {
      "invalidCredentials": "Identifiants invalides",
      "networkError": "Erreur de connexion"
    }
  },
  "register": {
    "title": "Créer un compte",
    "firstNamePlaceholder": "Prénom",
    "lastNamePlaceholder": "Nom",
    "emailPlaceholder": "Adresse e-mail",
    "phonePlaceholder": "Numéro de téléphone",
    "passwordPlaceholder": "Mot de passe",
    "confirmPasswordPlaceholder": "Confirmer le mot de passe",
    "registerButton": "S'inscrire",
    "hasAccount": "Déjà un compte?",
    "loginLink": "Se connecter"
  }
}
```

**src/locales/en/auth.json**:
```json
{
  "login": {
    "title": "Login",
    "emailPlaceholder": "Phone number",
    "passwordPlaceholder": "Password",
    "loginButton": "Sign in",
    "forgotPassword": "Forgot password?",
    "noAccount": "No account?",
    "registerLink": "Register",
    "errors": {
      "invalidCredentials": "Invalid credentials",
      "networkError": "Connection error"
    }
  },
  "register": {
    "title": "Create account",
    "firstNamePlaceholder": "First name",
    "lastNamePlaceholder": "Last name",
    "emailPlaceholder": "Email address",
    "phonePlaceholder": "Phone number",
    "passwordPlaceholder": "Password",
    "confirmPasswordPlaceholder": "Confirm password",
    "registerButton": "Register",
    "hasAccount": "Already have an account?",
    "loginLink": "Sign in"
  }
}
```

**src/locales/fr/payment.json**:
```json
{
  "plans": {
    "upfront": {
      "title": "Paiement intégral",
      "description": "Payez le montant total en une seule transaction. Ce plan offre la meilleure valeur avec une réduction immédiate et élimine la nécessité de plusieurs paiements."
    },
    "monthly": {
      "title": "Mensuel",
      "description": "Répartissez vos paiements sur plusieurs mois avec des versements mensuels fixes. Cela facilite la budgétisation avec des montants de paiement prévisibles."
    },
    "termly": {
      "title": "Trimestriel",
      "description": "Payez par trimestre scolaire avec des versements importants mais moins fréquents. Idéal pour aligner les paiements sur les cycles scolaires."
    },
    "custom": {
      "title": "Personnalisé",
      "description": "Créez votre propre calendrier de paiement qui correspond à votre budget et vos préférences."
    }
  },
  "status": {
    "pending": "En attente",
    "completed": "Terminé",
    "failed": "Échoué"
  }
}
```

**src/locales/fr/common.json**:
```json
{
  "buttons": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "back": "Retour",
    "next": "Suivant",
    "retry": "Réessayer",
    "refresh": "Actualiser"
  },
  "labels": {
    "loading": "Chargement...",
    "error": "Erreur",
    "success": "Succès",
    "noData": "Aucune donnée disponible"
  },
  "currency": {
    "symbol": "$",
    "format": "{amount} {symbol}"
  }
}
```

### Phase 3: Component Updates

#### 3.1 Create useTranslation Hook Wrapper
Create `src/hooks/useI18n.ts`:
```typescript
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);

  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage: async (lang: string) => {
      await i18n.changeLanguage(lang);
    },
    isRTL: false, // Can be extended for RTL languages
  };
};
```

#### 3.2 Update Screen Components
**Example: LoginScreen.tsx**

Before:
```typescript
<Text style={styles.title}>Login</Text>
<TextInput placeholder="Phone number" ... />
```

After:
```typescript
import { useTranslation } from '../../hooks/useI18n';

const LoginScreen = () => {
  const { t } = useTranslation('auth');

  return (
    <>
      <Text style={styles.title}>{t('login.title')}</Text>
      <TextInput placeholder={t('login.emailPlaceholder')} ... />
    </>
  );
};
```

#### 3.3 Update Navigation Titles
**MainNavigator.tsx**:
```typescript
import { useTranslation } from 'react-i18next';

const MainNavigator = () => {
  const { t } = useTranslation('navigation');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('profile') }}
      />
      <Stack.Screen
        name="LinkStudent"
        component={LinkStudentScreen}
        options={{ title: t('linkStudent') }}
      />
      {/* ... */}
    </Stack.Navigator>
  );
};
```

### Phase 4: Language Switcher Implementation

#### 4.1 Add Language Switcher to ProfileScreen
Location: `src/screens/parent/ProfileScreen.tsx`

Add section in profile settings:
```typescript
import { useTranslation } from '../../hooks/useI18n';
import { changeLanguage } from '../../config/i18n';

const ProfileScreen = () => {
  const { t, currentLanguage } = useTranslation('profile');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await changeLanguage(lang);
  };

  return (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{t('language.title')}</Text>
      <View style={styles.languageOptions}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'fr' && styles.languageButtonActive
          ]}
          onPress={() => handleLanguageChange('fr')}
        >
          <Text style={styles.languageText}>Français</Text>
          {selectedLanguage === 'fr' && <Ionicons name="checkmark" size={20} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'en' && styles.languageButtonActive
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={styles.languageText}>English</Text>
          {selectedLanguage === 'en' && <Ionicons name="checkmark" size={20} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### Phase 5: Currency and Date Formatting

#### 5.1 Locale-Aware Formatting
Update currency and date formatting to respect language settings:

**src/utils/formatters.ts**:
```typescript
import i18n from '../config/i18n';

export const formatCurrency = (amount: number): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};
```

Apply in all screens using currency/date formatting:
- PaymentHistoryScreen
- FeeDetailsScreen
- PaymentPlansScreen
- PaymentsScreen
- etc.

### Phase 6: Testing Strategy

#### 6.1 Manual Testing Checklist
- [ ] Switch language to French - verify all text updates
- [ ] Switch language to English - verify all text updates
- [ ] Install fresh app - verify default language is French
- [ ] Test on device with French system language
- [ ] Test on device with English system language
- [ ] Verify currency formatting changes with language
- [ ] Verify date formatting changes with language
- [ ] Test language persistence (close/reopen app)

#### 6.2 Edge Cases to Test
- Long French text doesn't overflow UI
- Pluralization works correctly (1 paiement vs 2 paiements)
- Error messages display in correct language
- Navigation titles update when language changes
- Empty states display in correct language

## File Changes Summary

### New Files (7)
1. `src/config/i18n.ts` - i18n configuration
2. `src/locales/fr/translation.json` - French main translations
3. `src/locales/fr/auth.json` - French auth translations
4. `src/locales/fr/payment.json` - French payment translations
5. `src/locales/en/translation.json` - English main translations
6. `src/locales/en/auth.json` - English auth translations
7. `src/locales/en/payment.json` - English payment translations
8. `src/hooks/useI18n.ts` - Translation hook wrapper
9. `src/utils/formatters.ts` - Locale-aware formatters (or update existing)

### Modified Files (37+)
All screens and components with hardcoded text:
- 5 auth screens
- 12 parent screens
- 3 payment screens
- 16 components
- 3 navigation files
- App.tsx (initialize i18n)
- package.json (add dependencies)

## Implementation Order

1. **Setup** (Phase 1)
   - Install dependencies
   - Create file structure
   - Configure i18n
   - Initialize in App.tsx

2. **Core Translations** (Phases 2-3)
   - Create auth translations (Priority 1)
   - Update auth screens
   - Create dashboard/profile translations (Priority 2)
   - Update core screens

3. **Payment Translations** (Phase 3 continued)
   - Create payment translations (Priority 3)
   - Update payment screens
   - Apply locale-aware formatting

4. **Language Switcher** (Phase 4)
   - Add switcher to ProfileScreen
   - Implement language persistence

5. **Components & Navigation** (Phase 3 continued)
   - Update components (Priority 4)
   - Update navigation titles (Priority 5)

6. **Testing & Refinement** (Phase 6)
   - Manual testing
   - Fix layout issues
   - Adjust translations

## Estimated Effort

- **Setup & Configuration**: 1-2 hours
- **Translation File Creation**: 3-4 hours (37+ files)
- **Component Updates**: 4-6 hours
- **Language Switcher**: 1 hour
- **Formatting Updates**: 1-2 hours
- **Testing & Refinement**: 2-3 hours

**Total**: 12-18 hours

## Risk Mitigation

1. **Layout Breaking**: Test each screen after translation to ensure French text (often longer) doesn't break UI
2. **Missing Translations**: Set up fallback to English and log missing keys
3. **Pluralization**: Use i18next plural rules for items like "1 payment" vs "2 payments"
4. **Performance**: Lazy load translation namespaces if app performance degrades

## Success Criteria

- [ ] All hardcoded text replaced with translation keys
- [ ] French is default language
- [ ] Language switcher works in ProfileScreen
- [ ] Language persists across app restarts
- [ ] Currency and dates format according to selected language
- [ ] Navigation titles update when language changes
- [ ] All screens tested in both French and English
- [ ] No layout breaks in either language
- [ ] System language detection works correctly
