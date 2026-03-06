# 🎨 Quick Style Reference - 2026 Premium UI

## 🚀 Quick Start

### Import Theme (Already Done)
```css
/* In src/index.css */
@import './theme.css';
```

---

## 🎯 Utility Classes Cheat Sheet

### Glass Effects
```jsx
<div className="glass">Glassmorphism effect</div>
<div className="card-glass">Glass card</div>
```

### Hover Effects
```jsx
<div className="hover-lift">Lifts on hover</div>
<div className="hover-tilt">3D tilt on hover</div>
```

### Animations
```jsx
<div className="animate-float">Floating animation</div>
<div className="animate-pulse">Pulse animation</div>
<div className="fade-in">Fade in on load</div>
<div className="slide-in">Slide in from left</div>
```

### Text Effects
```jsx
<h1 className="gradient-text">Gradient Text</h1>
```

### Glow Effects
```jsx
<div className="glow">Subtle glow</div>
<div className="glow-strong">Strong glow</div>
```

---

## 🎨 Modern Components

### Buttons
```jsx
// Primary gradient button
<button className="btn-modern btn-primary-modern">
  Click Me
</button>

// Secondary outline button
<button className="btn-modern btn-secondary-modern">
  Learn More
</button>
```

### Cards
```jsx
// Modern elevated card
<div className="card-modern">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Glass card
<div className="card-glass">
  <h3>Glass Card</h3>
  <p>Transparent blurred background</p>
</div>

// Card with hover lift
<div className="card-modern hover-lift">
  <h3>Hover Me</h3>
</div>
```

### Inputs
```jsx
// Modern input
<input 
  type="text" 
  className="input-modern" 
  placeholder="Enter text"
/>

// Floating label input
<div className="input-group-modern">
  <input type="email" placeholder=" " />
  <label>Email Address</label>
</div>
```

---

## 🎨 CSS Variables Reference

### Colors
```css
var(--primary-red)           /* #e10600 */
var(--primary-red-hover)     /* #ff1e1e */
var(--bg-dark)               /* #000000 */
var(--bg-card)               /* #1a1a1a */
var(--text-primary)          /* #ffffff */
var(--text-secondary)        /* #cfcfcf */
var(--text-muted)            /* #888888 */
```

### Gradients
```css
var(--gradient-primary)      /* Red gradient */
var(--gradient-dark)         /* Dark gradient */
var(--gradient-card)         /* Card gradient */
```

### Shadows
```css
var(--shadow-sm)             /* Small shadow */
var(--shadow-md)             /* Medium shadow */
var(--shadow-lg)             /* Large shadow */
var(--shadow-xl)             /* Extra large shadow */
var(--shadow-glow)           /* Glow effect */
```

### Border Radius
```css
var(--radius-sm)             /* 8px */
var(--radius-md)             /* 12px */
var(--radius-lg)             /* 18px */
var(--radius-xl)             /* 24px */
var(--radius-2xl)            /* 32px */
var(--radius-full)           /* 9999px (pill) */
```

### Transitions
```css
var(--transition-fast)       /* 0.2s */
var(--transition-base)       /* 0.3s */
var(--transition-slow)       /* 0.4s */
var(--transition-smooth)     /* 0.6s */
```

---

## 🎯 Common Patterns

### Hero Section
```jsx
<section className="hero-section" style={{
  background: 'linear-gradient(135deg, #000, #1a1a1a)',
  padding: 'clamp(3rem, 8vw, 6rem) 2rem'
}}>
  <h1 className="gradient-text fade-in">
    Welcome to F1 Hub
  </h1>
  <button className="btn-modern btn-primary-modern">
    Get Started
  </button>
</section>
```

### Feature Card
```jsx
<div className="card-modern hover-lift" style={{
  padding: 'var(--spacing-xl)',
  borderRadius: 'var(--radius-xl)'
}}>
  <h3>Feature Title</h3>
  <p>Feature description</p>
  <button className="btn-modern btn-primary-modern">
    Learn More
  </button>
</div>
```

### Glass Modal
```jsx
<div className="card-glass" style={{
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: 'var(--spacing-2xl)',
  maxWidth: '500px',
  width: '90%'
}}>
  <h2>Modal Title</h2>
  <p>Modal content</p>
  <button className="btn-modern btn-primary-modern">
    Close
  </button>
</div>
```

### Loading Skeleton
```jsx
<div className="skeleton" style={{
  height: '200px',
  borderRadius: 'var(--radius-lg)'
}}></div>
```

---

## 🎨 Inline Style Examples

### Gradient Background
```jsx
<div style={{
  background: 'var(--gradient-primary)',
  padding: '2rem',
  borderRadius: 'var(--radius-xl)'
}}>
  Content
</div>
```

### Glass Effect
```jsx
<div style={{
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  padding: '2rem',
  borderRadius: 'var(--radius-xl)'
}}>
  Glass content
</div>
```

### Hover Glow
```jsx
<button style={{
  background: 'var(--gradient-primary)',
  border: 'none',
  padding: '1rem 2rem',
  borderRadius: 'var(--radius-full)',
  color: 'white',
  cursor: 'pointer',
  transition: 'var(--transition-base)'
}}
onMouseEnter={(e) => {
  e.target.style.boxShadow = 'var(--shadow-glow-strong)';
  e.target.style.transform = 'translateY(-3px)';
}}
onMouseLeave={(e) => {
  e.target.style.boxShadow = 'none';
  e.target.style.transform = 'translateY(0)';
}}>
  Hover Me
</button>
```

---

## 🎯 Responsive Utilities

### Responsive Padding
```jsx
<div style={{
  padding: 'clamp(1rem, 4vw, 3rem)'
}}>
  Responsive padding
</div>
```

### Responsive Font Size
```jsx
<h1 style={{
  fontSize: 'clamp(1.5rem, 5vw, 3rem)'
}}>
  Responsive heading
</h1>
```

### Responsive Grid
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 'clamp(1rem, 3vw, 2rem)'
}}>
  <div className="card-modern">Card 1</div>
  <div className="card-modern">Card 2</div>
  <div className="card-modern">Card 3</div>
</div>
```

---

## 🎨 Animation Examples

### Fade In on Mount
```jsx
import { useEffect, useState } from 'react';

function Component() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setShow(true);
  }, []);
  
  return (
    <div className={show ? 'fade-in' : ''}>
      Content
    </div>
  );
}
```

### Hover Animation
```jsx
<div 
  className="card-modern"
  style={{
    transition: 'var(--transition-base)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-10px)';
    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
  }}
>
  Hover me
</div>
```

---

## 🎯 Form Styling

### Modern Form
```jsx
<form className="card-glass" style={{
  padding: 'var(--spacing-2xl)',
  maxWidth: '500px',
  margin: '0 auto'
}}>
  <h2 className="gradient-text">Contact Us</h2>
  
  <div className="input-group-modern">
    <input type="text" placeholder=" " />
    <label>Full Name</label>
  </div>
  
  <div className="input-group-modern">
    <input type="email" placeholder=" " />
    <label>Email Address</label>
  </div>
  
  <textarea 
    className="input-modern" 
    rows="5"
    placeholder="Your message"
  ></textarea>
  
  <button className="btn-modern btn-primary-modern" type="submit">
    Send Message
  </button>
</form>
```

---

## 🎨 Dark Mode Toggle (Optional)

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <button 
      className="btn-modern btn-secondary-modern"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

---

## 🚀 Performance Tips

### GPU Acceleration
```jsx
<div className="gpu-accelerated">
  Smooth animations
</div>
```

### Lazy Load Images
```jsx
<img 
  src="image.jpg" 
  loading="lazy"
  style={{
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)'
  }}
/>
```

---

## 📱 Mobile-First Examples

### Responsive Container
```jsx
<div style={{
  maxWidth: '1400px',
  margin: '0 auto',
  padding: 'clamp(1rem, 4vw, 3rem)'
}}>
  Content
</div>
```

### Responsive Grid
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 'clamp(1rem, 3vw, 2rem)'
}}>
  {/* Cards */}
</div>
```

---

## 🎯 Common Combinations

### Premium Card
```jsx
<div className="card-modern hover-lift glass">
  <h3 className="gradient-text">Premium Feature</h3>
  <p>Description here</p>
  <button className="btn-modern btn-primary-modern">
    Learn More
  </button>
</div>
```

### Animated Section
```jsx
<section className="fade-in" style={{
  padding: 'clamp(3rem, 8vw, 6rem) 2rem',
  background: 'var(--gradient-dark)'
}}>
  <h2 className="gradient-text">Section Title</h2>
  <div className="card-glass hover-lift">
    Content
  </div>
</section>
```

---

## 💡 Pro Tips

1. **Use CSS Variables** for consistency
2. **Combine utility classes** for complex effects
3. **Use clamp()** for responsive sizing
4. **Add transitions** to all interactive elements
5. **Test on mobile** devices
6. **Use GPU acceleration** for smooth animations
7. **Keep animations subtle** for better UX

---

## 🎉 Quick Copy-Paste Templates

### Hero Section
```jsx
<section style={{
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--gradient-dark)',
  padding: 'clamp(2rem, 6vw, 4rem)'
}}>
  <div style={{ textAlign: 'center', maxWidth: '800px' }}>
    <h1 className="gradient-text fade-in">
      Welcome to F1 Hub
    </h1>
    <p style={{ 
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: 'var(--text-secondary)',
      margin: '2rem 0'
    }}>
      Your ultimate Formula 1 experience
    </p>
    <button className="btn-modern btn-primary-modern">
      Get Started
    </button>
  </div>
</section>
```

### Feature Grid
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
  padding: 'clamp(2rem, 5vw, 4rem)'
}}>
  {[1, 2, 3].map(i => (
    <div key={i} className="card-modern hover-lift">
      <h3>Feature {i}</h3>
      <p>Description here</p>
    </div>
  ))}
</div>
```

---

**Happy Styling! 🎨✨**
