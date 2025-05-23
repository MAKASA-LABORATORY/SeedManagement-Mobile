@echo off
echo Verifying metro.config.js for "util" alias...
findstr /C:"util:" metro.config.js
if %errorlevel% neq 0 (
  echo "util" alias not found in metro.config.js. Please add it manually.
  exit /b 1
) else (
  echo "util" alias found.
)

echo Deleting .expo and .metro-cache folders if they exist...
if exist .expo rmdir /s /q .expo
if exist .metro-cache rmdir /s /q .metro-cache

echo Deleting node_modules folder...
if exist node_modules rmdir /s /q node_modules

echo Running npm install...
npm install

echo Clearing Metro cache and starting Expo...
npx expo start -c
