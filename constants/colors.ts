// Color palette for Chorely app
export const colors = {
  // Brand colors
  primary: "#FF5A87", // Pink
  secondary: "#FF8A47", // Orange
  accent: "#4ECDC4", // Teal
  
  // UI colors
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#333333",
  textLight: "#757575",
  
  // Status colors
  success: "#66BB6A",
  warning: "#FFA726",
  error: "#EF5350",
  
  // Glassmorphism
  glass: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
  glassShadow: "rgba(0, 0, 0, 0.1)",
  
  // Gradients
  gradientStart: "#FF5A87",
  gradientEnd: "#FF8A47",
};

// Gradient configurations
export const gradients = {
  primary: [colors.gradientStart, colors.gradientEnd],
  card: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.5)"],
};