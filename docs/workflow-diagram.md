# Workflow Diagram

## End-to-End Workflow

```mermaid
flowchart TD
    U[User]
    FE[React Frontend]
    API[TravelAccounting.Api]
    APP[Application Layer]
    TRIP_REPO[(Trip Repository<br/>InMemory)]
    EXP_REPO[(Expense Repository<br/>InMemory)]
    RATE_REPO[(ExchangeRate Repository<br/>InMemory)]
    REF_SVC[(Country Reference Service<br/>InMemory)]
    FX_PROVIDER[ExchangeRateHostProvider<br/>exchangerate.host]

    U --> FE
    FE -->|Create/Edit Trip| API
    API --> APP
    APP --> TRIP_REPO

    FE -->|Load countries| API
    API --> REF_SVC

    FE -->|Create/Edit Expense| API
    API --> APP
    APP --> EXP_REPO

    FE -->|List Expenses| API
    API --> APP
    APP --> EXP_REPO
    APP --> TRIP_REPO
    APP --> RATE_REPO
    APP -->|Rate missing| FX_PROVIDER
    FX_PROVIDER --> APP
    APP -->|Cache fetched rate| RATE_REPO
    APP --> API
    API --> FE

    FE -->|Show local + home equivalent| U
```

## Conversion Decision Flow

```mermaid
flowchart TD
    A[List or read expense]
    B{Expense currency = Trip home currency?}
    C[HomeAmount = Amount<br/>RateUsed = 1]
    D[Look up local cached rate by<br/>trip/date/from/to]
    E{Cached rate found?}
    F[Use cached rate]
    G[Fetch rate from exchangerate.host]
    H{Provider returned rate?}
    I[Persist rate in repository]
    J[HomeAmount unavailable<br/>RateUsed = null]
    K[Compute HomeAmount]

    A --> B
    B -->|Yes| C
    B -->|No| D
    D --> E
    E -->|Yes| F
    E -->|No| G
    G --> H
    H -->|Yes| I
    H -->|No| J
    I --> K
    F --> K
```

## Notes
- Expense creation does not fail if provider lookup fails.
- When provider/rate is unavailable, expense remains saved and conversion fields are null.
- Conversions are deterministic once a rate is cached for that trip/date/currency pair.
