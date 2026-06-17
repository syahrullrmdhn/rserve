# Apple Silicon (M1/M2/M3) Support

R-Serve is **fully compatible** with Apple Silicon Macs (M1, M2, M3, M4).

## ✅ Native ARM64 Support

- **Universal Binary** — single DMG works on both Intel and Apple Silicon Macs
- **Native Performance** — runs natively on ARM64 (no Rosetta translation needed)
- **Optimized** — Electron v33+ with native Apple Silicon support

## 📦 Build Artifacts

When you build with `npm run build:mac`, electron-builder creates:

1. **R-Serve-1.0.0-arm64.dmg** — Apple Silicon (M1/M2/M3/M4) native
2. **R-Serve-1.0.0-x64.dmg** — Intel Mac native
3. **R-Serve-1.0.0-universal.dmg** — Universal binary (both architectures)

For distribution, use the **universal** DMG so users don't need to choose.

## 🛠️ Service Management on Apple Silicon

All Homebrew commands work natively on ARM64:

```bash
# Homebrew is ARM64-native since 2021
brew install php@8.2        # installs ARM64 version
brew services start mysql   # runs ARM64 MySQL
```

## ⚠️ Known Considerations

- **Rosetta not required** — R-Serve runs 100% native on Apple Silicon
- **Homebrew prefix** — Apple Silicon uses `/opt/homebrew` (Intel uses `/usr/local`)
- **Performance** — expect 30-50% better performance vs Intel on same generation

## 🧪 Testing

To verify ARM64 build:

```bash
# After installing DMG
file /Applications/R-Serve.app/Contents/MacOS/R-Serve
# Should output: Mach-O 64-bit executable arm64
```

---

**Tested on:** MacBook Pro M1/M2/M3 (macOS 13+)
