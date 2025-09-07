# 🍳 Cooking Mama Game

Một game nấu ăn đơn giản được lấy cảm hứng từ Cooking Mama, được phát triển bằng TypeScript và JavaScript.

## 🎮 Tính năng

- **Gameplay đơn giản**: Kéo thả nguyên liệu vào chảo nấu ăn
- **Hệ thống đơn hàng**: Khách hàng đặt đơn với các món ăn khác nhau
- **Tính điểm**: Điểm số dựa trên tốc độ và độ chính xác
- **Cấp độ**: Độ khó tăng dần theo từng cấp
- **Lưu điểm cao**: Database IndexedDB để lưu kỷ lục
- **Giao diện đẹp**: UI responsive với hiệu ứng đẹp mắt
- **Âm thanh**: Hiệu ứng âm thanh cho các hành động

## 🚀 Cách chạy game

### Yêu cầu hệ thống
- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

### Cài đặt

1. **Clone hoặc tải project về máy**
2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy development server:**
   ```bash
   npm run dev
   ```

4. **Mở trình duyệt và truy cập:**
   ```
   http://localhost:3000
   ```

### Build cho production

```bash
npm run build
```

Files sẽ được build vào thư mục `dist/`.

## 🎯 Cách chơi

1. **Bắt đầu game**: Nhấn "Bắt Đầu Chơi" từ menu chính
2. **Xem đơn hàng**: Khách hàng sẽ hiển thị món ăn cần nấu
3. **Kéo nguyên liệu**: Kéo các nguyên liệu từ panel bên trái vào chảo nấu ăn
4. **Phục vụ món ăn**: Khi đã có đủ nguyên liệu, nhấn "Phục vụ món ăn"
5. **Tính điểm**: Điểm số dựa trên:
   - Tốc độ hoàn thành đơn hàng
   - Độ chính xác của nguyên liệu
   - Cấp độ hiện tại

## 🎨 Công nghệ sử dụng

- **TypeScript**: Ngôn ngữ lập trình chính
- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling với animations và responsive design
- **IndexedDB**: Database để lưu điểm cao (sử dụng Dexie.js)
- **Vite**: Build tool và development server
- **Web Audio API**: Tạo hiệu ứng âm thanh

## 📁 Cấu trúc project

```
cooking-mama-game/
├── index.html              # Trang chính
├── styles.css              # CSS styles
├── main.ts                 # Entry point
├── game-engine.ts          # Game logic chính
├── ui-manager.ts           # Quản lý giao diện
├── game-types.ts           # Type definitions
├── game-data.ts            # Dữ liệu game (nguyên liệu, công thức)
├── database.ts             # Database management
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md               # Hướng dẫn này
```

## 🎵 Âm thanh

Game sử dụng Web Audio API để tạo các hiệu ứng âm thanh:
- **Success**: Âm thanh khi hoàn thành đơn hàng
- **Error**: Âm thanh khi làm sai
- **High Score**: Âm thanh khi lập kỷ lục mới
- **Game Over**: Âm thanh khi kết thúc game

## 🎮 Điều khiển

- **Chuột**: Kéo thả nguyên liệu
- **Space**: Phục vụ món ăn (khi có thể)
- **Escape**: Tạm dừng game hoặc quay lại menu

## 🏆 Hệ thống điểm

- **Điểm cơ bản**: Mỗi món ăn có điểm cơ bản khác nhau
- **Bonus thời gian**: Hoàn thành nhanh sẽ được thêm điểm
- **Multiplier cấp độ**: Điểm nhân với hệ số theo cấp độ
- **Penalty**: Trừ điểm khi hết thời gian

## 🔧 Tùy chỉnh

Bạn có thể dễ dàng tùy chỉnh game bằng cách:

1. **Thêm nguyên liệu mới**: Chỉnh sửa `INGREDIENTS` trong `game-data.ts`
2. **Thêm công thức mới**: Chỉnh sửa `RECIPES` trong `game-data.ts`
3. **Thay đổi cấu hình game**: Chỉnh sửa `GameConfig` trong `game-engine.ts`
4. **Tùy chỉnh giao diện**: Chỉnh sửa `styles.css`

## 🐛 Báo lỗi

Nếu bạn gặp lỗi, hãy kiểm tra:
1. Console của trình duyệt (F12)
2. Đảm bảo đã cài đặt đúng dependencies
3. Kiểm tra phiên bản Node.js

## 📝 License

Project này được tạo ra cho mục đích học tập và nghiên cứu.

## 🙏 Lời cảm ơn

Cảm ơn bạn đã chơi game! Chúc bạn có những giây phút vui vẻ với Cooking Mama Game! 🍳✨
