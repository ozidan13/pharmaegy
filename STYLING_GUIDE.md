# Apple-Inspired UI Styling Guide

*A comprehensive design system for creating beautiful, modern interfaces inspired by Apple's design principles*

---

## 🎨 Design Philosophy

### Core Principles
- **Simplicity**: Clean, uncluttered interfaces that focus on content
- **Clarity**: Clear visual hierarchy and intuitive interactions
- **Depth**: Layered design with glassmorphism and subtle shadows
- **Motion**: Smooth, purposeful animations that enhance user experience
- **Consistency**: Unified design language across all components

---

## 🌈 Color System

### Primary Gradients
```css
/* Blue to Purple (Primary) */
bg-gradient-to-r from-blue-500 to-purple-600
bg-gradient-to-r from-blue-600 to-purple-600
bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600

/* Text Gradients */
bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent
bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
```

### Background Gradients
```css
/* Soft Background */
bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50
bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50

/* Section Indicators */
from-blue-500 to-purple-600    /* Personal Info */
from-green-500 to-blue-600     /* Contact/Location */
from-purple-500 to-pink-600    /* Security */
from-indigo-500 to-purple-600  /* Professional */
```

### Status Colors
```css
/* Success */
text-green-700, bg-green-500/10, border-green-200/50

/* Error */
text-red-700, bg-red-500/10, border-red-200/50

/* Warning */
text-yellow-700, bg-yellow-500/10, border-yellow-200/50

/* Info */
text-blue-700, bg-blue-500/10, border-blue-200/50
```

---

## 🎭 Glassmorphism Effects

### Primary Container
```css
backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl shadow-2xl
```

### Secondary Container
```css
backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl shadow-lg
```

### Card Elements
```css
backdrop-blur-sm bg-white/40 border border-white/30 rounded-3xl shadow-xl
```

### Alert/Notification
```css
backdrop-blur-sm bg-red-500/10 border border-red-200/50 rounded-2xl shadow-lg
```

---

## 📝 Form Components

### Input Fields
```css
/* Base Input */
.input-base {
  @apply peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent;
  @apply transition-all duration-300 placeholder-transparent;
}

/* Textarea */
.textarea-base {
  @apply peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent;
  @apply transition-all duration-300 placeholder-transparent resize-none;
}

/* Select */
.select-base {
  @apply peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent;
  @apply transition-all duration-300 appearance-none cursor-pointer;
}
```

### Floating Labels
```css
.floating-label {
  @apply absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent;
  @apply text-sm font-medium transition-all duration-300;
  @apply peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base;
  @apply peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r;
  @apply peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent;
}
```

---

## 🔘 Button System

### Primary Button
```css
.btn-primary {
  @apply group relative w-full flex justify-center items-center py-4 px-6;
  @apply border border-transparent rounded-2xl shadow-lg text-sm font-semibold text-white;
  @apply bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600;
  @apply hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl;
}
```

### Secondary Button
```css
.btn-secondary {
  @apply group backdrop-blur-sm bg-gradient-to-r from-green-50/50 to-green-100/50;
  @apply border border-green-200/30 p-6 rounded-xl;
  @apply hover:from-green-100/70 hover:to-green-200/70;
  @apply transition-all duration-300 hover:scale-105 hover:shadow-lg;
}
```

### Icon Button
```css
.btn-icon {
  @apply w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl;
  @apply flex items-center justify-center shadow-lg;
  @apply group-hover:scale-110 transition-transform duration-300;
}
```

---

## 🎬 Animation System

### Blob Animation
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
```

### Background Blobs
```css
/* Blob 1 */
.blob-1 {
  @apply absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full;
  @apply mix-blend-multiply filter blur-xl opacity-70 animate-blob;
}

/* Blob 2 */
.blob-2 {
  @apply absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full;
  @apply mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000;
}

/* Blob 3 */
.blob-3 {
  @apply absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full;
  @apply mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000;
}
```

### Hover Effects
```css
/* Scale on Hover */
.hover-scale {
  @apply transform transition-all duration-300 hover:scale-105;
}

/* Scale with Shadow */
.hover-scale-shadow {
  @apply transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl;
}

/* Icon Scale */
.hover-icon-scale {
  @apply group-hover:scale-110 transition-transform duration-300;
}
```

---

## 📐 Layout System

### Container
```css
.container-main {
  @apply min-h-screen relative overflow-hidden;
}

.container-content {
  @apply relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8;
}

.container-form {
  @apply max-w-2xl w-full space-y-8;
}
```

### Grid System
```css
/* Two Column Grid */
.grid-2-col {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

/* Three Column Grid */
.grid-3-col {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6;
}

/* Four Column Grid */
.grid-4-col {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}
```

### Spacing
```css
/* Section Spacing */
.section-spacing {
  @apply space-y-6;
}

/* Form Spacing */
.form-spacing {
  @apply space-y-8;
}

/* Card Spacing */
.card-spacing {
  @apply p-6;
}
```

---

## 🎯 Component Patterns

### Section Header
```jsx
<div className="flex items-center space-x-3 mb-6">
  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
  <h3 className="text-lg font-semibold text-gray-800">Section Title</h3>
</div>
```

### Icon Header
```jsx
<div className="text-center relative">
  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
    {/* Icon SVG */}
  </div>
  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
    Main Title
  </h2>
  <p className="text-gray-600 text-lg">
    Subtitle text
  </p>
</div>
```

### Status Indicator
```jsx
<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
```

### Loading Spinner
```jsx
<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Responsive Patterns
```css
/* Grid Responsive */
.responsive-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

/* Text Responsive */
.responsive-text {
  @apply text-2xl sm:text-3xl lg:text-4xl;
}

/* Spacing Responsive */
.responsive-spacing {
  @apply p-4 sm:p-6 lg:p-8;
}
```

---

## 🎨 Typography

### Headings
```css
/* Main Title */
.heading-main {
  @apply text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent;
}

/* Section Title */
.heading-section {
  @apply text-2xl font-bold text-gray-900;
}

/* Subsection Title */
.heading-subsection {
  @apply text-lg font-semibold text-gray-800;
}
```

### Body Text
```css
/* Primary Text */
.text-primary {
  @apply text-gray-900;
}

/* Secondary Text */
.text-secondary {
  @apply text-gray-600;
}

/* Muted Text */
.text-muted {
  @apply text-gray-500;
}
```

### Links
```css
.link-gradient {
  @apply font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text;
  @apply hover:from-blue-700 hover:to-purple-700 transition-all duration-300;
}
```

---

## 🛡️ Accessibility

### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2;
}
```

### Screen Reader
```css
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
}
```

---

## 🎪 Usage Examples

### Complete Form Field
```jsx
<div className="relative group">
  <input
    type="text"
    id="fieldName"
    name="fieldName"
    required
    className="peer w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-transparent"
    placeholder="Field Label"
  />
  <label
    htmlFor="fieldName"
    className="absolute left-4 -top-2.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium transition-all duration-300 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-gradient-to-r peer-focus:from-blue-600 peer-focus:to-purple-600 peer-focus:bg-clip-text peer-focus:text-transparent"
  >
    Field Label *
  </label>
</div>
```

### Dashboard Card
```jsx
<div className="backdrop-blur-sm bg-white/40 border border-white/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/50 group">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
        {/* Icon */}
      </div>
      <div className="flex-1">
        <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Label</dt>
        <dd className="text-2xl font-bold text-gray-900 mt-1">Value</dd>
      </div>
    </div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
  </div>
</div>
```

---

## 🎨 Color Palette Reference

### Primary Colors
- **Blue**: `blue-50` to `blue-900`
- **Purple**: `purple-50` to `purple-900`
- **Indigo**: `indigo-50` to `indigo-900`

### Secondary Colors
- **Green**: `green-50` to `green-900`
- **Emerald**: `emerald-50` to `emerald-900`
- **Teal**: `teal-50` to `teal-900`

### Accent Colors
- **Pink**: `pink-50` to `pink-900`
- **Yellow**: `yellow-50` to `yellow-900`
- **Red**: `red-50` to `red-900`

### Neutral Colors
- **Gray**: `gray-50` to `gray-900`
- **White**: `white` with opacity variants (`white/10`, `white/20`, `white/30`, etc.)

---

*This guide serves as a comprehensive reference for maintaining consistent, beautiful, and accessible user interfaces inspired by Apple's design philosophy.*