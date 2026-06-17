# R-Serve v1.0.3 - Release Notes

**Release Date:** June 17, 2026  
**Status:** Production Ready ✅

---

## 🎉 Major Updates

### **🎨 Complete UI Redesign**

Professional redesign with modern design system:

- ✅ **SVG Icons** — 24 professional SVG icons replacing emoji (PHP, MySQL, PostgreSQL, Node.js, Python, Nginx, Apache, Go, Ruby, Redis, MongoDB, MariaDB)
- ✅ **Modern Card Layouts** — Gradient top borders, consistent shadows, hover effects
- ✅ **Animated Status Indicators** — Pulse animations for running services
- ✅ **Smooth Transitions** — 150ms ease-in-out animations throughout
- ✅ **Professional Color Scheme** — Dark theme with blue accents, clean whites
- ✅ **Better Typography** — Proper font hierarchy and spacing
- ✅ **Responsive Design** — Mobile-friendly with @768px breakpoint

### **📦 Professional Installer Packages**

New installer system with native installation experience:

- ✅ **Progress Indicators** — Real-time feedback during extraction
- ✅ **Security Checks** — Admin/root privilege verification
- ✅ **Integrity Validation** — MD5/SHA256 checksum verification
- ✅ **Automatic Shortcuts** — Start Menu, Desktop, Launchpad integration
- ✅ **Clean Uninstallers** — Easy removal scripts included
- ✅ **Color-Coded Output** — Clear success/warning/error messages

---

## 📦 Download Options

### **Installer Packages (Recommended)**

Professional installers with automatic setup:

| Platform | File | Size | MD5 |
|----------|------|------|-----|
| **macOS Apple Silicon** | [R-Serve-Installer-1.0.3-mac-arm64.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-Installer-1.0.3-mac-arm64.tar.gz) | 100 MB | `4b3c0d4d56e6a951f8fd48fb52ff9513` |
| **macOS Intel** | [R-Serve-Installer-1.0.3-mac-intel.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-Installer-1.0.3-mac-intel.tar.gz) | 105 MB | `1ac36782ff1f8a3c24105ab40f70911d` |
| **Windows x64** | [R-Serve-Installer-1.0.3-windows.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-Installer-1.0.3-windows.tar.gz) | 116 MB | `489e2a3d95784663a367154410d53ab3` |
| **Linux x64** | [R-Serve-Installer-1.0.3-linux.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-Installer-1.0.3-linux.tar.gz) | 109 MB | `d986103c445d5565a3026f947f4253d9` |

### **Portable Builds (Advanced Users)**

Direct application archives without installer:

| Platform | File | Size |
|----------|------|------|
| macOS Apple Silicon | [R-Serve-1.0.3-arm64-mac.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-1.0.3-arm64-mac.tar.gz) | 100 MB |
| macOS Intel | [R-Serve-1.0.3-mac.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-1.0.3-mac.tar.gz) | 105 MB |
| Windows x64 | [R-Serve-1.0.3-win-x64.tar.gz](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-1.0.3-win-x64.tar.gz) | 116 MB |
| Linux Universal | [R-Serve-1.0.3.AppImage](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/R-Serve-1.0.3.AppImage) | 110 MB |

**📋 Checksums:** [CHECKSUMS-MD5.txt](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/CHECKSUMS-MD5.txt) | [CHECKSUMS-SHA256.txt](https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.3/CHECKSUMS-SHA256.txt)

---

## 🚀 Installation

### **Quick Start (Installer)**

**macOS:**
```bash
tar -xzf R-Serve-Installer-1.0.3-mac-arm64.tar.gz
sudo ./install-mac.sh
```

**Windows:**
1. Extract archive
2. Right-click `install-windows.bat` → **Run as administrator**

**Linux:**
```bash
tar -xzf R-Serve-Installer-1.0.3-linux.tar.gz
sudo ./install-linux.sh
```

**📖 Full Installation Guide:** [INSTALLER-GUIDE.md](https://github.com/syahrullrmdhn/rserve/blob/main/INSTALLER-GUIDE.md)

---

## ✨ What's New

### **UI/UX Improvements**

- ✅ Professional SVG icon library (24 icons)
- ✅ Modern card-based layouts with shadows
- ✅ Animated status dots with pulse effect
- ✅ Smooth hover transitions (150ms)
- ✅ Unified color scheme (slate-50/700/900, blue-600)
- ✅ Better typography hierarchy
- ✅ Responsive mobile design (@768px)

### **Installer Features**

- ✅ Native installation scripts (Bash, Batch)
- ✅ Progress indicators with file size display
- ✅ Admin/root privilege checks
- ✅ MD5 checksum verification
- ✅ Automatic shortcut creation
- ✅ Clean uninstaller included
- ✅ Color-coded terminal output

### **Bug Fixes (from v1.0.2)**

- ✅ Windows service detection via Chocolatey
- ✅ Improved font rendering on Windows (ClearType)
- ✅ Fixed TailwindCSS classes in modals
- ✅ Better error handling and user feedback

---

## 🔧 System Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| **macOS** | 10.13 High Sierra | 12.0 Monterey or later |
| **Windows** | Windows 10 (64-bit) | Windows 11 |
| **Linux** | GLIBC 2.27+ (Ubuntu 18.04+) | Ubuntu 22.04+ |

**Required Software:**
- **Windows:** Chocolatey (for service management)
- **macOS:** Homebrew (for service installation)
- **Linux:** Standard package managers (apt, yum, dnf)

---

## 📊 Technical Details

### **Build Information**

- **Electron:** 33.4.11
- **Node.js:** 20.x
- **Architecture:** x64, ARM64 (macOS only)
- **Compression:** tar.gz
- **Installer:** Native scripts (Bash, Batch)

### **Application Structure**

**macOS:**
- Bundle: `/Applications/R-Serve.app`
- Binary: `Contents/MacOS/R-Serve`
- Resources: `Contents/Resources/app.asar`

**Windows:**
- Directory: `C:\Program Files\R-Serve\`
- Executable: `R-Serve.exe`
- Uninstaller: `uninstall.bat`

**Linux:**
- AppImage: `/opt/rserve/R-Serve`
- Symlink: `/usr/local/bin/rserve`
- Desktop Entry: `/usr/share/applications/rserve.desktop`

### **Security**

- ✅ Content Security Policy (CSP) enabled
- ✅ No console logs in production
- ✅ Secure file permissions (755)
- ✅ Path traversal protection
- ✅ Checksum verification available
- ⚠️ Applications are unsigned (no code signing certificates yet)

---

## 🐛 Known Issues

### **macOS Gatekeeper Warning**

**Issue:** macOS shows "R-Serve is damaged and can't be opened"

**Solution:**
```bash
xattr -cr /Applications/R-Serve.app
```

Or: System Preferences → Security & Privacy → General → "Open Anyway"

### **Windows SmartScreen Warning**

**Issue:** "Windows protected your PC" warning

**Solution:** Click "More info" → "Run anyway"

### **Linux FUSE Requirement**

**Issue:** AppImage requires FUSE

**Solution:**
```bash
sudo apt install libfuse2  # Ubuntu/Debian
sudo dnf install fuse-libs # Fedora
```

---

## 🗑️ Uninstallation

### **Via Uninstaller**

**macOS:**
```bash
sudo rm -rf /Applications/R-Serve.app
```

**Windows:**
```
C:\Program Files\R-Serve\uninstall.bat
```

**Linux:**
```bash
sudo rm -rf /opt/rserve /usr/local/bin/rserve /usr/share/applications/rserve.desktop
```

---

## 📝 Changelog

### **v1.0.3** (2026-06-17)

**Added:**
- Professional installer packages with progress indicators
- 24 SVG icons for all services
- Modern card-based UI design
- Animated status indicators with pulse effect
- Smooth hover transitions and animations
- Comprehensive installer guide documentation
- MD5/SHA256 checksum files

**Improved:**
- Complete UI redesign with unified design system
- Better color scheme and typography
- Responsive mobile layout
- Error handling and user feedback
- Installation experience across all platforms

**Fixed:**
- Windows service detection (Chocolatey integration)
- Font rendering on Windows (ClearType support)
- TailwindCSS classes not applying in modals
- Quarantine flag handling on macOS

### **v1.0.2** (2026-06-17)

**Added:**
- Windows support via Chocolatey
- Windows service commands (choco, net, sc)

**Fixed:**
- Blurry fonts on Windows

### **v1.0.1** (2026-06-17)

**Added:**
- File Browser feature
- Cron Jobs management

### **v1.0.0** (2026-06-17)

**Initial Release:**
- Service management (PHP, MySQL, PostgreSQL, etc.)
- Multi-version support
- macOS and Linux support
- Basic UI with emoji icons

---

## 🔮 Roadmap (v1.1.0+)

- [ ] Code signing certificates (macOS + Windows)
- [ ] DMG installer for macOS (native .dmg format)
- [ ] NSIS installer for Windows (native .exe format)
- [ ] Auto-update mechanism
- [ ] Docker container support
- [ ] Service logs viewer
- [ ] Configuration file editor
- [ ] Backup/restore functionality

---

## 📞 Support

**Documentation:**
- [README.md](https://github.com/syahrullrmdhn/rserve#readme)
- [INSTALLER-GUIDE.md](https://github.com/syahrullrmdhn/rserve/blob/main/INSTALLER-GUIDE.md)

**Issues:**
- Report bugs: https://github.com/syahrullrmdhn/rserve/issues
- Feature requests: https://github.com/syahrullrmdhn/rserve/discussions

**Contact:**
- Email: syahrulrmdhn.0911@gmail.com
- GitHub: [@syahrullrmdhn](https://github.com/syahrullrmdhn)

---

## 📄 License

MIT License

Copyright (c) 2026 Syahrul Ramadhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 Acknowledgments

- Electron framework
- TailwindCSS for styling
- Community contributors
- Beta testers

---

## 🎊 Thank You!

Thank you for using R-Serve! We hope this update brings you a better development experience.

**Star the project on GitHub:** ⭐ https://github.com/syahrullrmdhn/rserve

**Share your feedback:** Open an issue or discussion!

---

**Happy Coding! 🚀✨**

*Made with ❤️ by Syahrul Ramadhan*
