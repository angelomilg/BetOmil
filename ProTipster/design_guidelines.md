# BetOmil Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern fintech and analytics platforms like Linear, Notion, and trading platforms to create a professional, data-driven betting analysis interface.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (BetOmil operates exclusively in dark mode):
- Background: `11 6% 5%` (#0B0B0C)
- Card Background: `220 13% 9%` (#131720)
- Primary Accent: `162 46% 60%` (#4EAB8B)
- Text Primary: `210 40% 98%` (near white)
- Text Secondary: `215 20.2% 65.1%` (muted)
- Success: `142 76% 36%` (green for wins)
- Destructive: `0 84% 60%` (red for losses)

### B. Typography
- **Primary Font**: Inter via Google Fonts
- **Headings**: Font weights 600-700, sizes from text-lg to text-4xl
- **Body**: Font weight 400-500, text-sm to text-base
- **Data/Numbers**: Font weight 600 for emphasis on statistics

### C. Layout System
**Tailwind Spacing Primitives**: Consistent use of units 2, 4, 6, and 8
- `p-4, p-6` for card padding
- `space-y-4, space-y-6` for vertical spacing
- `gap-4, gap-6` for grid/flex layouts
- `h-8, h-12` for button heights

### D. Component Library

**Navigation**: Fixed dark sidebar with betting-focused icons, clean typography
**Cards**: Elevated cards with subtle borders, rounded corners (rounded-lg)
**Data Displays**: Clean tables with zebra striping, statistical cards with large numbers
**Forms**: Dark input fields with focused border states using primary accent
**Buttons**: Primary buttons use accent color, secondary use outline variants
**Charts**: Integration with Recharts using brand color palette

## Visual Treatment

### Hero Section
Clean, professional hero without large background images. Focus on typography hierarchy and clear value proposition. Use subtle gradients from background to slightly lighter tones.

### Color Usage
- **Primary Brand**: Use `#4EAB8B` strategically for CTAs, active states, and key metrics
- **Gradients**: Subtle dark gradients (from background to card background) for depth
- **Contrast**: High contrast for readability, especially for numerical data

### Spanish Context
- All content in Spanish
- European date/time formats (DD/MM/YYYY)
- Euro currency symbols and European odds formats
- Spain-focused sports leagues and events

## Key Interface Patterns

**Dashboard Cards**: Statistics presented in clean cards with large numerical displays
**Tipster Profiles**: Professional cards showing performance metrics and rankings  
**Bet Tracking**: Tabular data with color-coded win/loss indicators
**Analytics Charts**: Dark-themed charts showing equity curves and performance trends

## Images
No large hero images required. Focus on:
- Small tipster profile avatars (circular, 40px-64px)
- Sport category icons
- Clean iconography throughout using Lucide React icons
- Charts and data visualizations as primary visual elements

The design emphasizes professionalism, data clarity, and trustworthiness appropriate for financial betting analysis.