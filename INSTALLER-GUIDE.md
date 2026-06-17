# R-Serve Installer Packages - Complete Guide

## 📦 Available Installer Packages

All installer packages include:
- ✅ R-Serve application
- ✅ Professional installation script
- ✅ Progress indicators
- ✅ Security checks
- ✅ Automatic shortcuts
- ✅ Clean uninstaller

---

## 🎯 Quick Start

### **1. Download Your Platform's Installer**

| Platform | File | Size |
|----------|------|------|
| macOS Apple Silicon | `R-Serve-Installer-1.0.3-mac-arm64.tar.gz` | 100 MB |
| macOS Intel | `R-Serve-Installer-1.0.3-mac-intel.tar.gz` | 105 MB |
| Windows x64 | `R-Serve-Installer-1.0.3-windows.tar.gz` | 116 MB |
| Linux x64 | `R-Serve-Installer-1.0.3-linux.tar.gz` | 109 MB |

### **2. Extract & Run**

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

---

## ✨ Installer Features

### **Security & Validation**

- ✅ **Admin/Root Check** — Verifies elevated privileges before installation
- ✅ **Integrity Verification** — MD5 checksum validation
- ✅ **Path Traversal Protection** — Prevents malicious archive extraction
- ✅ **Secure Permissions** — Sets proper file permissions (755 for executables)
- ✅ **Clean Temp Files** — Automatic cleanup after installation

### **User Experience**

- 📊 **Progress Indicators** — Real-time feedback during extraction
- 🎨 **Color-Coded Output** — Clear success/warning/error messages
- 🔍 **Platform Detection** — Automatic architecture detection (ARM64/x64)
- 🧹 **Existing Version Removal** — Cleans old installations automatically
- 📝 **Detailed Steps** — Shows what's happening at each stage

### **Post-Installation**

**macOS:**
- ✅ App in `/Applications/R-Serve.app`
- ✅ Quarantine flag removed automatically
- ✅ Available in Launchpad
- ✅ Searchable via Spotlight (⌘ + Space)

**Windows:**
- ✅ Installed to `C:\Program Files\R-Serve\`
- ✅ Start Menu shortcut
- ✅ Desktop shortcut
- ✅ Uninstaller at `C:\Program Files\R-Serve\uninstall.bat`

**Linux:**
- ✅ AppImage at `/opt/rserve/R-Serve`
- ✅ Desktop entry in Applications menu
- ✅ Terminal command: `rserve`
- ✅ Symlink at `/usr/local/bin/rserve`

---

## 🔧 Advanced Usage

### **Silent Installation (Linux/macOS)**

For automated deployments:
```bash
# Extract
tar -xzf R-Serve-Installer-1.0.3-linux.tar.gz

# Run non-interactively
sudo bash ./install-linux.sh 2>&1 | tee install.log
```

### **Custom Install Location (Manual)**

If you prefer a custom location, you can extract and place manually:

**macOS:**
```bash
tar -xzf R-Serve-1.0.3-arm64-mac.tar.gz
mv R-Serve.app ~/Applications/
xattr -cr ~/Applications/R-Serve.app
```

**Linux:**
```bash
chmod +x R-Serve-1.0.3.AppImage
./R-Serve-1.0.3.AppImage
```

---

## 🐛 Troubleshooting

### **macOS: Permission Denied**

If installation fails with permission errors:
```bash
# Ensure you're using sudo
sudo ./install-mac.sh

# If still failing, check file permissions
chmod +x install-mac.sh
```

### **macOS: "R-Serve is damaged"**

This happens with unsigned apps:
```bash
# Method 1: Remove quarantine
sudo xattr -cr /Applications/R-Serve.app

# Method 2: System Preferences
# Go to System Preferences → Security & Privacy → General
# Click "Open Anyway"
```

### **Windows: Installer Won't Run**

Ensure you're running as Administrator:
1. Right-click `install-windows.bat`
2. Select **"Run as administrator"**
3. Click **Yes** on UAC prompt

### **Windows: "Windows protected your PC"**

For unsigned applications:
1. Click **"More info"**
2. Click **"Run anyway"**

### **Linux: FUSE Error**

AppImages require FUSE:
```bash
# Ubuntu/Debian
sudo apt install libfuse2

# Fedora/RHEL
sudo dnf install fuse-libs

# Arch
sudo pacman -S fuse2
```

### **Linux: Permission Issues**

If installation fails:
```bash
# Ensure you're root
sudo -i
./install-linux.sh

# Or check sudo permissions
sudo -v
```

---

## 📋 What Gets Installed

### **Files Installed**

**macOS:**
- `/Applications/R-Serve.app/` (entire app bundle)
- No additional files

**Windows:**
- `C:\Program Files\R-Serve\` (application files)
- `%APPDATA%\Microsoft\Windows\Start Menu\Programs\R-Serve.lnk`
- `%USERPROFILE%\Desktop\R-Serve.lnk`
- `C:\Program Files\R-Serve\uninstall.bat`

**Linux:**
- `/opt/rserve/R-Serve` (AppImage)
- `/usr/local/bin/rserve` (symlink)
- `/usr/share/applications/rserve.desktop` (desktop entry)

### **System Requirements**

| Platform | Minimum Requirement |
|----------|---------------------|
| macOS | macOS 10.13 (High Sierra) or later |
| Windows | Windows 10 (64-bit) or later |
| Linux | GLIBC 2.27+ (Ubuntu 18.04+, CentOS 8+, Debian 10+) |

### **Disk Space**

- **macOS**: ~250 MB (after installation)
- **Windows**: ~280 MB (after installation)
- **Linux**: ~220 MB (after installation)

---

## 🗑️ Complete Uninstallation

### **macOS**
```bash
# Remove app
sudo rm -rf /Applications/R-Serve.app

# Optional: Remove user preferences
rm -rf ~/Library/Preferences/id.syahrulramadhan.rserve.plist
rm -rf ~/Library/Application\ Support/R-Serve
```

### **Windows**
```cmd
REM Run uninstaller
C:\Program Files\R-Serve\uninstall.bat

REM Or manual removal
rmdir /s /q "C:\Program Files\R-Serve"
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\R-Serve.lnk"
del "%USERPROFILE%\Desktop\R-Serve.lnk"
```

### **Linux**
```bash
# Complete removal
sudo rm -rf /opt/rserve
sudo rm /usr/local/bin/rserve
sudo rm /usr/share/applications/rserve.desktop

# Update desktop database
sudo update-desktop-database /usr/share/applications
```

---

## 🔒 Security Notes

### **Installer Script Security**

✅ **Verified Safe:**
- No network requests during installation
- No data collection or telemetry
- Open-source scripts (review before running)
- Uses only system tools (tar, cp, chmod, ln)
- No modification of system files outside install directory

### **Admin/Root Required**

Installation requires elevated privileges to:
- Write to `/Applications` (macOS)
- Write to `C:\Program Files\` (Windows)
- Write to `/opt` and `/usr/local/bin` (Linux)
- Create system-wide shortcuts/desktop entries

### **Code Signing**

**Current Status:** Unsigned

Apps are unsigned, which means:
- ⚠️ macOS will show Gatekeeper warning (workaround: `xattr -cr`)
- ⚠️ Windows SmartScreen may show warning (click "More info" → "Run anyway")
- ✅ Linux doesn't require code signing

**Future Plans:** Code signing certificates for v1.1.0+

---

## 📊 Installer Comparison

| Feature | Installer Package | Manual Install |
|---------|-------------------|----------------|
| Progress Indicators | ✅ Yes | ❌ No |
| Admin Check | ✅ Yes | ❌ Manual |
| Auto Shortcuts | ✅ Yes | ❌ Manual |
| Quarantine Removal | ✅ Auto | ⚠️ Manual |
| Uninstaller | ✅ Included | ❌ Manual |
| Error Handling | ✅ Yes | ❌ No |
| Time Required | ~30 seconds | ~5 minutes |

**Recommendation:** Use installer packages for best experience.

---

## 🆘 Support

**Having issues?**

1. Check the troubleshooting section above
2. Review installation logs (if any)
3. Open an issue: https://github.com/syahrullrmdhn/rserve/issues

**Include in your report:**
- Platform & version (e.g., "macOS 13.4 ARM64")
- Installer version (v1.0.3)
- Error message (full text)
- Installation log (if available)

---

## 📝 Version History

### **v1.0.3** (2026-06-17)
- ✅ Professional installer scripts
- ✅ Progress indicators with color output
- ✅ Security checks and validation
- ✅ Complete UI redesign with SVG icons
- ✅ Windows service detection support
- ✅ Better font rendering on all platforms

### **v1.0.2** (2026-06-17)
- ✅ Windows support via Chocolatey
- ✅ Font rendering fixes

### **v1.0.1** (2026-06-17)
- ✅ File Browser + Cron Jobs features

### **v1.0.0** (2026-06-17)
- ✅ Initial release

---

## 📄 License

MIT License - See LICENSE file for details

© 2026 Syahrul Ramadhan

---

**Ready to install? Download from:** https://github.com/syahrullrmdhn/rserve/releases/tag/v1.0.3

**Enjoy R-Serve!** 🚀✨
