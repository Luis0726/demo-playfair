# Cifrado de Playfair: caso práctico (Vite + React + TypeScript)

Demo interactiva: matriz 5×5 con palabra clave, cifrado por dígrafos, descifrado y explicación paso a paso.

## Ejecutar
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Estructura
- `src/playfair.ts`: lógica del cifrado (matriz, pares, cifrar/descifrar). Sin dependencias de React.
- `src/components/Matrix.tsx`: matriz 5×5 con resaltado de letras de entrada y salida.
- `src/components/StepsPanel.tsx`: tabla de pares y explicación del paso seleccionado.
- `src/App.tsx`: estado (clave, mensaje, modo) y las 4 secciones del caso práctico.
