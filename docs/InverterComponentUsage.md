# Enhanced StaticInverterNode Component

The StaticInverterNode component has been restructured to provide more flexible positioning options, improved scaling, and better responsiveness within various container contexts.

## Features

- **Flexible Positioning**: The inverter can be positioned with absolute or relative positioning
- **Automatic Center Calculation**: The component calculates its center point based on actual dimensions
- **Parent Container Integration**: Can be positioned relative to its parent container rather than with fixed coordinates
- **Responsive Scaling**: Properly scales all internal elements based on the parent scale factor
- **Custom Styling**: Supports additional styling via className and style props

## Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| position | `{ x: number, y: number }` | - | Position coordinates for the component |
| inverterOn | boolean | - | Whether the inverter is powered on |
| onInverterChange | function | - | Callback when inverter power state changes |
| scale | number | 0.35 | Scale factor for the entire component |
| fixedPosition | boolean | true | When true, position is absolute with x,y coords. When false, position is based on parent layout |
| centerOrigin | boolean | true | When true, the component's transform origin is centered. When false, origin is at top-left |
| constrainToParent | boolean | false | When true, ensures the inverter stays within its parent container bounds |
| className | string | "" | Additional CSS class names |
| style | object | {} | Additional inline styles |

Plus additional props for controlling the inverter's state (gridConnected, solarConnected, etc.)

## Usage Examples

### Basic Usage with Fixed Position

```jsx
<StaticInverterNode
  position={{ x: 400, y: 300 }} // Center coordinates
  inverterOn={isOn}
  onInverterChange={setIsOn}
  scale={0.8}
/>
```

### Relative Positioning Within a Container

```jsx
<div className="relative w-[500px] h-[600px]">
  <StaticInverterNode
    fixedPosition={false}
    className="flex items-center justify-center w-full h-full"
    position={{ x: 0, y: 0 }} // Ignored when fixedPosition is false
    inverterOn={isOn}
    onInverterChange={setIsOn}
    scale={0.7}
  />
</div>
```

### Custom Styling

```jsx
<StaticInverterNode
  position={{ x: 400, y: 300 }}
  inverterOn={isOn}
  onInverterChange={setIsOn}
  scale={0.6}
  className="my-custom-class"
  style={{
    filter: isOn ? "drop-shadow(0 0 20px rgba(74, 222, 128, 0.4))" : "none",
    transition: "filter 0.5s ease-in-out"
  }}
/>
```

### Responsive Scaling Based on Container Size

```jsx
const containerWidth = 800;
const containerHeight = 600;

// Calculate optimal scale based on container dimensions
const getOptimalScale = () => {
  return Math.max(
    0.4,
    Math.min(containerWidth / 1400, containerHeight / 900)
  );
};

<StaticInverterNode
  position={{ x: containerWidth / 2, y: containerHeight / 2 }}
  inverterOn={isOn}
  onInverterChange={setIsOn}
  scale={getOptimalScale()}
/>
```

## Internal Structure

The component calculates its dimensions based on the provided scale:

```javascript
const BASE_WIDTH = 400;  // Width at scale 1.0
const BASE_HEIGHT = 590; // Height at scale 1.0

// Calculate actual dimensions
const inverterWidth = BASE_WIDTH * scale;
const inverterHeight = BASE_HEIGHT * scale;

// Calculate center point
const centerX = inverterWidth / 2;
const centerY = inverterHeight / 2;
```

This ensures that all internal elements are properly scaled and positioned relative to the component's overall dimensions.

## Best Practices

1. **Choose the right positioning mode**:
   - Use `fixedPosition={true}` when you need precise x/y coordinate positioning
   - Use `fixedPosition={false}` when you want the component to follow parent container layout

2. **Calculate appropriate scale**:
   - For responsive layouts, calculate scale based on container dimensions
   - Consider device type (mobile vs desktop) when determining scale

3. **Access center point data attributes if needed**:
   - The component exposes `data-center-x` and `data-center-y` attributes
   - These can be useful for positioning other elements relative to the inverter 