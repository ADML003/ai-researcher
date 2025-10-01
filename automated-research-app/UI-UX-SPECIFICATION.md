# 🎨 Apple-Inspired UI/UX Design Specification

## 📱 Layout Architecture

### 1. **Primary Navigation Structure**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Top Status Bar                              │
├─────────────┬───────────────────────────────────────────────────────┤
│             │                                                       │
│   SIDEBAR   │                MAIN WORKSPACE                         │
│             │                                                       │
│   • Home    │  ┌─────────────────────────────────────────────────┐  │
│   • Research│  │            PRIMARY CONTENT                      │  │
│   • Dashboard│  │                                                 │  │
│   • Workflows│  └─────────────────────────────────────────────────┘  │
│   • Interview│                                                       │
│   • Reports │  ┌─────────────────────────────────────────────────┐  │
│   • Analytics│  │           SECONDARY PANEL                      │  │
│   • Settings│  │         (Context Dependent)                     │  │
│             │  └─────────────────────────────────────────────────┘  │
└─────────────┴───────────────────────────────────────────────────────┘
```

## 🎯 Feature Placement Strategy

### **Sidebar Navigation (Left Panel - 256px)**

- **Fixed position** with smooth slide animations
- **Collapsible** on mobile (hamburger menu)
- **Badge indicators** for live features

### **Main Content Areas by Feature:**

#### 1. **🔬 Research Page** (Primary Landing)

```
┌─────────────────────────────────────────────────────────────┐
│  Hero Section: "Discover User Insights In Minutes"          │
├─────────────────────────────────────────────────────────────┤
│  Enhanced Form Card (Center, max-width: 800px)              │
│  • Research Question (Large textarea)                       │
│  • Target Demographic (Smart suggestions)                   │
│  • Advanced Options (Collapsible)                          │
├─────────────────────────────────────────────────────────────┤
│  Research Templates Grid (3 columns)                        │
│  • "Developer Onboarding" • "Product Feedback"             │
│  • "User Journey" • "Feature Validation" • "Custom"       │
└─────────────────────────────────────────────────────────────┘
```

#### 2. **📊 Dashboard Page** (Live Monitoring)

```
┌─────────────────────────────────────────────────────────────┐
│  Stats Bar: Active Studies | Interviews | Insights          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐ │
│  │   Live Interviews   │  │        Recent Insights          │ │
│  │   • Persona Cards   │  │        • Trending Topics        │ │
│  │   • Progress Bars   │  │        • Sentiment Analysis     │ │
│  │   • Real-time Chat  │  │        • Action Items           │ │
│  └─────────────────────┘  └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Study Timeline (Horizontal scroll)                         │
│  • Past 7 days • Completed • In Progress • Scheduled       │
└─────────────────────────────────────────────────────────────┘
```

#### 3. **⚡ Workflow Builder** (Visual Editor)

```
┌─────────────────────────────────────────────────────────────┐
│         Toolbar: Save | Load | Export | Share               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐  ┌───────────────┐ │
│  │                                     │  │  Properties   │ │
│  │        React Flow Canvas            │  │  Panel        │ │
│  │                                     │  │               │ │
│  │  [Config] → [Personas] → [Interview]│  │  • Node Props │ │
│  │     ↓                               │  │  • Connections│ │
│  │  [Analysis] → [Report]              │  │  • Settings   │ │
│  │                                     │  │               │ │
│  └─────────────────────────────────────┘  └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Node Palette: Drag & Drop Components                       │
└─────────────────────────────────────────────────────────────┘
```

#### 4. **👥 Interviews Page** (Hybrid Management)

```
┌─────────────────────────────────────────────────────────────┐
│  Tabs: AI Interviews | Human Sessions | Hybrid Studies      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐ │
│  │   Session List      │  │      Chat Interface             │ │
│  │   • Active Sessions │  │      ┌─────────────────────────┐ │ │
│  │   • Participant     │  │      │  [AI] Hello! I'm Sarah  │ │ │
│  │     Queue           │  │      │  How can I help?        │ │ │
│  │   • Room Management │  │      └─────────────────────────┘ │ │
│  │                     │  │      ┌─────────────────────────┐ │ │
│  │   Filters:          │  │      │  [Human] Tell me about  │ │ │
│  │   □ Live            │  │      │  your workflow...       │ │ │
│  │   □ Scheduled       │  │      └─────────────────────────┘ │ │
│  │   □ Completed       │  │                                 │ │
│  └─────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 5. **📋 Reports Page** (Insights & Export)

```
┌─────────────────────────────────────────────────────────────┐
│  Export Bar: PDF | PowerPoint | Notion | Share Link         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐ │
│  │   Report Library    │  │        Live Report Preview      │ │
│  │   • Auto-generated  │  │                                 │ │
│  │   • Custom Templates│  │  📊 Executive Summary           │ │
│  │   • Scheduled       │  │  📈 Key Metrics                │ │
│  │                     │  │  🎯 User Personas              │ │
│  │   Filters:          │  │  💬 Interview Highlights        │ │
│  │   📅 Date Range     │  │  🔍 Deep Insights              │ │
│  │   🏷️ Tags          │  │  📋 Recommendations            │ │
│  │   👥 Demographic    │  │                                 │ │
│  └─────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Visual Design System

### **Color Palette**

```css
Primary: #3B82F6 → #8B5CF6 (Blue to Purple gradient)
Success: #10B981 → #059669 (Emerald gradient)
Warning: #F59E0B → #D97706 (Amber gradient)
Error: #EF4444 → #DC2626 (Red gradient)

Neutrals:
- Gray 50: #F9FAFB (Light background)
- Gray 100: #F3F4F6 (Card backgrounds)
- Gray 200: #E5E7EB (Borders)
- Gray 700: #374151 (Text)
- Gray 900: #111827 (Dark text)
```

### **Typography Scale**

```css
Hero: 3.5rem (56px) - font-bold
H1: 2.25rem (36px) - font-bold
H2: 1.875rem (30px) - font-semibold
H3: 1.5rem (24px) - font-semibold
Body: 1rem (16px) - font-normal
Small: 0.875rem (14px) - font-medium
Caption: 0.75rem (12px) - font-medium
```

### **Spacing System**

```css
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

### **Component Specifications**

#### **Cards**

- **Radius**: 1rem (16px) for small cards, 1.5rem (24px) for large
- **Shadow**: 0 10px 25px rgba(0,0,0,0.1)
- **Hover**: Scale 1.02, shadow increase
- **Border**: 1px solid gray-200/gray-700

#### **Buttons**

- **Primary**: Gradient background, white text, 12px radius
- **Secondary**: Gray background, hover state
- **Ghost**: Transparent, hover background
- **Icon**: 40x40px, circular, subtle shadow

#### **Inputs**

- **Height**: 48px for standard inputs
- **Padding**: 16px horizontal
- **Border**: 1px solid, focus ring 2px blue
- **Radius**: 12px

## 📱 Responsive Breakpoints

```css
Mobile: 0px - 768px
  - Sidebar collapses to overlay
  - Single column layouts
  - Touch-optimized buttons (44px min)

Tablet: 768px - 1024px
  - Sidebar remains visible
  - 2-column layouts where appropriate
  - Adjusted spacing

Desktop: 1024px+
  - Full layout as designed
  - Multi-column grids
  - Hover states active
```

## 🎭 Interaction Patterns

### **Navigation Flow**

1. **Home** → Quick research setup
2. **Research** → Detailed configuration
3. **Dashboard** → Monitor progress
4. **Workflows** → Customize processes
5. **Interviews** → Manage sessions
6. **Reports** → View & export results

### **Progressive Disclosure**

- **Basic Form** → Advanced options (collapsible)
- **Summary Cards** → Detailed views (drill-down)
- **Quick Actions** → Full feature sets (modal/drawer)

### **Feedback Systems**

- **Loading States**: Skeleton screens, progress bars
- **Success States**: Green checkmarks, confetti animations
- **Error States**: Red indicators, helpful messages
- **Empty States**: Illustrated placeholders with actions

## 🚀 Implementation Priority

### **Phase 1: Core Layout** (Week 1)

- Sidebar navigation
- Enhanced header
- Basic page layouts

### **Phase 2: Enhanced Components** (Week 2)

- Improved form design
- Dashboard widgets
- Real-time updates

### **Phase 3: Advanced Features** (Week 3-4)

- Workflow builder interface
- Hybrid interview UI
- Report generation

This design maintains Apple's principles of **simplicity**, **clarity**, and **depth** while accommodating all the advanced features you want to implement.
