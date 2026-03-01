# Project Structure (Industry Standard)

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   └── layout/          # Layout components (Nav, Header, Footer)
├── config/              # Configuration files
│   └── constants.js     # App constants (API URLs, pagination settings)
├── constants/           # Business constants
│   └── vehicleData.js   # Vehicle-related data
├── data/                # Mock/static data
│   └── mockDatabase.js  # Mock database
├── features/            # Feature-based modules (Redux slices + related logic)
│   ├── auth/            # Authentication feature
│   ├── dashboard/       # Dashboard feature
│   └── orders/          # Orders feature
│       └── ordersSlice.js
├── hooks/               # Custom React hooks
│   └── useOrders.js     # Orders hook
├── lib/                 # Third-party library wrappers
│   └── api.js           # API client
├── pages/               # Page components (routes)
│   ├── Actions.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── TotalOrders.jsx
│   └── ...
├── store/               # Redux store configuration
│   └── store.js
├── utils/               # Utility functions
│   ├── cache.js
│   ├── helpers.js
│   └── logger.js
├── App.jsx              # Root component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Key Principles

1. **Feature-based organization**: Related code grouped by feature (orders, auth, etc.)
2. **Separation of concerns**: Logic in features/hooks, UI in components/pages
3. **Reusability**: Shared utilities, hooks, and components
4. **Scalability**: Easy to add new features without affecting existing code
5. **Maintainability**: Clear structure makes code easy to find and update
