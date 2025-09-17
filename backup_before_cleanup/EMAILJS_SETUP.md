# EmailJS 設置說明

## 📧 如何設置表單傳送到Gmail

### 步驟1：註冊EmailJS帳號
1. 前往 [EmailJS官網](https://www.emailjs.com/)
2. 點擊 "Sign Up" 註冊免費帳號
3. 驗證您的電子郵件地址

### 步驟2：設置Gmail服務
1. 登入EmailJS控制台
2. 點擊 "Add New Service"
3. 選擇 "Gmail" 服務
4. 按照指示連接您的Gmail帳號
5. 記錄下生成的 **Service ID**

### 步驟3：創建郵件模板
1. 在EmailJS控制台點擊 "Email Templates"
2. 點擊 "Create New Template"
3. 使用以下模板內容：

**模板內容：**
```
主題：新預約申請 - {{from_name}}

您好，

收到新的預約申請：

姓名：{{from_name}}
電子郵件：{{from_email}}
電話：{{phone}}
租賃類型：{{service_type}}
預約日期：{{appointment_date}}
訊息內容：{{message}}

請盡快與客戶聯繫。

此郵件由美業共享工作室網站自動發送。
```

4. 記錄下生成的 **Template ID**

### 步驟4：獲取Public Key
1. 在EmailJS控制台點擊 "Account"
2. 找到 "Public Key" 並複製

### 步驟5：更新網站代碼 ✅ 已完成
在 `script.js` 文件中已更新以下內容：

```javascript
// 第24行：Public Key
emailjs.init("KomhlkEK2lewNA7kM");

// 第410行：Service ID 和 Template ID
emailjs.send('service_e9dc8xx', 'template_contact', {

// 第417行：Gmail地址
to_email: 'liny14705@gmail.com'
```

### 您的EmailJS配置信息：
- **Public Key**: `KomhlkEK2lewNA7kM`
- **Service ID**: `service_e9dc8xx`
- **Template ID**: `template_contact`
- **Gmail地址**: `liny14705@gmail.com`

### 步驟6：測試功能
1. 在網站上填寫聯絡表單
2. 提交表單
3. 檢查您的Gmail收件箱

## 🔧 進階設置

### 自定義郵件模板
您可以在EmailJS控制台中自定義郵件模板，添加：
- 公司Logo
- 更詳細的格式
- 自動回覆功能

### 設置多個收件人
在模板設置中可以添加多個收件人：
- 主要聯絡人
- 備用聯絡人
- 管理員

### 設置自動回覆
1. 在EmailJS中創建第二個模板
2. 設置為客戶自動回覆
3. 在JavaScript中添加回覆邏輯

## 📱 注意事項

1. **免費額度**：EmailJS免費版每月可發送200封郵件
2. **安全性**：Public Key是公開的，但Service ID和Template ID需要保密
3. **備用方案**：建議同時提供電話聯絡方式作為備用

## 🆘 常見問題

**Q: 郵件沒有收到怎麼辦？**
A: 檢查垃圾郵件夾，確認Gmail服務設置正確

**Q: 可以發送到多個郵箱嗎？**
A: 可以，在模板設置中添加多個收件人

**Q: 如何自定義郵件格式？**
A: 在EmailJS模板編輯器中使用HTML格式

## 📞 技術支援

如果遇到問題，可以：
1. 查看EmailJS官方文檔
2. 檢查瀏覽器控制台錯誤訊息
3. 確認所有ID設置正確
