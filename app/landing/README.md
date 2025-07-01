# Responsive Landing Page Implementation

This implementation follows the responsive grid layout outlined in the `/newResponsiveGrid.md` file. The page is structured according to the wireframe design, with sections allocated the following percentage of screen space:

## Layout Breakdown

- **Header Section**: 8-10% of screen height
- **Hero Section**: 20-25% of screen height
- **Interactive Simulation**: 40-45% of screen height
- **Contact Section**: 15-20% of screen height

## Components Structure

### 1. Grid Layout Structure
We've implemented the grid layout using CSS Grid with responsive rows:

```css
.landingGrid {
  display: grid;
  grid-template-rows: 10% 25% 45% 20%;
  min-height: 100vh;
}
```

On mobile devices, this switches to auto-sized rows with appropriate spacing.

### 2. Interactive Simulation Demo
The interactive simulation follows the 3-column grid structure from the wireframe:

```
[ Inverter ] -- Power Flow Line --> [ Switch ]
```

- Components are positioned in their own flex containers for better responsiveness
- Power flow animation connects the inverter and switch dynamically
- Each component scales responsively based on its container dimensions

### 3. Component Sizing
We've implemented the suggested component sizing from the wireframe:

- **Inverter**: ~20-25% of screen width (max 300px)
- **Power Flow Line**: Flexible connector that grows/shrinks with available space
- **Switch**: ~10-15% of screen width (max 150px)

### 4. Responsive Behavior
The layout adapts to different screen sizes using:

- CSS Grid for the main section layout
- Flexbox for component positioning within sections
- Media queries to adjust spacing and layout on smaller screens
- Dynamic scaling of interactive components based on container dimensions

## Power Flow Animation

The power flow connector implements an animated gradient that shows energy flowing from the inverter to the switch when both components are active, creating a visual connection between the components.

## Usage

To use this responsive grid layout in other parts of the application:

1. Import the CSS module: `import styles from "./styles.module.css"`
2. Apply the grid structure: `<main className={styles.landingGrid}>...</main>`
3. Add sections with appropriate class names for spacing: `className={styles.sectionPadding}` 