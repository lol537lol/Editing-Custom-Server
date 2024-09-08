@echo off
cd /d "D:\server only\BlackSmokehere"

start cmd /k "npm run wds"
start cmd /k "npm run ts-watch"
start cmd /k "gulp test"
start cmd /k "gulp dev --sprites"
