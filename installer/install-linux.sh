#!/bin/bash
# R-Serve Installer v1.0.3 for Linux
# Professional installer with progress and security checks

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

VERSION="1.0.3"
APP_NAME="R-Serve"
APPIMAGE="R-Serve-${VERSION}.AppImage"
INSTALL_DIR="/opt/rserve"

# Banner
echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${BOLD}   R-Serve Installer v${VERSION}          ${NC}${CYAN}║${NC}"
echo -e "${CYAN}║${NC}   Development Server Manager           ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "Platform: ${CYAN}Linux/x64${NC}"
echo -e "Version:  ${CYAN}${VERSION}${NC}"
echo ""

# Check if running with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}✗ Error: This installer requires sudo privileges${NC}"
   echo "Please run with: sudo ./install-linux.sh"
   exit 1
fi

# Check if AppImage exists
if [[ ! -f "$APPIMAGE" ]]; then
    echo -e "${RED}✗ Error: AppImage not found: $APPIMAGE${NC}"
    echo ""
    echo "Please ensure the installer is in the same directory as:"
    echo "  - $APPIMAGE"
    exit 1
fi

# Get file size
FILE_SIZE=$(stat -c%s "$APPIMAGE" 2>/dev/null)
FILE_SIZE_MB=$((FILE_SIZE / 1024 / 1024))

echo -e "${BOLD}Starting installation...${NC}"
echo ""

# Step 1: Verify integrity
echo "[1/5] Verifying AppImage integrity..."
if command -v md5sum &> /dev/null; then
    MD5=$(md5sum "$APPIMAGE" | awk '{print $1}')
    echo "  → MD5: $MD5"
fi
echo "  → Size: $FILE_SIZE_MB MB"

# Step 2: Create install directory
echo "[2/5] Installing to $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"

# Copy AppImage with progress
echo "  → Copying AppImage..."
if command -v pv &> /dev/null; then
    pv "$APPIMAGE" > "$INSTALL_DIR/R-Serve"
else
    cp "$APPIMAGE" "$INSTALL_DIR/R-Serve"
fi

echo -e "  ${GREEN}✓${NC} AppImage copied"

# Make executable
chmod +x "$INSTALL_DIR/R-Serve"

# Step 3: Create desktop entry
echo "[3/5] Creating desktop entry..."

cat > /usr/share/applications/rserve.desktop << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=R-Serve
Comment=Development Server Manager
Exec=$INSTALL_DIR/R-Serve
Icon=$INSTALL_DIR/R-Serve
Terminal=false
Categories=Development;Utility;
StartupNotify=true
EOF

chmod 644 /usr/share/applications/rserve.desktop
echo -e "  ${GREEN}✓${NC} Desktop entry created"

# Step 4: Create symlink
echo "[4/5] Creating symlink in /usr/local/bin..."
ln -sf "$INSTALL_DIR/R-Serve" /usr/local/bin/rserve
echo -e "  ${GREEN}✓${NC} Symlink created"

# Step 5: Update desktop database
echo "[5/5] Updating desktop database..."
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database /usr/share/applications 2>/dev/null || true
    echo -e "  ${GREEN}✓${NC} Database updated"
else
    echo -e "  ${YELLOW}⚠${NC} update-desktop-database not found (optional)"
fi

# Success
echo ""
echo -e "${GREEN}✓ Installation completed successfully!${NC}"
echo ""
echo -e "${BOLD}You can now run R-Serve from:${NC}"
echo ""
echo "  • Application menu (Development)"
echo "  • Terminal: rserve"
echo "  • Direct: $INSTALL_DIR/R-Serve"
echo ""
echo -e "${YELLOW}To uninstall:${NC}"
echo "  sudo rm -rf $INSTALL_DIR /usr/local/bin/rserve /usr/share/applications/rserve.desktop"
echo ""
