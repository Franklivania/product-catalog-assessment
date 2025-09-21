<img width="1890" height="1175" alt="image" src="https://github.com/user-attachments/assets/cd92d0d7-f8b6-473c-97b9-bf23bddb7699" />

# Product Catalog Assessment

A modern, responsive e-commerce product catalog built with React and Vite. This application demonstrates advanced frontend development practices including state management, search functionality, filtering, sorting, and comprehensive UI components.
[Live Link](https://subtle-elf-d055ea.netlify.app/)

## 🚀 Project Description

This is a comprehensive product catalog application that showcases modern React development patterns. The application fetches product data from the [EscuelaJS API](https://api.escuelajs.co/api/v1/products) and provides users with a rich shopping experience including:

- **Real-time Search**: Advanced search functionality with debouncing and multi-field matching
- **Filtering & Sorting**: Category-based filtering and multiple sorting options
- **Shopping Cart**: Full cart management with Zustand state management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Loading States**: Skeleton loaders for optimal user experience
- **Accessibility**: WCAG compliant components with proper ARIA labels

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.6** - Fast build tool and development server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Zustand 5.0.8** - Lightweight state management
- **SWR 2.3.6** - Data fetching with caching and revalidation

### UI Components
- **@iconify/react** - Comprehensive icon library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class name utilities
- **sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Type safety and IntelliSense
- **tw-animate-css** - Tailwind animation utilities

### API
- **EscuelaJS API** - [https://api.escuelajs.co/api/v1/products](https://api.escuelajs.co/api/v1/products)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun package manager

### Using npm
```bash
# Clone the repository
git clone <repository-url>
cd product-catalog-assessment

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using bun (recommended)
```bash
# Clone the repository
git clone <repository-url>
cd product-catalog-assessment

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## 🏃‍♂️ Running Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-catalog-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📚 Project Documentation

This project includes comprehensive documentation for various components and systems:

### Core Systems
- **[Cart System](./src/store/cart-readme.md)** - Complete cart management with Zustand
- **[Search System](./src/utils/search-readme.md)** - Advanced search functionality
- **[Skeleton Components](./src/components/skeleton/skeleton-readme.md)** - Loading state components
- **[Typography Components](./src/components/typography/README.md)** - Accessible typography system

### Key Features
- **State Management**: Zustand stores for cart and wishlist
- **Search & Filtering**: Multi-field search with debouncing and ranking
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized with SWR caching and skeleton loaders

## 🎯 Assumptions Made

### API Integration
- **Data Source**: Uses EscuelaJS API for product data
- **Caching**: SWR handles data fetching and caching automatically
- **Error Handling**: Graceful fallbacks for API failures

### User Experience
- **Search Behavior**: Debounced search with 150ms delay
- **Filtering**: Category-based filtering with price range support
- **Sorting**: Multiple sort options (price, name, category)
- **Cart Persistence**: Local storage for cart state

### Technical Decisions
- **State Management**: Zustand for lightweight, performant state
- **Styling**: Tailwind CSS for consistent, responsive design
- **Icons**: Iconify for comprehensive icon library
- **Type Safety**: TypeScript for development experience

## 📸 Screenshots

- Main product catalog view
  <img width="1890" height="1175" alt="image" src="https://github.com/user-attachments/assets/77e4a109-784c-481a-9ee6-85cfcd665d23" />

- Search functionality
  <img width="1522" height="609" alt="image" src="https://github.com/user-attachments/assets/45eec2fa-21b0-4c17-9305-7d09c2d8bfba" />

- Filter and sort options
  <img width="1522" height="609" alt="image" src="https://github.com/user-attachments/assets/8fbdd778-9e70-4cfd-a15f-179b0d83b30b" />
  <img width="1465" height="1094" alt="image" src="https://github.com/user-attachments/assets/ca793ee8-86d8-4cc5-b9b5-bc42e3fea540" />


- Shopping cart interface
  <img width="1888" height="1120" alt="image" src="https://github.com/user-attachments/assets/118a8524-7978-488c-8f38-d1a53de675e0" />

- Wishlist Interface
  <img width="1712" height="1137" alt="image" src="https://github.com/user-attachments/assets/976e4858-acbe-461d-9837-415cf9704773" />


- Mobile responsive design
  <img width="405" height="876" alt="image" src="https://github.com/user-attachments/assets/e16ca228-e959-4888-9d77-d2cd846fa3bb" />

- Loading states with skeleton components
  <img width="1414" height="1015" alt="image" src="https://github.com/user-attachments/assets/1fd2cf2f-6f2f-49c1-ba0e-9d5c18f09340" />


## ⏱️ Time Spent

**Total Development Time**: 18 hrs (6hrs 34mins, coding - Wakatime certified)
<img width="1619" height="656" alt="image" src="https://github.com/user-attachments/assets/22264c84-e0f9-435e-9508-d4433707f2ad" />


## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is part of a technical assessment and is for demonstration purposes.
