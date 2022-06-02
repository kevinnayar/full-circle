export default class Cache<T> {
  limit: number;
  store: Map<string, T>;

  constructor(limit?: number) {
    this.limit = limit || 100;
    this.store = new Map();
  };

  has(key: string): boolean {
    return this.store.has(key);
  };

  get(key: string): null | T {
    return this.store.get(key);
  };

  set(key: string, value: T) {
    if (this.store.size >= this.limit) {
      const oldestKey = [...this.store.keys()][0];
      this.store.delete(oldestKey);
    }
    this.store.set(key, value);
  };
};