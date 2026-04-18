import { Transaction } from "@/types";
import { format, subDays, subMonths, setHours, setMinutes } from "date-fns";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeDate(daysAgo: number, hour = 12, min = 0) {
  const d = setMinutes(setHours(subDays(new Date(), daysAgo), hour), min);
  return d.toISOString();
}

export const SEED_TRANSACTIONS: Transaction[] = [
  // === Tháng này ===
  // Thu nhập
  {
    id: makeId(), type: "income", amount: 12_000_000, title: "Lương tháng 4",
    category: "salary", note: "Lương tháng 4/2026", date: makeDate(18, 9, 0),
    createdAt: makeDate(18), updatedAt: makeDate(18),
  },
  {
    id: makeId(), type: "income", amount: 500_000, title: "Thưởng dự án",
    category: "bonus", note: "", date: makeDate(10, 14, 30),
    createdAt: makeDate(10), updatedAt: makeDate(10),
  },
  {
    id: makeId(), type: "income", amount: 200_000, title: "Hoàn tiền đơn hàng",
    category: "refund", note: "Shopee hoàn tiền", date: makeDate(5, 10, 0),
    createdAt: makeDate(5), updatedAt: makeDate(5),
  },

  // Chi tiêu - Ăn uống
  { id: makeId(), type: "expense", amount: 25_000, title: "Suất cơm trưa", category: "food", note: "Cơm bình dân đầu phố", date: makeDate(0, 12, 0), createdAt: makeDate(0), updatedAt: makeDate(0) },
  { id: makeId(), type: "expense", amount: 30_000, title: "Cà phê buổi sáng", category: "food", note: "Cà phê Highlands", date: makeDate(0, 8, 30), createdAt: makeDate(0), updatedAt: makeDate(0) },
  { id: makeId(), type: "expense", amount: 45_000, title: "Bún bò bữa tối", category: "food", note: "", date: makeDate(1, 19, 0), createdAt: makeDate(1), updatedAt: makeDate(1) },
  { id: makeId(), type: "expense", amount: 22_000, title: "Bánh mì buổi sáng", category: "food", note: "", date: makeDate(1, 7, 30), createdAt: makeDate(1), updatedAt: makeDate(1) },
  { id: makeId(), type: "expense", amount: 55_000, title: "Bữa trưa văn phòng", category: "food", note: "Đặt GrabFood", date: makeDate(2, 12, 15), createdAt: makeDate(2), updatedAt: makeDate(2) },
  { id: makeId(), type: "expense", amount: 120_000, title: "Ăn tối cùng bạn bè", category: "food", note: "Lẩu tại nhà hàng", date: makeDate(3, 19, 30), createdAt: makeDate(3), updatedAt: makeDate(3) },
  { id: makeId(), type: "expense", amount: 28_000, title: "Cơm trưa", category: "food", note: "", date: makeDate(4, 12, 0), createdAt: makeDate(4), updatedAt: makeDate(4) },
  { id: makeId(), type: "expense", amount: 35_000, title: "Trà sữa chiều", category: "food", note: "Gong Cha size L", date: makeDate(4, 15, 0), createdAt: makeDate(4), updatedAt: makeDate(4) },
  { id: makeId(), type: "expense", amount: 40_000, title: "Phở buổi sáng", category: "food", note: "", date: makeDate(5, 7, 0), createdAt: makeDate(5), updatedAt: makeDate(5) },
  { id: makeId(), type: "expense", amount: 30_000, title: "Cơm hộp tối", category: "food", note: "", date: makeDate(6, 19, 0), createdAt: makeDate(6), updatedAt: makeDate(6) },
  { id: makeId(), type: "expense", amount: 25_000, title: "Bánh mì", category: "food", note: "", date: makeDate(7, 8, 0), createdAt: makeDate(7), updatedAt: makeDate(7) },
  { id: makeId(), type: "expense", amount: 60_000, title: "Pizza 1 người", category: "food", note: "Domino's", date: makeDate(8, 19, 30), createdAt: makeDate(8), updatedAt: makeDate(8) },

  // Chi tiêu - Di chuyển
  { id: makeId(), type: "expense", amount: 50_000, title: "Xăng xe máy", category: "transport", note: "Đổ xăng RON 95", date: makeDate(2, 17, 0), createdAt: makeDate(2), updatedAt: makeDate(2) },
  { id: makeId(), type: "expense", amount: 35_000, title: "Grab xe ôm", category: "transport", note: "Đi làm buổi sáng", date: makeDate(3, 8, 0), createdAt: makeDate(3), updatedAt: makeDate(3) },
  { id: makeId(), type: "expense", amount: 50_000, title: "Đổ xăng", category: "transport", note: "", date: makeDate(9, 17, 30), createdAt: makeDate(9), updatedAt: makeDate(9) },
  { id: makeId(), type: "expense", amount: 45_000, title: "Grab đi sân bay", category: "transport", note: "", date: makeDate(12, 6, 0), createdAt: makeDate(12), updatedAt: makeDate(12) },

  // Chi tiêu - Mua sắm
  { id: makeId(), type: "expense", amount: 200_000, title: "Mua quà sinh nhật", category: "gift", note: "Quà cho bạn thân", date: makeDate(6, 14, 0), createdAt: makeDate(6), updatedAt: makeDate(6) },
  { id: makeId(), type: "expense", amount: 350_000, title: "Mua đồ gia dụng", category: "shopping", note: "Rổ, chậu, hộp đựng", date: makeDate(7, 15, 30), createdAt: makeDate(7), updatedAt: makeDate(7) },
  { id: makeId(), type: "expense", amount: 150_000, title: "Áo thun", category: "shopping", note: "Uniqlo sale 30%", date: makeDate(11, 16, 0), createdAt: makeDate(11), updatedAt: makeDate(11) },
  { id: makeId(), type: "expense", amount: 80_000, title: "Sách lập trình", category: "education", note: "Clean Code tiếng Việt", date: makeDate(13, 11, 0), createdAt: makeDate(13), updatedAt: makeDate(13) },

  // Chi tiêu - Hóa đơn
  { id: makeId(), type: "expense", amount: 380_000, title: "Tiền điện tháng 3", category: "bills", note: "", date: makeDate(15, 9, 0), createdAt: makeDate(15), updatedAt: makeDate(15) },
  { id: makeId(), type: "expense", amount: 120_000, title: "Internet tháng 4", category: "bills", note: "Viettel Fiber", date: makeDate(16, 9, 0), createdAt: makeDate(16), updatedAt: makeDate(16) },

  // Chi tiêu - Giải trí
  { id: makeId(), type: "expense", amount: 90_000, title: "Xem phim rạp", category: "entertainment", note: "Phim Avengers", date: makeDate(14, 20, 0), createdAt: makeDate(14), updatedAt: makeDate(14) },

  // Chi tiêu - Sức khỏe
  { id: makeId(), type: "expense", amount: 250_000, title: "Khám sức khỏe", category: "health", note: "Phòng khám đa khoa", date: makeDate(17, 10, 0), createdAt: makeDate(17), updatedAt: makeDate(17) },
  { id: makeId(), type: "expense", amount: 85_000, title: "Mua thuốc cảm", category: "health", note: "", date: makeDate(8, 18, 0), createdAt: makeDate(8), updatedAt: makeDate(8) },

  // === Tháng trước ===
  {
    id: makeId(), type: "income", amount: 12_000_000, title: "Lương tháng 3",
    category: "salary", note: "", date: subMonths(new Date(), 1).toISOString(),
    createdAt: subMonths(new Date(), 1).toISOString(), updatedAt: subMonths(new Date(), 1).toISOString(),
  },
  { id: makeId(), type: "expense", amount: 45_000, title: "Cơm trưa", category: "food", note: "", date: subMonths(subDays(new Date(), 3), 1).toISOString(), createdAt: subMonths(new Date(), 1).toISOString(), updatedAt: subMonths(new Date(), 1).toISOString() },
  { id: makeId(), type: "expense", amount: 320_000, title: "Tiền điện tháng 2", category: "bills", note: "", date: subMonths(subDays(new Date(), 10), 1).toISOString(), createdAt: subMonths(new Date(), 1).toISOString(), updatedAt: subMonths(new Date(), 1).toISOString() },
  { id: makeId(), type: "expense", amount: 500_000, title: "Mua giày", category: "shopping", note: "Nike Air Force", date: subMonths(subDays(new Date(), 15), 1).toISOString(), createdAt: subMonths(new Date(), 1).toISOString(), updatedAt: subMonths(new Date(), 1).toISOString() },
];
