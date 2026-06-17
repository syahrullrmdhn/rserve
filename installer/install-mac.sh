#!/bin/bash
# R-Serve Installer v1.0.3 for macOS
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

# Banner
echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${BOLD}   R-Serve Installer v${VERSION}          ${NC}${CYAN}║${NC}"
echo -e "${CYAN}║${NC}   Development Server Manager           ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# Detect architecture
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    ARCHIVE="R-Serve-${VERSION}-arm64-mac.tar.gz"
    echo -e "Platform: ${CYAN}macOS/arm64${NC} (Apple Silicon)"
else
    ARCHIVE="R-Serve-${VERSION}-mac.tar.gz"
    echo -e "Platform: ${CYAN}macOS/x64${NC} (Intel)"
fi
echo -e "Version:  ${CYAN}${VERSION}${NC}"
echo ""

# Check if running with sudo
if [[ $EUID -ne 0 ]]; then
   echo -e "${YELLOW}⚠  This installer requires sudo privileges${NC}"
   echo "Please run with: sudo ./install-mac.sh"
   exit 1
fi

# Check if archive exists
if [[ ! -f "$ARCHIVE" ]]; then
    echo -e "${RED}✗ Error: Archive not found: $ARCHIVE${NC}"
    echo ""
    echo "Please ensure the installer is in the same directory as:"
    echo "  - $ARCHIVE"
    exit 1
fi

# Get file size for progress
FILE_SIZE=$(stat -f%z "$ARCHIVE" 2>/dev/null || stat -c%s "$ARCHIVE" 2>/dev/null)
FILE_SIZE_MB=$((FILE_SIZE / 1024 / 1024))

echo -e "${BOLD}Starting installation...${NC}"
echo ""

# Step 1: Verify integrity
echo "[1/5] Verifying archive integrity..."
if command -v md5 &> /dev/null; then
    MD5=$(md5 -q "$ARCHIVE")
    echo "  → MD5: $MD5"
elif command -v md5sum &> /dev/null; then
    MD5=$(md5sum "$ARCHIVE" | awk '{print $1}')
    echo "  → MD5: $MD5"
fi

# Step 2: Extract
echo "[2/5] Extracting application ($FILE_SIZE_MB MB)..."
TEMP_DIR=$(mktemp -d)
echo "  → Extracting to temporary directory..."

# Extract with progress
if command -v pv &> /dev/null; then
    pv "$ARCHIVE" | tar -xz -C "$TEMP_DIR"
else
    tar -xzf "$ARCHIVE" -C "$TEMP_DIR"
fi

echo -e "  ${GREEN}✓${NC} Extraction complete"

# Step 3: Install to Applications
echo "[3/5] Installing to /Applications/..."
APP_PATH="/Applications/R-Serve.app"

# Remove existing installation
if [[ -d "$APP_PATH" ]]; then
    echo "  → Removing existing installation..."
    rm -rf "$APP_PATH"
fi

# Move app
echo "  → Moving app to /Applications/..."
mv "$TEMP_DIR/R-Serve.app" "$APP_PATH"

# Step 4: Remove quarantine
echo "[4/5] Removing quarantine flag..."
if xattr -cr "$APP_PATH" 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Quarantine flag removed"
else
    echo -e "  ${YELLOW}⚠${NC} Could not remove quarantine flag"
    echo "  Run manually: xattr -cr $APP_PATH"
fi

# Step 5: Set permissions
echo "[5/5] Setting permissions..."
chmod -R 755 "$APP_PATH"
chmod +x "$APP_PATH/Contents/MacOS/R-Serve" 2>/dev/null || true

echo -e "  ${GREEN}✓${NC} Permissions set"

# Clean up
echo ""
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

# Success
echo ""
echo -e "${GREEN}✓ Installation completed successfully!${NC}"
echo ""
echo -e "${BOLD}You can now run R-Serve from:${NC}"
echo ""
echo "  • Applications folder"
echo "  • Launchpad"
echo "  • Spotlight (⌘ + Space, type 'R-Serve')"
echo ""
echo -e "${YELLOW}Note:${NC} If macOS shows a security warning on first run,"
echo "  Go to System Preferences → Security & Privacy → General"
echo "  and click 'Open Anyway'"
echo ""
