# Promise Handling Patterns in React Components

This document provides specific examples for fixing common ESLint promise-related errors (`@typescript-eslint/no-misused-promises` and `@typescript-eslint/no-floating-promises`) in React components.

## Common Error Patterns and Solutions

### 1. Event Handlers (`@typescript-eslint/no-misused-promises`)

**Problem**: React event handlers expect functions that return `void`, but async functions return `Promise<void>`.

#### Pattern 1: Direct async function as event handler

```tsx
// ❌ Error: Promise-returning function provided to attribute where a void return was expected
<Button onClick={async () => {
  await saveData();
  setIsSaved(true);
}}>Save</Button>
```

**Solution**: Wrap in a non-async function and use the `void` operator

```tsx
// ✅ Correct: Wrapped in non-async function with void operator
<Button onClick={() => {
  void (async () => {
    await saveData();
    setIsSaved(true);
  })();
}}>Save</Button>

// Alternative shorter version for simple cases:
<Button onClick={() => { void saveData().then(() => setIsSaved(true)); }}>Save</Button>
```

#### Pattern 2: Passing an async function directly

```tsx
// ❌ Error: Promise-returning function provided to attribute where a void return was expected
<Button onClick={handleSubmit}>Submit</Button>

// Where handleSubmit is defined as:
const handleSubmit = async () => {
  await submitForm();
  // ...
};
```

**Solution**: Create a wrapper function that calls the async function with `void`

```tsx
// ✅ Correct: Create a wrapper function 
<Button onClick={handleSubmitWrapper}>Submit</Button>

// Where the wrapper is defined as:
const handleSubmitWrapper = () => {
  void handleSubmit();
};

// And handleSubmit remains async:
const handleSubmit = async () => {
  await submitForm();
  // ...
};
```

### 2. `useEffect` Hook (`@typescript-eslint/no-floating-promises`)

**Problem**: `useEffect` callback cannot be async, but you need to perform async operations inside it.

```tsx
// ❌ Error: Promise returned in function argument where a void return was expected
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);
```

**Solution**: Define an async function inside `useEffect` and call it with `void`

```tsx
// ✅ Correct: Inner async function with void operator
useEffect(() => {
  const fetchDataAsync = async () => {
    try {
      const data = await fetchData();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    }
  };
  
  void fetchDataAsync();
  
  // Optional cleanup if needed
  return () => {
    // cleanup logic
  };
}, []);
```

### 3. Initialization Code (`@typescript-eslint/no-floating-promises`)

**Problem**: Top-level async code that initializes components or performs initial setup.

```tsx
// ❌ Error: Promises must be awaited, end with a call to .catch...
const MyComponent = () => {
  const logger = getLogger(); // Returns Promise<Logger>
  logger.info('Component initialized');
  // rest of component...
};
```

**Solution**: Use `useEffect` for async initialization or properly handle the Promise

```tsx
// ✅ Correct: Async initialization in useEffect
const MyComponent = () => {
  const [logger, setLogger] = useState<Logger | null>(null);
  
  useEffect(() => {
    const initLogger = async () => {
      const loggerInstance = await getLogger();
      setLogger(loggerInstance);
      loggerInstance.info('Component initialized');
    };
    
    void initLogger();
  }, []);
  
  // rest of component...
};
```

### 4. Promise-Returning Methods in Class Components

**Problem**: Class methods that are async and used as event handlers.

```tsx
// ❌ Error: Promise-returning function provided to attribute where a void return was expected
class MyComponent extends React.Component {
  async handleClick() {
    await this.fetchData();
    this.setState({ loaded: true });
  }
  
  render() {
    return <button onClick={this.handleClick.bind(this)}>Load</button>;
  }
}
```

**Solution**: Create a wrapper method that uses `void` with the async method

```tsx
// ✅ Correct: Wrapper method for async operations
class MyComponent extends React.Component {
  async handleClickAsync() {
    await this.fetchData();
    this.setState({ loaded: true });
  }
  
  handleClick = () => {
    void this.handleClickAsync();
  }
  
  render() {
    return <button onClick={this.handleClick}>Load</button>;
  }
}
```

## Advanced Patterns

### 1. Error Boundary Integration

When using `void` with async functions, make sure errors are caught and handled appropriately, especially in components wrapped with error boundaries:

```tsx
const handleSubmit = () => {
  void (async () => {
    try {
      await saveData();
      setSuccess(true);
    } catch (error) {
      // Handle error locally
      setError(error);
      // Or propagate to an error boundary
      errorReporting.captureException(error);
    }
  })();
};
```

### 2. Cancellation Pattern for useEffect

For cancelable operations in `useEffect`:

```tsx
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    try {
      const result = await api.getData();
      // Only update state if component is still mounted
      if (isMounted) {
        setData(result);
      }
    } catch (error) {
      if (isMounted) {
        setError(error);
      }
    }
  };
  
  void fetchData();
  
  // Cleanup function to prevent state updates after unmount
  return () => {
    isMounted = false;
  };
}, []);
```

## Conclusion

These patterns will help resolve promise-related ESLint errors in React components while maintaining proper error handling and component lifecycle management. Remember that the goal is not just to silence linting errors but to handle promises properly in a way that ensures your application remains stable and predictable.

Key takeaways:
1. Use the `void` operator for intentionally ignoring promise results
2. Wrap async functions in non-async wrappers for event handlers
3. Define async functions inside `useEffect` and invoke them with `void`
4. Always handle errors in async operations
5. Consider component lifecycle when dealing with async operations, especially in `useEffect` 