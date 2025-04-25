# Smart Reim Frontend

ระบบเบิกเงินค่าอบรมที่เชื่อมต่อกับ Smart Contract บน Blockchain โดยใช้ React, TypeScript, และ MetaMask

## GitHub & Deployment

- **Demo**: [jirawatchn.github.io/smartreim](https://jirawatchn.github.io/smartreim)
- **Repository**: [github.com/JirawatChn/smartreim](https://github.com/JirawatChn/smartreim)


## Technology

- React + Vite + TypeScript
- Ethers.js (เชื่อมต่อกับ Smart Contract)
- Tailwind CSS (สำหรับ UI)
- React Router v6 (จัดการเส้นทาง)
- MetaMask (เชื่อมต่อกระเป๋าเงิน)
- Solidity (ภาษาเขียน Smart Contract)

---

## System Features

### ทุกคน (Guest)
- หน้า Login Metamask
- ทำงานได้เหมือน User เมื่อเข้ามาใช้งานครั้งแรก
- สามารถเปลี่ยน Role เป็นได้ทั้ง User และ Admin

### ฝั่งพนักงาน (User)
- หน้าแดชบอร๋ดแสดงจำนวนคำขอที่ส่ง, สถานะคำขอ (Pending / Approved / Rejected), และยอดรวมทั้งหมด
- กรอกแบบฟอร์มเพื่อส่งคำขอเบิกเงิน
- เลือกชื่อคอร์สและแผนกจาก dropdown
- ตรวจสอบสถานะคำขอของตนเองได้
- ดูรายละเอียดของคำขอแต่ละรายการ
- ยกเลิกคำขอได้ (เฉพาะสถานะ Pending)

### ฝั่งผู้ดูแลระบบ (Admin)
- หน้าแดชบอร๋ดแสดงจำนวนคำขอทั้งหมดที่ระบบได้รับ
- ดูรายการคำขอทั้งหมดเรียงตามสถานะ
- กรองเฉพาะคำขอที่ Pending ได้
- เปิดดูรายละเอียดคำขอ
- อนุมัติหรือปฏิเสธคำขอ พร้อมใส่หมายเหตุ
- ส่ง ETH ไปยังผู้ยื่นคำขอ (หากอนุมัติ)

---
## ตัวอย่างหน้า Frontend

### หน้า Dashboard (Admin)
![Dashboard](https://jirawatchn.github.io/smartreim/image/dashboard.png)

### หน้า รายละเอียดคำขอ (Admin)
![Admin Request Detail](https://jirawatchn.github.io/smartreim/image/admin-request.png)

### หน้า เปลี่ยนสถานะ (Admin)
![Set Role](https://jirawatchn.github.io/smartreim/image/setrole.png)

### หน้า ส่งคำขอเบิกค่าอบรม (Guest/User)
![Send Request](https://jirawatchn.github.io/smartreim/image/user-request.png)

### หน้า รายละเอียดคำขอ (User)
![User Request Detail](https://jirawatchn.github.io/smartreim/image/user-request-detail.png)

### หน้า คำขอของฉัน (User)
![User Table](https://jirawatchn.github.io/smartreim/image/user-table.png)
