@echo off
setlocal
chcp 65001 >nul
title M HANS GROUP - Finans Yonetimi

rem Always work beside this file, regardless of the terminal's current folder.
cd /d "%~dp0"
set "MHANS_PROJECT_DIR=%CD%"

echo M HANS GROUP - Ahmet Bulut
echo Proje klasoru: "%MHANS_PROJECT_DIR%"
echo.

if not exist "package.json" (
  echo HATA: package.json bulunamadi.
  echo ZIP'e sag tiklayip Tumunu Ayikla secenegini kullanin.
  echo BASLAT.cmd dosyasini ZIP icinden degil, cikarilan klasorden acin.
  pause
  exit /b 1
)
if not exist "package-lock.json" (
  echo HATA: package-lock.json bulunamadi. Proje dosyalari eksik.
  echo GitHub'dan guncel ZIP'i yeniden indirip Tumunu Ayikla ile cikarin.
  pause
  exit /b 1
)
where node.exe >nul 2>&1
if errorlevel 1 (
  echo HATA: Node.js bulunamadi. nodejs.org adresinden LTS surumunu kurun.
  echo Kurulumdan sonra bu pencereyi kapatip BASLAT.cmd dosyasini tekrar acin.
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo HATA: npm bulunamadi. Node.js LTS kurulumunu tamamlayin.
  pause
  exit /b 1
)
echo Node.js surumu:
node.exe --version
echo npm surumu:
call npm.cmd --version
echo.
echo Bagimliliklar kuruluyor. Ilk kurulumda internet gerekir.
call npm.cmd --prefix "%MHANS_PROJECT_DIR%" ci --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo Kurulum tamamlanamadi. Yukaridaki hata mesajini ve proje klasorunu paylasin.
  pause
  exit /b 1
)
echo.
echo Uygulama baslatiliyor. Bu pencere acik kalmali.
echo Tarayicinizda terminaldeki Local adresini acin.
echo Durdurmak icin Ctrl+C tuslarina basin.
echo.
call npm.cmd --prefix "%MHANS_PROJECT_DIR%" run dev
if errorlevel 1 (
  echo.
  echo Baslatma tamamlanamadi. Yukaridaki hata mesajini paylasin.
  pause
  exit /b 1
)
endlocal
