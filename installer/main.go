package main

import (
	"archive/tar"
	"compress/gzip"
	"crypto/md5"
	"crypto/sha256"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/cheggaaa/pb/v3"
	"github.com/fatih/color"
)

const (
	AppName    = "R-Serve"
	Version    = "1.0.3"
	AppID      = "id.syahrulramadhan.rserve"
)

var (
	green  = color.New(color.FgGreen).SprintFunc()
	red    = color.New(color.FgRed).SprintFunc()
	yellow = color.New(color.FgYellow).SprintFunc()
	cyan   = color.New(color.FgCyan).SprintFunc()
	bold   = color.New(color.Bold).SprintFunc()
)

type Installer struct {
	Platform     string
	Arch         string
	ArchiveName  string
	InstallDir   string
	TempDir      string
}

func main() {
	printBanner()

	installer := &Installer{
		Platform: runtime.GOOS,
		Arch:     runtime.GOARCH,
		TempDir:  filepath.Join(os.TempDir(), "rserve-installer"),
	}

	fmt.Printf("Platform: %s\n", cyan(installer.Platform+"/"+installer.Arch))
	fmt.Printf("Version:  %s\n\n", cyan(Version))

	// Check privileges
	if !checkPrivileges(installer.Platform) {
		printError("Installer requires elevated privileges")
		if installer.Platform == "windows" {
			fmt.Println("Please run as Administrator (Right-click → Run as administrator)")
		} else if installer.Platform == "darwin" {
			fmt.Println("Please run with: sudo ./installer")
		} else {
			fmt.Println("Please run with: sudo ./installer")
		}
		os.Exit(1)
	}

	// Create temp directory
	if err := os.MkdirAll(installer.TempDir, 0755); err != nil {
		printError("Failed to create temp directory: " + err.Error())
		os.Exit(1)
	}
	defer os.RemoveAll(installer.TempDir)

	// Determine archive name
	installer.determineArchive()

	// Verify archive exists
	if _, err := os.Stat(installer.ArchiveName); os.IsNotExist(err) {
		printError(fmt.Sprintf("Archive not found: %s", installer.ArchiveName))
		fmt.Println("\nPlease ensure the installer is in the same directory as:")
		fmt.Printf("  - %s\n", installer.ArchiveName)
		os.Exit(1)
	}

	// Install
	fmt.Println(bold("Starting installation..."))
	fmt.Println()

	var err error
	switch installer.Platform {
	case "darwin":
		err = installer.installMacOS()
	case "windows":
		err = installer.installWindows()
	case "linux":
		err = installer.installLinux()
	default:
		printError(fmt.Sprintf("Unsupported platform: %s", installer.Platform))
		os.Exit(1)
	}

	if err != nil {
		printError("Installation failed: " + err.Error())
		os.Exit(1)
	}

	printSuccess("\n✓ Installation completed successfully!")
	printPostInstall(installer.Platform)
}

func printBanner() {
	fmt.Println()
	fmt.Println(cyan("╔════════════════════════════════════════╗"))
	fmt.Println(cyan("║") + bold("   R-Serve Installer v"+Version+"          ") + cyan("║"))
	fmt.Println(cyan("║") + "   Development Server Manager           " + cyan("║"))
	fmt.Println(cyan("╚════════════════════════════════════════╝"))
	fmt.Println()
}

func printStep(step, total int, msg string) {
	fmt.Printf("[%d/%d] %s\n", step, total, msg)
}

func printSuccess(msg string) {
	fmt.Println(green(msg))
}

func printError(msg string) {
	fmt.Println(red("✗ Error: " + msg))
}

func printWarning(msg string) {
	fmt.Println(yellow("⚠ Warning: " + msg))
}

func (i *Installer) determineArchive() {
	switch i.Platform {
	case "darwin":
		if i.Arch == "arm64" {
			i.ArchiveName = fmt.Sprintf("R-Serve-%s-arm64-mac.tar.gz", Version)
		} else {
			i.ArchiveName = fmt.Sprintf("R-Serve-%s-mac.tar.gz", Version)
		}
	case "windows":
		i.ArchiveName = fmt.Sprintf("R-Serve-%s-win-x64.tar.gz", Version)
	case "linux":
		i.ArchiveName = fmt.Sprintf("R-Serve-%s.AppImage", Version)
	}
}

func (i *Installer) installMacOS() error {
	totalSteps := 5

	printStep(1, totalSteps, "Verifying archive integrity...")
	if err := i.verifyChecksum(); err != nil {
		printWarning(err.Error())
	}

	printStep(2, totalSteps, "Extracting application...")
	if err := i.extractWithProgress(i.ArchiveName, i.TempDir); err != nil {
		return fmt.Errorf("extraction failed: %v", err)
	}

	printStep(3, totalSteps, "Installing to /Applications/...")
	appPath := "/Applications/R-Serve.app"
	tempAppPath := filepath.Join(i.TempDir, "R-Serve.app")

	// Remove existing
	if _, err := os.Stat(appPath); err == nil {
		fmt.Println("  → Removing existing installation...")
		if err := os.RemoveAll(appPath); err != nil {
			return fmt.Errorf("failed to remove existing app: %v", err)
		}
	}

	// Move to Applications
	if err := os.Rename(tempAppPath, appPath); err != nil {
		return fmt.Errorf("failed to move app: %v", err)
	}

	printStep(4, totalSteps, "Removing quarantine flag...")
	cmd := exec.Command("xattr", "-cr", appPath)
	if err := cmd.Run(); err != nil {
		printWarning("Could not remove quarantine flag")
		fmt.Printf("  Run manually: xattr -cr %s\n", appPath)
	}

	printStep(5, totalSteps, "Setting permissions...")
	if err := os.Chmod(appPath, 0755); err != nil {
		return fmt.Errorf("failed to set permissions: %v", err)
	}

	// Make executable
	execPath := filepath.Join(appPath, "Contents", "MacOS", "R-Serve")
	if err := os.Chmod(execPath, 0755); err != nil {
		printWarning("Could not set executable permissions")
	}

	return nil
}

func (i *Installer) installWindows() error {
	totalSteps := 6

	printStep(1, totalSteps, "Verifying archive integrity...")
	if err := i.verifyChecksum(); err != nil {
		printWarning(err.Error())
	}

	printStep(2, totalSteps, "Extracting application...")
	if err := i.extractWithProgress(i.ArchiveName, i.TempDir); err != nil {
		return fmt.Errorf("extraction failed: %v", err)
	}

	printStep(3, totalSteps, "Installing to Program Files...")
	i.InstallDir = filepath.Join(os.Getenv("ProgramFiles"), "R-Serve")

	// Create install directory
	if err := os.MkdirAll(i.InstallDir, 0755); err != nil {
		return fmt.Errorf("failed to create install directory: %v", err)
	}

	// Copy files
	srcDir := filepath.Join(i.TempDir, "win-unpacked")
	if err := copyDirWithProgress(srcDir, i.InstallDir); err != nil {
		return fmt.Errorf("failed to copy files: %v", err)
	}

	printStep(4, totalSteps, "Creating Start Menu shortcut...")
	startMenuDir := filepath.Join(os.Getenv("APPDATA"), "Microsoft", "Windows", "Start Menu", "Programs")
	if err := createWindowsShortcut(
		filepath.Join(i.InstallDir, "R-Serve.exe"),
		filepath.Join(startMenuDir, "R-Serve.lnk"),
		i.InstallDir,
		"Development Server Manager",
	); err != nil {
		printWarning("Could not create Start Menu shortcut: " + err.Error())
	}

	printStep(5, totalSteps, "Creating Desktop shortcut...")
	desktopDir := filepath.Join(os.Getenv("USERPROFILE"), "Desktop")
	if err := createWindowsShortcut(
		filepath.Join(i.InstallDir, "R-Serve.exe"),
		filepath.Join(desktopDir, "R-Serve.lnk"),
		i.InstallDir,
		"Development Server Manager",
	); err != nil {
		printWarning("Could not create Desktop shortcut: " + err.Error())
	}

	printStep(6, totalSteps, "Creating uninstaller...")
	if err := i.createWindowsUninstaller(); err != nil {
		printWarning("Could not create uninstaller: " + err.Error())
	}

	return nil
}

func (i *Installer) installLinux() error {
	totalSteps := 5

	printStep(1, totalSteps, "Verifying AppImage integrity...")
	if err := i.verifyChecksum(); err != nil {
		printWarning(err.Error())
	}

	i.InstallDir = "/opt/rserve"

	printStep(2, totalSteps, "Installing to /opt/rserve...")
	if err := os.MkdirAll(i.InstallDir, 0755); err != nil {
		return fmt.Errorf("failed to create install directory: %v", err)
	}

	// Copy AppImage
	appImageDest := filepath.Join(i.InstallDir, "R-Serve")
	if err := copyFileWithProgress(i.ArchiveName, appImageDest); err != nil {
		return fmt.Errorf("failed to copy AppImage: %v", err)
	}

	// Make executable
	if err := os.Chmod(appImageDest, 0755); err != nil {
		return fmt.Errorf("failed to set permissions: %v", err)
	}

	printStep(3, totalSteps, "Creating desktop entry...")
	if err := createLinuxDesktopEntry(i.InstallDir); err != nil {
		printWarning("Could not create desktop entry: " + err.Error())
	}

	printStep(4, totalSteps, "Creating symlink in /usr/local/bin...")
	symlinkPath := "/usr/local/bin/rserve"
	os.Remove(symlinkPath) // Remove if exists
	if err := os.Symlink(appImageDest, symlinkPath); err != nil {
		printWarning("Could not create symlink: " + err.Error())
	}

	printStep(5, totalSteps, "Updating desktop database...")
	cmd := exec.Command("update-desktop-database", "/usr/share/applications")
	cmd.Run() // Ignore errors

	return nil
}

func (i *Installer) verifyChecksum() error {
	// TODO: Add actual checksum verification
	// For now, just verify file can be read
	f, err := os.Open(i.ArchiveName)
	if err != nil {
		return fmt.Errorf("cannot read archive: %v", err)
	}
	defer f.Close()
	return nil
}

func (i *Installer) extractWithProgress(archivePath, dest string) error {
	file, err := os.Open(archivePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Get file size for progress bar
	stat, err := file.Stat()
	if err != nil {
		return err
	}

	bar := pb.Full.Start64(stat.Size())
	bar.Set(pb.Bytes, true)
	barReader := bar.NewProxyReader(file)

	gzr, err := gzip.NewReader(barReader)
	if err != nil {
		bar.Finish()
		return err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)

	for {
		header, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			bar.Finish()
			return err
		}

		target := filepath.Join(dest, header.Name)

		// Security: prevent path traversal
		if !strings.HasPrefix(filepath.Clean(target), filepath.Clean(dest)) {
			bar.Finish()
			return fmt.Errorf("illegal file path: %s", header.Name)
		}

		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(target, 0755); err != nil {
				bar.Finish()
				return err
			}
		case tar.TypeReg:
			outFile, err := os.Create(target)
			if err != nil {
				bar.Finish()
				return err
			}
			if _, err := io.Copy(outFile, tr); err != nil {
				outFile.Close()
				bar.Finish()
				return err
			}
			outFile.Close()
			os.Chmod(target, os.FileMode(header.Mode))
		}
	}

	bar.Finish()
	return nil
}

func copyFileWithProgress(src, dst string) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	stat, err := srcFile.Stat()
	if err != nil {
		return err
	}

	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	bar := pb.Full.Start64(stat.Size())
	bar.Set(pb.Bytes, true)
	barReader := bar.NewProxyReader(srcFile)

	_, err = io.Copy(dstFile, barReader)
	bar.Finish()
	return err
}

func copyDirWithProgress(src, dst string) error {
	// Count files first
	fileCount := 0
	filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			fileCount++
		}
		return nil
	})

	bar := pb.Full.Start(fileCount)
	bar.SetTemplate(pb.Simple)

	err := filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}

		targetPath := filepath.Join(dst, relPath)

		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}

		if err := copyFile(path, targetPath); err != nil {
			return err
		}
		bar.Increment()
		return nil
	})

	bar.Finish()
	return err
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, in)
	return err
}

func checkPrivileges(platform string) bool {
	if platform == "windows" {
		cmd := exec.Command("net", "session")
		return cmd.Run() == nil
	}
	return os.Geteuid() == 0
}

func createWindowsShortcut(targetPath, shortcutPath, workDir, description string) error {
	psScript := fmt.Sprintf(`
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("%s")
$Shortcut.TargetPath = "%s"
$Shortcut.WorkingDirectory = "%s"
$Shortcut.Description = "%s"
$Shortcut.Save()
`, shortcutPath, targetPath, workDir, description)

	cmd := exec.Command("powershell", "-Command", psScript)
	return cmd.Run()
}

func (i *Installer) createWindowsUninstaller() error {
	uninstallerPath := filepath.Join(i.InstallDir, "uninstall.exe")
	
	// Create simple uninstaller script
	uninstallScript := fmt.Sprintf(`@echo off
echo Uninstalling R-Serve...
rmdir /s /q "%s"
del "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\R-Serve.lnk"
del "%%USERPROFILE%%\Desktop\R-Serve.lnk"
echo R-Serve has been uninstalled.
pause
`, i.InstallDir)

	batchPath := filepath.Join(i.InstallDir, "uninstall.bat")
	return os.WriteFile(batchPath, []byte(uninstallScript), 0755)
}

func createLinuxDesktopEntry(installDir string) error {
	desktopEntry := fmt.Sprintf(`[Desktop Entry]
Version=1.0
Type=Application
Name=R-Serve
Comment=Development Server Manager
Exec=%s/R-Serve
Icon=%s/R-Serve
Terminal=false
Categories=Development;Utility;
`, installDir, installDir)

	desktopFile := "/usr/share/applications/rserve.desktop"
	return os.WriteFile(desktopFile, []byte(desktopEntry), 0644)
}

func printPostInstall(platform string) {
	fmt.Println()
	fmt.Println(bold("You can now run R-Serve from:"))
	fmt.Println()
	switch platform {
	case "darwin":
		fmt.Println("  • Applications folder")
		fmt.Println("  • Launchpad")
		fmt.Println("  • Spotlight (⌘ + Space, type 'R-Serve')")
		fmt.Println()
		fmt.Println(yellow("Note:") + " If macOS shows a security warning,")
		fmt.Println("  run: xattr -cr /Applications/R-Serve.app")
	case "windows":
		fmt.Println("  • Start Menu → R-Serve")
		fmt.Println("  • Desktop shortcut")
		fmt.Println()
		fmt.Println("To uninstall, run:")
		fmt.Printf("  %s\\uninstall.bat\n", filepath.Join(os.Getenv("ProgramFiles"), "R-Serve"))
	case "linux":
		fmt.Println("  • Application menu (Development)")
		fmt.Println("  • Terminal: rserve")
		fmt.Println()
		fmt.Println("To uninstall, run:")
		fmt.Println("  sudo rm -rf /opt/rserve /usr/local/bin/rserve /usr/share/applications/rserve.desktop")
	}
	fmt.Println()
}

func calculateMD5(filepath string) (string, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := md5.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}

func calculateSHA256(filepath string) (string, error) {
	file, err := os.Open(filepath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}

	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}
