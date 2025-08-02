# Charte Graphique StudioMateApp - Style Neumorphism Moderne

## 🎨 Effet Neumorphism

### Principe du Neumorphism
Le neumorphism (ou "soft UI") est un style de design qui utilise des ombres subtiles pour créer l'illusion que les éléments sortent de l'arrière-plan ou y sont enfoncés.

### Propriétés Neumorphism
- **Éléments sortants** : Ombre claire en haut-gauche, ombre sombre en bas-droite
- **Éléments enfoncés** : Ombre sombre en haut-gauche, ombre claire en bas-droite
- **Bordures arrondies** : Rayons de 20px pour un look doux
- **Couleurs neutres** : Gris clair pour light mode, gris sombre pour dark mode

## 🌈 Couleurs Vives Modernes

### Dégradés Principaux
- **Primary** : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - Bleu violet
- **Secondary** : `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` - Rose magenta
- **Accent** : `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` - Bleu ciel
- **Success** : `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)` - Vert émeraude
- **Warning** : `linear-gradient(135deg, #fa709a 0%, #fee140 100%)` - Rose orange

### Couleurs de Base
- **Light Mode** : Blanc très clair (`#fafafa`) avec gris doux
- **Dark Mode** : Gris très sombre (`#262626`) avec blanc doux

## 🎭 Classes CSS Utilitaires

### Effets Neumorphism
```css
.neu-card          /* Carte avec effet neumorphism sortant */
.neu-button        /* Bouton avec effet neumorphism */
.neu-nav           /* Navigation avec effet neumorphism */
.neu-input         /* Input avec effet neumorphism enfoncé */
```

### Dégradés de Texte
```css
.gradient-text           /* Texte avec dégradé primary */
.gradient-text-secondary /* Texte avec dégradé secondary */
.gradient-text-accent    /* Texte avec dégradé accent */
```

### Animations
```css
.float-animation     /* Animation de flottement */
.pulse-glow         /* Animation de lueur pulsante */
.gradient-animation /* Animation de dégradé */
```

## 🎯 Composants Modifiés

### 1. Sidebar (Barre de Navigation)
- ✅ Effet neumorphism avec bordures colorées
- ✅ Boutons avec dégradés vifs
- ✅ Animation de lueur au survol
- ✅ Basculeur de thème intégré

### 2. Cartes de Statistiques
- ✅ Effet neumorphism avec animation de flottement
- ✅ Titres avec dégradés de couleurs
- ✅ Icônes dans des boutons neumorphism
- ✅ Chiffres avec dégradés

### 3. Boutons
- ✅ **Primary** : Dégradé bleu violet
- ✅ **Secondary** : Dégradé rose magenta
- ✅ **Accent** : Dégradé bleu ciel
- ✅ **Success** : Dégradé vert émeraude
- ✅ **Warning** : Dégradé rose orange
- ✅ Animation de scale et ombres au survol

### 4. Badges
- ✅ Effet neumorphism avec couleurs vives
- ✅ Variantes pour chaque type de statut
- ✅ Bordures colorées

### 5. Progress Bars
- ✅ Effet neumorphism enfoncé
- ✅ Dégradé pour la progression
- ✅ Bordures arrondies

## 🎨 Classes Tailwind Personnalisées

### Couleurs Neumorphism
```css
.neu-light              /* #e6e6e6 */
.neu-dark               /* #2a2a2a */
.neu-light-inset        /* #f0f0f0 */
.neu-dark-inset         /* #2a2a2a */
```

### Ombres Neumorphism
```css
.shadow-neu-light       /* Ombre light mode */
.shadow-neu-dark        /* Ombre dark mode */
.shadow-neu-inset-light /* Ombre enfoncée light */
.shadow-neu-inset-dark  /* Ombre enfoncée dark */
.shadow-neu-hover-light /* Ombre hover light */
.shadow-neu-hover-dark  /* Ombre hover dark */
```

### Couleurs Vives
```css
.vivid-primary          /* #667eea */
.vivid-secondary        /* #f093fb */
.vivid-accent           /* #4facfe */
.vivid-success          /* #43e97b */
.vivid-warning          /* #fa709a */
```

## 🚀 Utilisation

### Exemple de Carte Neumorphism
```jsx
<Card className="neu-card float-animation">
  <CardHeader>
    <CardTitle className="gradient-text text-xl">Titre avec Dégradé</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenu avec effet neumorphism</p>
  </CardContent>
</Card>
```

### Exemple de Bouton Neumorphism
```jsx
<Button variant="accent" className="neu-button">
  Bouton Neumorphism
</Button>
```

### Exemple de Badge avec Couleur Vive
```jsx
<Badge variant="success">Status</Badge>
```

## 🎭 Variantes de Composants

### Button
- `default` : Dégradé primary avec effet neumorphism
- `secondary` : Dégradé secondary
- `accent` : Dégradé accent
- `success` : Dégradé success
- `warning` : Dégradé warning
- `outline` : Bordure colorée avec effet neumorphism
- `ghost` : Effet neumorphism au survol

### Badge
- `default` : Dégradé primary
- `secondary` : Dégradé secondary
- `accent` : Dégradé accent
- `success` : Dégradé success
- `warning` : Dégradé warning
- `outline` : Bordure colorée

### Card
- Effet neumorphism par défaut
- Animation de flottement
- Bordures colorées

## 🎨 Accessibilité

- Contraste suffisant entre les couleurs
- Indicateurs visuels clairs pour les interactions
- Animations respectueuses des préférences utilisateur
- Support des thèmes système (dark/light)

## 🔧 Personnalisation

Pour modifier les couleurs ou effets, éditez :
1. `app/globals.css` - Variables CSS et classes utilitaires
2. `tailwind.config.js` - Configuration Tailwind
3. Composants individuels dans `components/ui/`

## 🌟 Caractéristiques du Design

### Modernité
- Effet neumorphism contemporain
- Couleurs vives et dégradés dynamiques
- Animations fluides et engageantes

### Professionnalisme
- Interface claire et organisée
- Hiérarchie visuelle bien définie
- Cohérence dans tous les composants

### Interactivité
- Effets de survol sophistiqués
- Animations de feedback
- Transitions fluides

La charte graphique neumorphism offre une expérience utilisateur moderne, engageante et professionnelle avec des couleurs vives qui dynamisent l'interface tout en conservant une excellente lisibilité. 