import { useEffect, useRef, useState } from "react";

function resolveDefault(defaultValue) {
  if (typeof defaultValue === "function") {
    return defaultValue();
  }
  return defaultValue;
}

export function useLocalStorage(key, defaultValue, options = {}) {
  const { parse, serialize } = options;
  const parseRef = useRef(parse);
  const serializeRef = useRef(serialize);

  parseRef.current = parse;
  serializeRef.current = serialize;

  const readValue = () => {
    if (typeof window === "undefined") {
      return resolveDefault(defaultValue);
    }

    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) {
        return resolveDefault(defaultValue);
      }

      if (parseRef.current) {
        return parseRef.current(stored);
      }

      return JSON.parse(stored);
    } catch (error) {
      console.warn(`Impossible de lire la clé "${key}" dans le stockage local`, error);
      return resolveDefault(defaultValue);
    }
  };

  const [value, setValue] = useState(readValue);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const serialised = serializeRef.current
        ? serializeRef.current(value)
        : JSON.stringify(value);
      window.localStorage.setItem(key, serialised);
    } catch (error) {
      console.warn(`Impossible d'enregistrer la clé "${key}" dans le stockage local`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
