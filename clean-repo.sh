#!/bin/bash

echo "🧹 Pulizia repository (mantengo index.html e vercel.json)..."

for item in *; do
  if [[ "$item" != "index.html" && "$item" != "vercel.json" ]]; then
    if [[ -d "$item" ]]; then
      echo "❌ Elimino directory: $item"
      rm -rf "$item"
    fi
  fi
done

echo "✅ Pulizia completata"
ls -la