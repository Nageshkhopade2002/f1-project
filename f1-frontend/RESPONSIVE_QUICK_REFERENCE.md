# 🚀 Responsive Utilities - Quick Reference

## 📦 Container Classes

```html
<div class="container">        <!-- Max-width: 1400px, centered -->
<div class="container-fluid">  <!-- Full width with padding -->
```

---

## 📐 Grid System

```html
<!-- Auto-fit grid (responsive by default) -->
<div class="grid grid-2">  <!-- Min 250px per column -->
<div class="grid grid-3">  <!-- Min 200px per column -->
<div class="grid grid-4">  <!-- Min 180px per column -->
```

---

## 🎨 Flexbox Utilities

```html
<div class="flex">              <!-- Display flex with gap -->
<div class="flex flex-wrap">    <!-- Flex with wrap -->
<div class="flex flex-column">  <!-- Flex column -->
<div class="flex flex-center">  <!-- Center items -->
<div class="flex flex-between"> <!-- Space between -->
```

---

## 📏 Spacing (Responsive)

### Padding
```html
<div class="p-sm">  <!-- Small padding -->
<div class="p-md">  <!-- Medium padding -->
<div class="p-lg">  <!-- Large padding -->
```

### Margin
```html
<div class="m-sm">   <!-- Small margin -->
<div class="m-md">   <!-- Medium margin -->
<div class="m-lg">   <!-- Large margin -->
<div class="mt-md">  <!-- Margin top -->
<div class="mb-lg">  <!-- Margin bottom -->
```

---

## 📝 Typography (Fluid Sizing)

```html
<p class="text-xs">    <!-- Extra small -->
<p class="text-sm">    <!-- Small -->
<p class="text-base">  <!-- Base (default) -->
<p class="text-lg">    <!-- Large -->
<p class="text-xl">    <!-- Extra large -->
<p class="text-2xl">   <!-- 2X large -->
<p class="text-3xl">   <!-- 3X large -->

<p class="font-normal">   <!-- 400 -->
<p class="font-medium">   <!-- 500 -->
<p class="font-semibold"> <!-- 600 -->
<p class="font-bold">     <!-- 700 -->
<p class="font-black">    <!-- 900 -->
```

---

## 🔘 Buttons (Touch-Friendly)

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-primary btn-full">Full Width</button>
```

---

## 🃏 Cards

```html
<div class="card">
  <img src="..." class="card-img" alt="...">
  <div class="card-body">
    <h3>Card Title</h3>
    <p>Card content</p>
  </div>
</div>
```

---

## 📋 Forms (Mobile-Optimized)

```html
<div class="form-group">
  <label class="form-label">Name</label>
  <input type="text" class="form-input" placeholder="Enter name">
</div>

<div class="form-group">
  <label class="form-label">Message</label>
  <textarea class="form-textarea"></textarea>
</div>

<button class="btn btn-primary btn-full">Submit</button>
```

---

## 📊 Tables (Responsive)

```html
<!-- Desktop: Table view -->
<div class="table-container table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Team</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Max Verstappen</td>
        <td>Red Bull</td>
        <td>575</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Mobile: Card view -->
<div class="table-cards">
  <div class="table-card">
    <div class="table-card-row">
      <span class="table-card-label">Name</span>
      <span class="table-card-value">Max Verstappen</span>
    </div>
    <div class="table-card-row">
      <span class="table-card-label">Team</span>
      <span class="table-card-value">Red Bull</span>
    </div>
    <div class="table-card-row">
      <span class="table-card-label">Points</span>
      <span class="table-card-value">575</span>
    </div>
  </div>
</div>
```

---

## 🖼️ Images

```html
<img src="..." class="img-responsive" alt="...">  <!-- Max-width: 100% -->
<img src="..." class="img-cover" alt="...">       <!-- Object-fit: cover -->
<img src="..." class="img-contain" alt="...">     <!-- Object-fit: contain -->
```

---

## 👁️ Visibility Control

```html
<!-- Hide on mobile, show on desktop -->
<div class="hide-mobile">Desktop content</div>

<!-- Show only on mobile -->
<div class="show-mobile">Mobile content</div>

<!-- Hide on tablet -->
<div class="hide-tablet">Not for tablets</div>

<!-- Show only on tablet -->
<div class="show-tablet">Tablet only</div>

<!-- Hide on desktop -->
<div class="hide-desktop">Mobile/Tablet only</div>

<!-- Show only on desktop -->
<div class="show-desktop">Desktop only</div>
```

---

## 📦 Sections

```html
<section class="section">
  <h2 class="section-title">Section Title</h2>
  <p class="section-subtitle">Subtitle text</p>
  <!-- Content -->
</section>
```

---

## 🪟 Modals

```html
<div class="modal">
  <div class="modal-content">
    <button class="modal-close">×</button>
    <h2>Modal Title</h2>
    <p>Modal content</p>
  </div>
</div>
```

---

## ⏳ Loading States

```html
<div class="loading">Loading...</div>

<div class="spinner"></div>
```

---

## 🎯 Custom Responsive CSS

### Using clamp() for Fluid Sizing
```css
.my-element {
  /* Fluid font size: min 1rem, preferred 2.5vw, max 1.5rem */
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  
  /* Fluid padding */
  padding: clamp(12px, 3vw, 24px);
  
  /* Fluid gap */
  gap: clamp(8px, 2vw, 16px);
}
```

### Media Queries
```css
/* Mobile (320px - 480px) */
@media (max-width: 480px) {
  .my-element {
    /* Mobile styles */
  }
}

/* Tablet (481px - 1024px) */
@media (min-width: 481px) and (max-width: 1024px) {
  .my-element {
    /* Tablet styles */
  }
}

/* Desktop (1025px+) */
@media (min-width: 1025px) {
  .my-element {
    /* Desktop styles */
  }
}
```

### Auto-Fit Grid
```css
.my-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(12px, 2vw, 20px);
}
```

---

## 🎨 F1 Hub Specific Classes

### Section Heading with Red Line
```html
<h2 class="section-heading">
  <span class="red-line"></span>
  SECTION TITLE
</h2>
```

### Quick Navigation Cards
```html
<div class="quick-nav-section">
  <div class="quick-nav-container">
    <div class="quick-nav-card">
      <span>2026 SCHEDULE</span>
      <div class="nav-external-icon">↗</div>
    </div>
  </div>
</div>
```

### Explore F1 Cards
```html
<section class="explore-f1-section">
  <div class="explore-f1-card">
    <div class="explore-text">
      <h2>Title</h2>
      <p>Description</p>
      <button>GO TO PAGE →</button>
    </div>
    <div class="explore-image">
      <img src="..." alt="...">
    </div>
  </div>
</section>
```

---

## 💡 Pro Tips

### 1. Mobile-First Approach
```css
/* ✅ Good: Mobile first */
.element {
  padding: 1rem; /* Mobile */
}

@media (min-width: 768px) {
  .element {
    padding: 2rem; /* Desktop */
  }
}

/* ❌ Avoid: Desktop first */
.element {
  padding: 2rem; /* Desktop */
}

@media (max-width: 767px) {
  .element {
    padding: 1rem; /* Mobile */
  }
}
```

### 2. Use Semantic HTML
```html
<!-- ✅ Good -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- ❌ Avoid -->
<div class="nav">
  <div class="nav-item">
    <a href="/">Home</a>
  </div>
</div>
```

### 3. Touch-Friendly Targets
```css
/* Minimum 44x44px for touch targets */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

### 4. Prevent Input Zoom on iOS
```css
/* Set font-size to 16px or larger */
input, select, textarea {
  font-size: 16px;
}
```

### 5. Optimize Images
```html
<!-- Use srcset for responsive images -->
<img 
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 480px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Description"
  class="img-responsive"
>
```

---

## 🔍 Testing Checklist

- [ ] Test on real mobile devices
- [ ] Check landscape and portrait modes
- [ ] Verify touch targets are 44x44px minimum
- [ ] Ensure no horizontal scrolling
- [ ] Test form inputs (no zoom on focus)
- [ ] Verify images scale properly
- [ ] Check navigation on all screen sizes
- [ ] Test with slow network (3G)
- [ ] Verify accessibility (keyboard navigation)
- [ ] Check color contrast ratios

---

## 📱 Device Testing Sizes

### Common Mobile Devices
- iPhone SE: 375px
- iPhone 12/13: 390px
- iPhone 12/13 Pro Max: 428px
- Samsung Galaxy S21: 360px
- Google Pixel 5: 393px

### Common Tablets
- iPad: 768px
- iPad Pro 11": 834px
- iPad Pro 12.9": 1024px
- Samsung Galaxy Tab: 800px

### Common Desktops
- Laptop: 1366px
- Desktop: 1920px
- Large Desktop: 2560px

---

## 🎯 Performance Tips

1. **Use CSS transforms** instead of position changes
2. **Minimize reflows** by batching DOM changes
3. **Optimize images** for different screen sizes
4. **Use CSS Grid/Flexbox** instead of floats
5. **Lazy load images** below the fold
6. **Minimize JavaScript** for responsive behavior
7. **Use will-change** sparingly for animations

---

## 📚 Additional Resources

- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web.dev: Responsive Images](https://web.dev/responsive-images/)

---

**Quick Start:**
1. Import `responsive.css` in your main file
2. Use utility classes for common patterns
3. Write custom CSS for specific needs
4. Test on multiple devices
5. Optimize for performance

**Happy Coding! 🏎️💨**
