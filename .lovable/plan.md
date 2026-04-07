

## Logo centreren, "← Terug" links

De huidige layout toont logo en "← Terug" naast elkaar links. De nieuwe layout wordt:

```text
← Terug         [SPOA Logo]
```

### Aanpak — `src/components/Calculator.tsx`

Op twee plekken (regel ~825-831 en ~840-846): vervang de enkele flex-div door:

```tsx
<div className="relative flex items-center justify-center mb-4">
  <span
    className="absolute left-0 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
    onClick={() => setShowIntro(true)}
  >
    ← Terug
  </span>
  <img
    src={spoaLogo}
    alt="SPOA logo"
    className="h-8 cursor-pointer"
    onClick={() => setShowIntro(true)}
  />
</div>
```

- `relative` + `absolute left-0` plaatst "Terug" links zonder het gecentreerde logo te beïnvloeden
- Logo blijft klikbaar naar de landingspagina
- Eén bestand, twee locaties, ~6 regels per locatie

