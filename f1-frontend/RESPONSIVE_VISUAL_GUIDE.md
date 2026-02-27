# 📐 F1 Hub - Responsive Layout Visual Guide

## 🎯 Breakpoint Overview

```
Mobile          Tablet              Desktop
320px-480px     481px-1024px        1025px+
    |               |                   |
    v               v                   v
[========]    [============]    [==================]
```

---

## 📱 Navbar Transformation

### Desktop (1025px+)
```
┌─────────────────────────────────────────────────────────┐
│ [LOGO]  Home  Schedule  Teams  Drivers  Tickets  [Login]│
└─────────────────────────────────────────────────────────┘
```

### Tablet (481px-1024px)
```
┌──────────────────────────────────────────────────┐
│ [LOGO]  Home  Schedule  Teams  Drivers  [☰]     │
└──────────────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌────────────────────────┐
│ [LOGO]            [☰]  │  ← Hamburger Menu
└────────────────────────┘

When menu opens:
┌────────────────────────┐
│ [LOGO]            [✕]  │
│                        │
│  ┌──────────────────┐  │
│  │ Home             │  │
│  │ Schedule         │  │
│  │ Teams            │  │
│  │ Drivers          │  │
│  │ Tickets          │  │
│  │ News             │  │
│  │ [Login]          │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

## 🏠 Hero Section

### Desktop (1025px+)
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│  LARGE HERO IMAGE                               │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │ Hero Title (3rem)                │          │
│  │ Subtitle text                    │          │
│  └──────────────────────────────────┘          │
│                                        ● ● ○    │
└─────────────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│                  │
│  HERO IMAGE      │
│                  │
│  ┌────────────┐  │
│  │ Title      │  │
│  │ (1.5rem)   │  │
│  └────────────┘  │
│           ● ● ○  │
└──────────────────┘
```

---

## 🎯 Quick Navigation Cards

### Desktop (1025px+)
```
┌──────────────────────────────────────────────────────┐
│ [2026 SCHEDULE] [2025 STANDINGS] [LATEST NEWS] [VIDEO]│
└──────────────────────────────────────────────────────┘
```

### Tablet (481px-1024px)
```
┌─────────────────────────────────┐
│ [2026 SCHEDULE] [2025 STANDINGS]│
│ [LATEST NEWS]   [LATEST VIDEO]  │
└─────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│ [2026 SCHEDULE]  │
│ [2025 STANDINGS] │
│ [LATEST NEWS]    │
│ [LATEST VIDEO]   │
└──────────────────┘
```

---

## 🏎️ Explore F1 Cards

### Desktop (1025px+)
```
┌─────────────────────────────────────────────┐
│ ┌──────────────┐  ┌──────────────────────┐ │
│ │              │  │  Drivers             │ │
│ │   TEXT       │  │  Explore all F1...   │ │
│ │   CONTENT    │  │  [GO TO DRIVERS →]   │ │
│ │              │  │                      │ │
│ └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ┌──────────────────────┐  ┌──────────────┐ │
│ │  Teams               │  │              │ │
│ │  Discover F1...      │  │   IMAGE      │ │
│ │  [GO TO TEAMS →]     │  │              │ │
│ │                      │  │              │ │
│ └──────────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│  Drivers         │
│  Explore all...  │
│  [GO TO →]       │
├──────────────────┤
│                  │
│     IMAGE        │
│                  │
└──────────────────┘

┌──────────────────┐
│                  │
│     IMAGE        │
│                  │
├──────────────────┤
│  Teams           │
│  Discover F1...  │
│  [GO TO →]       │
└──────────────────┘
```

---

## 🎬 Featured Videos

### Desktop (1025px+)
```
┌────────────────────────────────────────────────────┐
│ [VIDEO 1] [VIDEO 2] [VIDEO 3] [VIDEO 4]           │
│  Title     Title     Title     Title               │
│  Subtitle  Subtitle  Subtitle  Subtitle            │
└────────────────────────────────────────────────────┘
```

### Tablet (481px-1024px)
```
┌─────────────────────────────┐
│ [VIDEO 1]      [VIDEO 2]    │
│  Title          Title        │
│  Subtitle       Subtitle     │
│                              │
│ [VIDEO 3]      [VIDEO 4]    │
│  Title          Title        │
│  Subtitle       Subtitle     │
└─────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│    [VIDEO 1]     │
│     Title        │
│     Subtitle     │
├──────────────────┤
│    [VIDEO 2]     │
│     Title        │
│     Subtitle     │
├──────────────────┤
│    [VIDEO 3]     │
│     Title        │
│     Subtitle     │
├──────────────────┤
│    [VIDEO 4]     │
│     Title        │
│     Subtitle     │
└──────────────────┘
```

---

## 📰 Latest News Grid

### Desktop (1025px+)
```
┌─────────────────────────────────────────┐
│ ┌──────────────────┐  ┌──────────────┐ │
│ │                  │  │  [NEWS 2]    │ │
│ │                  │  │   Title      │ │
│ │   FEATURED       │  │   Date       │ │
│ │   NEWS 1         │  ├──────────────┤ │
│ │   (Large)        │  │  [NEWS 3]    │ │
│ │                  │  │   Title      │ │
│ │                  │  │   Date       │ │
│ └──────────────────┘  └──────────────┘ │
└─────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│                  │
│  FEATURED NEWS   │
│  (Large)         │
│  Title           │
│  Date            │
└──────────────────┘

┌──────────────────┐
│  [NEWS 2]        │
│  Title           │
│  Date            │
└──────────────────┘

┌──────────────────┐
│  [NEWS 3]        │
│  Title           │
│  Date            │
└──────────────────┘
```

---

## 🖼️ Highlights Gallery

### Desktop (1025px+)
```
┌────────────────────────────────────────────────────┐
│ ← [IMG] [IMG] [IMG] [IMG] [IMG] [IMG] [IMG] →     │
└────────────────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────────────────┐
│ [IMG] [IMG] [IMG] [IMG] →    │  ← Swipe to scroll
└──────────────────────────────┘
(Arrows hidden on mobile)
```

---

## 📊 Footer Layout

### Desktop (1025px+)
```
┌─────────────────────────────────────────────────────┐
│ ┌──────────────┐  ┌──────────┐  ┌──────────────┐  │
│ │ F1 Hub       │  │ Links    │  │ Follow Us    │  │
│ │ Description  │  │ • Home   │  │ ○ ○ ○ ○      │  │
│ │              │  │ • News   │  │              │  │
│ │              │  │ • Teams  │  │              │  │
│ └──────────────┘  └──────────┘  └──────────────┘  │
│                                                     │
│ ─────────────────────────────────────────────────  │
│ © 2025 F1 Hub        Privacy | Terms | Contact     │
└─────────────────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│    F1 Hub        │
│   Description    │
│                  │
│   Quick Links    │
│   • Home         │
│   • News         │
│   • Teams        │
│                  │
│   Follow Us      │
│   ○ ○ ○ ○        │
│                  │
│ ──────────────── │
│  © 2025 F1 Hub   │
│                  │
│     Privacy      │
│     Terms        │
│     Contact      │
└──────────────────┘
```

---

## 📋 Form Elements

### Desktop (1025px+)
```
┌─────────────────────────────────┐
│ Name:  [________________]       │
│ Email: [________________]       │
│ Message: [______________]       │
│          [______________]       │
│          [______________]       │
│                                 │
│         [Submit Button]         │
└─────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│ Name:            │
│ [______________] │
│                  │
│ Email:           │
│ [______________] │
│                  │
│ Message:         │
│ [______________] │
│ [______________] │
│ [______________] │
│                  │
│ [Submit Button]  │
│  (Full Width)    │
└──────────────────┘
```

---

## 📊 Table Responsiveness

### Desktop (1025px+)
```
┌─────────────────────────────────────────┐
│ Name          | Team      | Points      │
│───────────────┼───────────┼─────────────│
│ Max Verstappen| Red Bull  | 575         │
│ Lando Norris  | McLaren   | 374         │
└─────────────────────────────────────────┘
```

### Mobile (320px-480px)
```
┌──────────────────┐
│ Name:            │
│ Max Verstappen   │
│ Team:            │
│ Red Bull         │
│ Points:          │
│ 575              │
└──────────────────┘

┌──────────────────┐
│ Name:            │
│ Lando Norris     │
│ Team:            │
│ McLaren          │
│ Points:          │
│ 374              │
└──────────────────┘
```

---

## 🎨 Typography Scaling

```
Desktop (1025px+)
─────────────────
Heading 1: 3rem (48px)
Heading 2: 2.5rem (40px)
Heading 3: 2rem (32px)
Body: 1rem (16px)

Tablet (481px-1024px)
─────────────────────
Heading 1: 2.5rem (40px)
Heading 2: 2rem (32px)
Heading 3: 1.5rem (24px)
Body: 1rem (16px)

Mobile (320px-480px)
────────────────────
Heading 1: 1.5rem (24px)
Heading 2: 1.25rem (20px)
Heading 3: 1.125rem (18px)
Body: 1rem (16px)
```

---

## 🎯 Touch Target Sizes

### Desktop
```
Button: 40px height
Link: 32px height
Icon: 24px × 24px
```

### Mobile
```
Button: 44px height (minimum)
Link: 44px height (minimum)
Icon: 44px × 44px (minimum)
```

---

## 📐 Spacing Scale

```
Desktop         Tablet          Mobile
────────────────────────────────────────
Large:  32px    24px            20px
Medium: 20px    16px            12px
Small:  12px    10px            8px
```

---

## 🎨 Grid Columns

```
Desktop (1025px+)
─────────────────
Quick Nav: 4 columns
Videos: 4 columns
News: 2 columns (2fr 1fr)

Tablet (481px-1024px)
─────────────────────
Quick Nav: 2 columns
Videos: 2 columns
News: 2 columns (2fr 1fr)

Mobile (320px-480px)
────────────────────
Quick Nav: 1 column
Videos: 1 column
News: 1 column
```

---

## 💡 Key Responsive Patterns

### 1. Stack on Mobile
```
Desktop: [A] [B] [C]
Mobile:  [A]
         [B]
         [C]
```

### 2. Reorder on Mobile
```
Desktop: [Image] [Text]
Mobile:  [Text]
         [Image]
```

### 3. Hide/Show Elements
```
Desktop: [Full Menu] [Search] [Profile]
Mobile:  [☰] [Search]
```

### 4. Collapse Sections
```
Desktop: [Section 1] [Section 2] [Section 3]
Mobile:  [▼ Section 1]
         [▼ Section 2]
         [▼ Section 3]
```

---

## 🎯 Testing Viewports

```
iPhone SE:        375px × 667px
iPhone 12:        390px × 844px
iPhone 12 Pro Max: 428px × 926px
iPad:             768px × 1024px
iPad Pro:         1024px × 1366px
Laptop:           1366px × 768px
Desktop:          1920px × 1080px
```

---

## 📱 Orientation Changes

### Portrait Mode
```
┌──────┐
│      │
│      │
│      │
│      │
│      │
└──────┘
```

### Landscape Mode
```
┌────────────┐
│            │
│            │
└────────────┘
```

Both orientations are fully supported!

---

## ✅ Responsive Checklist

- [x] Navbar adapts to screen size
- [x] Hamburger menu on mobile
- [x] Footer stacks on mobile
- [x] Content grids are flexible
- [x] Images scale properly
- [x] Typography is readable
- [x] Buttons are touch-friendly
- [x] Forms are easy to use
- [x] Tables convert to cards
- [x] No horizontal scrolling
- [x] Smooth transitions
- [x] Performance optimized

---

**Your F1 Hub is now fully responsive across all devices! 🏎️💨**

Test it at different screen sizes to see these layouts in action!
