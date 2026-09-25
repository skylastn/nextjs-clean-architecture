# Next.js Clean Architecture & Domain-Driven Design (DDD)

A production-ready Next.js application structured with **Clean Architecture** and **Domain-Driven Design (DDD)** principles, TypeScript, Tailwind CSS v4, and Docker containerization.

---

## 🏛️ Architecture Overview

This project separates software into decoupled, testable, and maintainable layers. Dependencies point inward toward the Domain layer.

```
+-------------------------------------------------------------------------+
|                           PRESENTATION LAYER                            |
|  Pages (Next.js Pages Router) | UI Components | Presentation Logic/Hooks |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                           APPLICATION LAYER                             |
|         Services (Use Cases) | Dependency Injection Container           |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                             DOMAIN LAYER                                |
|        Entity Models | Value Objects | Repository Interfaces            |
+-------------------------------------------------------------------------+
                                    ▲
                                    │ implements
+-------------------------------------------------------------------------+
|                          INFRASTRUCTURE LAYER                           |
|  Repository Implementations | Remote (Axios/REST) & Local Data Sources  |
+-------------------------------------------------------------------------+
```

### 1. Presentation Layer (`src/pages/`, `src/features/*/presentation/`)
- **Pages**: Routing entry points under Next.js Pages router.
- **UI Components**: Pure presentation components focusing on rendering and styling.
- **Logic Hooks / Contexts**: State machines managing component state transitions using `StateModel<T>` (`initial`, `loading`, `success`, `error`).

### 2. Application Layer (`src/features/*/application/`, `src/shared/dependency_injection/`)
- **Services**: Encapsulate application use cases and business workflows.
- **Global Container**: Inversion of Control (IoC) providing service instances via React Context and custom hooks (`useAuthService`, `useSampleService`).

### 3. Domain Layer (`src/features/*/domain/`, `src/shared/domain/`)
- **Repository Contracts**: Interface definitions declaring required data operations independent of underlying technologies.
- **Models**: Strongly-typed request/response data contracts and business entities.

### 4. Infrastructure Layer (`src/features/*/infrastructure/`, `src/shared/network/`)
- **Repository Implementations**: Concrete classes fulfilling domain repository contracts.
- **Data Sources**:
  - `Remote`: Network calls executed via `ApiClient` (Axios wrapper with automatic Bearer token injection and error normalization).
  - `Local`: Client-side persistence (`SessionData` wrapping browser storage with SSR safety guards).

---

## 🔄 End-to-End Data Flow

```
[User Action / Mount]
       │
       ▼
[Presentation UI]  ── calls ──>  [Logic Hook / Context]
                                          │
                                       invokes
                                          │
                                          ▼
                                 [Application Service]
                                          │
                                       calls
                                          │
                                          ▼
                                [Repository Interface]
                                          │
                                     implemented by
                                          │
                                          ▼
                             [Repository Implementation]
                                          │
                                      fetches
                                          │
                                          ▼
                                    [Data Source]
                                 (Remote / Local API)
                                          │
                                       returns
                                          │
                                          ▼
                             Either<ResponseModel, T>
                                          │
                                      propagates
                                          │
                                          ▼
                                [Logic Hook / Context]
                                (Folds Either -> StateModel)
                                          │
                                      re-renders
                                          │
                                          ▼
                                  [Presentation UI]
```

---

## 📂 Project Directory Structure

```
src/
├── features/                          # Feature-driven modules
│   ├── auth/                          # Authentication bounded context
│   │   ├── application/               # AuthService use cases
│   │   ├── domain/                    # Models & AuthRepository interface
│   │   ├── infrastructure/            # Remote/Local data sources & persistence
│   │   └── presentation/              # Login/Register UI & logic contexts
│   ├── core/                          # Core domain features (sample/home)
│   │   ├── application/               # SampleService
│   │   ├── domain/                    # Photo/President models & repository contract
│   │   ├── infrastructure/            # Sample repository impl & remote data source
│   │   └── presentation/              # Home view & logic hooks
│   └── component/                     # Shared layout features (Header, Footer)
├── pages/                             # Next.js Pages router endpoints
│   ├── _app.tsx                       # Root provider configuration & global styles
│   ├── _document.tsx                  # HTML document structure
│   ├── index.tsx                      # Landing / Home route
│   └── auth/                          # Auth routes (login, register)
└── shared/                            # Reusable cross-cutting concerns
    ├── component/                     # UI components, layout elements, loaders
    ├── constant/                      # Env config, URL endpoints, session storage
    ├── dependency_injection/          # Global container & dependency providers
    ├── domain/                        # Shared response models & enums
    ├── logic/                         # Global app state (Theme/DarkMode, Global loaders)
    ├── network/                       # Axios ApiClient wrapper with interceptors
    ├── styles/                        # Global Tailwind CSS and module styles
    └── utils/                         # Either monad, date/currency extensions, helpers
```

---

## 🛠️ Core Patterns & Utilities

- **Functional Error Handling (`Either<L, R>`)**: Eliminates unhandled try/catch boilerplate across presentation components. Failures land on `Left`, valid payloads land on `Right`.
- **Predictable State Model (`StateModel<T>`)**: Standardized reactive state representation (`StateType.initial` | `loading` | `success` | `error`).
- **Dependency Injection**: Decoupled service layer bound at runtime through React context.
- **Axios HTTP Client**: Unified interceptor pipeline injecting authentication tokens and standardizing error responses.

---

## 🚀 Getting Started

### Prerequisites
- **Bun**: `v1.2+` (tested with `v1.4.2`)
- **Docker** & **Docker Compose** (optional, for containerized runs)

### 1. Installation

```bash
bun install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
APP_ENV=local
NEXT_PUBLIC_ENDPOINT_URL=https://api.example.com
DOCKER_PORT=3000
```

### 3. Development Server

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 4. Build & Verification

```bash
# Run ESLint checks
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Production build
bun run build

# Start production server
bun run start
```

---

## 🐳 Docker & Makefile Workflows

Multi-stage `Dockerfile` (`deps` → `builder` → `runner`) optimized for lightweight production images.

```bash
# Copy environment file for target env
make ENV=production copyEnv

# Deploy via Docker Compose (down -> build -> up -d)
make deploy

# Perform clean dependency re-installation
make freshInstall
```

---

## 📜 License

MIT License.
