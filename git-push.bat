@echo off
setlocal enabledelayedexpansion

:: ===========================================
:: Git 自動化推送腳本
:: 用途：自動化 Git 提交與推送流程，支援版本標籤
:: 作者：AI 開發網站術語工具
:: 版本：1.0.0
:: ===========================================

:: 設定顏色代碼
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "RESET=[0m"

:: 顯示腳本標題
echo.
echo %BLUE%===========================================%RESET%
echo %BLUE%        Git 自動化推送腳本 v1.0.0        %RESET%
echo %BLUE%===========================================%RESET%
echo.

:: 檢查是否在 Git 儲存庫中
echo %YELLOW%[步驟 1] 檢查 Git 儲存庫狀態...%RESET%
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%錯誤：當前目錄不是 Git 儲存庫！%RESET%
    echo %RED%請確保在正確的專案目錄中執行此腳本。%RESET%
    pause
    exit /b 1
)
echo %GREEN%✓ Git 儲存庫檢查通過%RESET%
echo.

:: 設定提交訊息
if "%1"=="" (
    set "COMMIT_MSG=Auto-commit"
    echo %YELLOW%[資訊] 使用預設提交訊息：Auto-commit%RESET%
) else (
    set "COMMIT_MSG=%1"
    echo %YELLOW%[資訊] 使用自訂提交訊息：%COMMIT_MSG%%RESET%
)
echo.

:: 檢查是否有變更需要提交
echo %YELLOW%[步驟 2] 檢查檔案變更...%RESET%
git diff --quiet && git diff --cached --quiet
if %errorlevel% equ 0 (
    echo %YELLOW%[警告] 沒有檢測到任何變更需要提交%RESET%
    echo %YELLOW%[警告] 是否要繼續執行？(Y/N)%RESET%
    set /p "CONTINUE=請輸入選擇："
    if /i not "!CONTINUE!"=="Y" (
        echo %RED%操作已取消%RESET%
        pause
        exit /b 0
    )
)
echo %GREEN%✓ 檔案變更檢查完成%RESET%
echo.

:: 執行 git add .
echo %YELLOW%[步驟 3] 將檔案加入暫存區...%RESET%
echo %BLUE%執行指令：git add .%RESET%
git add .
if %errorlevel% neq 0 (
    echo %RED%錯誤：git add 執行失敗！%RESET%
    pause
    exit /b 1
)
echo %GREEN%✓ 檔案已成功加入暫存區%RESET%
echo.

:: 執行 git commit
echo %YELLOW%[步驟 4] 提交變更...%RESET%
echo %BLUE%執行指令：git commit -m "%COMMIT_MSG%"%RESET%
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo %RED%錯誤：git commit 執行失敗！%RESET%
    pause
    exit /b 1
)
echo %GREEN%✓ 變更已成功提交%RESET%
echo.

:: 執行 git push
echo %YELLOW%[步驟 5] 推送到遠端儲存庫...%RESET%
echo %BLUE%執行指令：git push%RESET%
git push
if %errorlevel% neq 0 (
    echo %RED%錯誤：git push 執行失敗！%RESET%
    echo %RED%請檢查網路連線和遠端儲存庫設定%RESET%
    pause
    exit /b 1
)
echo %GREEN%✓ 程式碼已成功上傳至 GitHub%RESET%
echo.

:: 檢查是否需要建立標籤
if not "%2"=="" (
    echo %YELLOW%[步驟 6] 建立版本標籤...%RESET%
    set "TAG_NAME=%2"
    echo %BLUE%執行指令：git tag %TAG_NAME%%RESET%
    git tag %TAG_NAME%
    if %errorlevel% neq 0 (
        echo %RED%錯誤：建立標籤失敗！%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%✓ 標籤 %TAG_NAME% 已成功建立%RESET%
    echo.
    
    echo %YELLOW%[步驟 7] 推送標籤到遠端...%RESET%
    echo %BLUE%執行指令：git push --tags%RESET%
    git push --tags
    if %errorlevel% neq 0 (
        echo %RED%錯誤：推送標籤失敗！%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%✓ 標籤 %TAG_NAME% 已成功推送到遠端%RESET%
    echo.
)

:: 顯示完成訊息
echo %GREEN%===========================================%RESET%
echo %GREEN%           操作完成！            %RESET%
echo %GREEN%===========================================%RESET%
echo.
echo %GREEN%✓ 程式碼已成功上傳至 GitHub%RESET%
if not "%2"=="" (
    echo %GREEN%✓ 版本標籤 %2 已成功建立並推送%RESET%
)
echo.
echo %BLUE%感謝使用 Git 自動化推送腳本！%RESET%
echo.

:: 顯示最近的提交記錄
echo %YELLOW%[資訊] 最近的提交記錄：%RESET%
git log --oneline -3
echo.

pause
