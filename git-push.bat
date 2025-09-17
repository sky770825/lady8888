@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ===========================================
:: Git 自動化推送腳本
:: 用途：自動化 Git 提交與推送流程，支援版本標籤
:: 作者：AI 開發網站術語工具
:: 版本：1.0.0
:: ===========================================

:: 顯示腳本標題
echo.
echo ===========================================
echo        Git 自動化推送腳本 v1.0.0        
echo ===========================================
echo.

:: 檢查是否在 Git 儲存庫中
echo [步驟 1] 檢查 Git 儲存庫狀態...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤：當前目錄不是 Git 儲存庫！
    echo ❌ 請確保在正確的專案目錄中執行此腳本。
    pause
    exit /b 1
)
echo ✅ Git 儲存庫檢查通過
echo.

:: 設定提交訊息
if "%1"=="" (
    set "COMMIT_MSG=Auto-commit"
    echo [資訊] 使用預設提交訊息：Auto-commit
) else (
    set "COMMIT_MSG=%1"
    echo [資訊] 使用自訂提交訊息：%COMMIT_MSG%
)
echo.

:: 檢查是否有變更需要提交
echo [步驟 2] 檢查檔案變更...
git diff --quiet && git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ⚠️  [警告] 沒有檢測到任何變更需要提交
    echo ⚠️  [警告] 是否要繼續執行？(Y/N)
    set /p "CONTINUE=請輸入選擇："
    if /i not "!CONTINUE!"=="Y" (
        echo ❌ 操作已取消
        pause
        exit /b 0
    )
)
echo ✅ 檔案變更檢查完成
echo.

:: 執行 git add .
echo [步驟 3] 將檔案加入暫存區...
echo 執行指令：git add .
git add .
if %errorlevel% neq 0 (
    echo ❌ 錯誤：git add 執行失敗！
    pause
    exit /b 1
)
echo ✅ 檔案已成功加入暫存區
echo.

:: 執行 git commit
echo [步驟 4] 提交變更...
echo 執行指令：git commit -m "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo ❌ 錯誤：git commit 執行失敗！
    pause
    exit /b 1
)
echo ✅ 變更已成功提交
echo.

:: 執行 git push
echo [步驟 5] 推送到遠端儲存庫...
echo 執行指令：git push
git push
if %errorlevel% neq 0 (
    echo ❌ 錯誤：git push 執行失敗！
    echo ❌ 請檢查網路連線和遠端儲存庫設定
    pause
    exit /b 1
)
echo ✅ 程式碼已成功上傳至 GitHub
echo.

:: 檢查是否需要建立標籤
if not "%2"=="" (
    echo [步驟 6] 建立版本標籤...
    set "TAG_NAME=%2"
    echo 執行指令：git tag %TAG_NAME%
    git tag %TAG_NAME%
    if %errorlevel% neq 0 (
        echo ❌ 錯誤：建立標籤失敗！
        pause
        exit /b 1
    )
    echo ✅ 標籤 %TAG_NAME% 已成功建立
    echo.
    
    echo [步驟 7] 推送標籤到遠端...
    echo 執行指令：git push --tags
    git push --tags
    if %errorlevel% neq 0 (
        echo ❌ 錯誤：推送標籤失敗！
        pause
        exit /b 1
    )
    echo ✅ 標籤 %TAG_NAME% 已成功推送到遠端
    echo.
)

:: 顯示完成訊息
echo ===========================================
echo           操作完成！            
echo ===========================================
echo.
echo ✅ 程式碼已成功上傳至 GitHub
if not "%2"=="" (
    echo ✅ 版本標籤 %2 已成功建立並推送
)
echo.
echo 感謝使用 Git 自動化推送腳本！
echo.

:: 顯示最近的提交記錄
echo [資訊] 最近的提交記錄：
git log --oneline -3
echo.

pause
