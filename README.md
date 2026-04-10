This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
[demo]
<img width="1916" height="1031" alt="image" src="https://github.com/user-attachments/assets/d5de991e-a45d-4fdb-b6eb-bb20711a3816" />
📦 Blockchain Product Authenticator (DApp)
Dự án Blockchain Product Authenticator là một ứng dụng phi tập trung (DApp) cho phép người dùng đăng ký thông tin sản phẩm lên Blockchain (mạng Sepolia Testnet). Ứng dụng giúp minh bạch hóa nguồn gốc sản phẩm, lưu trữ dữ liệu không thể thay đổi và cung cấp mã QR để xác minh nhanh chóng.

✨ Tính năng chính
Đăng ký sản phẩm: Lưu trữ tên, mô tả, vị trí/nguồn gốc và hình ảnh sản phẩm lên Smart Contract.

Truy xuất dữ liệu thời gian thực: Đọc danh sách sản phẩm trực tiếp từ Blockchain thông qua Ethers.js.

Xác thực qua mã QR: Tự động tạo mã QR chứa thông tin định danh sản phẩm để quét và kiểm tra.

Tích hợp Ví MetaMask: Kết nối và thực hiện giao dịch thông qua ví điện tử phổ biến nhất.

Giao diện hiện đại: Xây dựng bằng Next.js, đáp ứng tốt trải nghiệm người dùng với hệ thống thông báo react-toastify.

🛠 Công nghệ sử dụng
Frontend
Next.js 14+: React Framework mạnh mẽ cho ứng dụng web.

Ethers.js v6: Thư viện tương tác với Ethereum Blockchain.

QRCode.react: Thư viện tạo mã QR động.

React Toastify: Hiển thị thông báo trạng thái giao dịch sinh động.

Blockchain
Solidity: Ngôn ngữ lập trình Smart Contract.

EVM (Ethereum Virtual Machine): Môi trường thực thi.

Sepolia Testnet: Mạng thử nghiệm để deploy contract.

🚀 Hướng dẫn cài đặt và chạy
1. Yêu cầu hệ thống
Đã cài đặt Node.js (phiên bản 18 trở lên).

Trình duyệt đã cài đặt tiện ích MetaMask.

Có một ít phí Sepolia ETH trong ví (lấy từ các Faucet miễn phí).

2. Cài đặt
Mở terminal và chạy các lệnh sau:

Bash
# Clone dự án
git clone https://github.com/username/ten-du-an.git

# Vào thư mục dự án
cd ten-du-an

# Cài đặt các thư viện bổ trợ
npm install
3. Cấu hình
Mở file constants.js và cập nhật các thông tin sau:

JavaScript
export const contractAddress = "ĐỊA_CHỈ_SMART_CONTRACT_CỦA_BẠN";
export const abi = [ /* Dán ABI lấy từ Remix sau khi Compile */ ];
4. Chạy ứng dụng
Bash
npm run dev
Truy cập: http://localhost:3000 để trải nghiệm.

📝 Quy trình hoạt động (Workflow)
Kết nối ví: Người dùng kết nối ví MetaMask với ứng dụng.

Nhập liệu: Điền thông tin sản phẩm và chọn ảnh.

Lưu trữ:

Ảnh hiện tại đang được mô phỏng qua link URL (Hoặc tích hợp IPFS trong tương lai để tối ưu phí Gas).

Thông tin text (Tên, vị trí...) được ghi trực tiếp vào Blockchain.

Xác nhận: Người dùng ký giao dịch trên MetaMask.

Hiển thị: Sau khi Block được xác nhận, sản phẩm sẽ xuất hiện trong danh sách kèm mã QR xác thực.


🤝 Đóng góp
Mọi đóng góp nhằm cải thiện dự án đều được chào đón. Vui lòng tạo Issue hoặc Pull Request nếu bạn có ý tưởng mới.

