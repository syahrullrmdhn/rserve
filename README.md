<div align="center">

# R-Serve

**Your All-in-One Local Development Server Manager**

*Apache • MySQL • Nginx • PostgreSQL • Node.js • PHP • Python • Go • Ruby*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey)](https://github.com/syahrullrmdhn/rserve)
[![Electron](https://img.shields.io/badge/Electron-33.0-47848F?logo=electron)](https://www.electronjs.org/)

### *"One App. Every Stack. Zero Hassle."*

[Download for macOS](#) • [Download for Windows](#) • [Download for Linux](#)

![R-Serve Dashboard](screenshots/dashboard.png)

</div>

---

## 🚀 Features

### **🎛️ Unified Service Management**
Start, stop, and monitor all your development services from one elegant interface:
- **Apache** — Industry-standard web server
- **MySQL** — Reliable relational database
- **Nginx** — High-performance web server & reverse proxy
- **PostgreSQL** — Advanced open-source database
- **PHP-FPM** — FastCGI process manager for PHP
- **Node.js** — JavaScript runtime built on Chrome's V8
- **Python** — High-level programming language
- **Go** — Fast, statically typed compiled language
- **Ruby** — Dynamic, elegant programming language

### **📁 Built-in File Browser**
Navigate and manage your project files without leaving the app. Open files in your default editor with a single click.

### **⏰ Cron Job Scheduler** *(Coming Soon)*
Schedule automated tasks directly from R-Serve — no terminal required.

### **🎨 Modern, Clean Interface**
Dark-themed UI designed for developers. Native look and feel on every platform.

### **🔄 Real-time Status Monitoring**
Live service status updates every 5 seconds. Know exactly what's running.

### **⚡ Fast & Lightweight**
Built with Electron for cross-platform compatibility. Minimal resource footprint.

---

## 📦 Installation

### macOS

**Apple Silicon (M1/M2/M3/M4):**
```bash
curl -LO https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.2/R-Serve-1.0.2-arm64-mac.zip
unzip R-Serve-1.0.2-arm64-mac.zip
mv R-Serve.app /Applications/
# Remove quarantine flag (required for unsigned apps)
xattr -cr /Applications/R-Serve.app
open /Applications/R-Serve.app
```

**Intel Mac:**
```bash
curl -LO https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.2/R-Serve-1.0.2-mac.zip
unzip R-Serve-1.0.2-mac.zip
mv R-Serve.app /Applications/
# Remove quarantine flag (required for unsigned apps)
xattr -cr /Applications/R-Serve.app
open /Applications/R-Serve.app
```

**✅ Native ARM64 support** — no Rosetta needed, optimized for Apple Silicon.

> **⚠️ macOS Security:** If you see "R-Serve is damaged", run `xattr -cr /Applications/R-Serve.app` to remove the quarantine flag.

### Windows

**Requirements:** [Chocolatey](https://chocolatey.org/install) package manager (for service installation)

```bash
# Download
curl -LO https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.2/R-Serve-1.0.2-win-x64.tar.gz

# Extract (use 7-Zip, WinRAR, or Windows tar)
tar -xzf R-Serve-1.0.2-win-x64.tar.gz

# Run
cd win-unpacked
R-Serve.exe
```

### Linux

**AppImage (Universal - all distros):**
```bash
# Download
curl -LO https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.2/R-Serve-1.0.2.AppImage

# Make executable and run
chmod +x R-Serve-1.0.2.AppImage
./R-Serve-1.0.2.AppImage
```

**Debian/Ubuntu (.deb package):**
```bash
curl -LO https://github.com/syahrullrmdhn/rserve/releases/download/v1.0.2/rserve_1.0.2_amd64.deb
sudo dpkg -i rserve_1.0.2_amd64.deb
```

---

## 🎯 Why R-Serve?

| Feature | R-Serve | XAMPP | MAMP | Laragon |
|---------|---------|-------|------|---------|
| **Cross-Platform** | ✅ Mac, Windows, Linux | ✅ | ⚠️ Mac/Windows only | ❌ Windows only |
| **Modern UI** | ✅ Electron-based | ❌ | ⚠️ | ✅ |
| **Service Manager** | ✅ | ✅ | ✅ | ✅ |
| **File Browser** | ✅ | ⚠️ Basic | ❌ | ✅ |
| **Cron Jobs** | 🔜 Coming | ❌ | ❌ | ❌ |
| **Open Source** | ✅ MIT | ✅ GPL | ❌ Proprietary | ❌ Proprietary |
| **Auto Updates** | ✅ | ❌ | ✅ | ✅ |

---

## 🖥️ Screenshots

<div align="center">

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Service Management
![Services](screenshots/services.png)

### File Browser
![Files](screenshots/files.png)

</div>

---

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm
- Git

### Build from Source

```bash
# Clone the repository
git clone https://github.com/syahrullrmdhn/rserve.git
cd rserve

# Install dependencies
npm install

# Run in development mode
npm start

# Build for your platform
npm run build:mac    # macOS (x64 + arm64 universal)
npm run build:win    # Windows (portable + installer)
npm run build:linux  # Linux (AppImage + deb)
```

---

## 📋 Requirements

### macOS
- macOS 10.13 (High Sierra) or later
- Services installed via Homebrew:
  ```bash
  brew install apache2 mysql nginx postgresql php
  ```

### Linux
- Ubuntu 20.04+ / Debian 11+ / Fedora 35+
- Services installed via package manager:
  ```bash
  # Debian/Ubuntu
  sudo apt install apache2 mysql-server nginx postgresql php-fpm
  
  # Fedora/RHEL
  sudo dnf install httpd mariadb-server nginx postgresql-server php-fpm
  ```

### Windows
- Windows 10 (1809+) or Windows 11
- Services installed manually or via package manager (Chocolatey, Scoop)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Inspired by XAMPP, MAMP, and Laragon
- Icons from system emoji sets

---

## 📧 Contact

**Syahrul Ramadhan**  
Email: syahrulrmdhn.0911@gmail.com  
GitHub: [@syahrullrmdhn](https://github.com/syahrullrmdhn)

---

<div align="center">

**Made with ❤️ for developers**

[⭐ Star this repo](https://github.com/syahrullrmdhn/rserve) if you find it useful!

</div>
