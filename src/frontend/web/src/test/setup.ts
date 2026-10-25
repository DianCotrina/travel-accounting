import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia; components query it for the phone layout. Default to desktop.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Some Node/jsdom combinations expose no usable localStorage; tests need a real Storage.
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

for (const name of ["localStorage", "sessionStorage"] as const) {
  let usable = false;
  try {
    usable = typeof globalThis[name]?.getItem === "function";
  } catch {
    usable = false; // guard-allow: probing a storage accessor that may throw
  }
  if (!usable) {
    const storage = memoryStorage();
    Object.defineProperty(globalThis, name, { configurable: true, value: storage });
    Object.defineProperty(window, name, { configurable: true, value: storage });
  }
}
