@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  node build.mjs
) else if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
  "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" build.mjs
) else (
  echo Node.js was not found. Please ask Codex to rebuild the website after editing content.json.
  pause
  exit /b 1
)
if errorlevel 1 (
  echo Update failed. Check content.json for missing commas or quotation marks.
  pause
  exit /b 1
)
echo Website updated. Open index.html or refresh your browser.
pause
