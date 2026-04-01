import InfiniteScrollFlex from "@/components/ui/utils/infinite-scroll-flex";
import { useState, useCallback } from "react";

const taoDuLieuGia = (soLuong: number, batDauTu: number) => {
  return Array.from({ length: soLuong }).map((_, chiMuc) => ({
    maDinhDanh: batDauTu + chiMuc,
    noiDung: `Nội dung tin nhắn số ${batDauTu + chiMuc}`,
  }));
};

export default function ThuNghiemCuon() {
  const [danhSachTinNhan, setDanhSachTinNhan] = useState(() => taoDuLieuGia(9, 1));
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(false);
  const [conDuLieu, setConDuLieu] = useState(true);

  const xuLyTaiThem = useCallback(async () => {
    if (dangTaiDuLieu || !conDuLieu) return;

    setDangTaiDuLieu(true);

    await new Promise((giaiQuyet) => setTimeout(giaiQuyet, 10));

    setDanhSachTinNhan((danhSachHienTai) => {
      const doDaiHienTai = danhSachHienTai.length;

      if (doDaiHienTai >= 200) {
        setConDuLieu(false);
        return danhSachHienTai;
      }

      const duLieuMoi = taoDuLieuGia(9, doDaiHienTai + 1);
      return [...danhSachHienTai, ...duLieuMoi];
    });

    setDangTaiDuLieu(false);
  }, [dangTaiDuLieu, conDuLieu]);

  return (
    <div className="h-[600px] w-[400px] border border-gray-300 mx-auto mt-10 bg-white">
      <InfiniteScrollFlex
        items={danhSachTinNhan}
        isLoading={dangTaiDuLieu}
        hasMore={conDuLieu}
        onLoadMore={xuLyTaiThem}
        itemKey={(tinNhan) => tinNhan.maDinhDanh}
        itemTemplate={(tinNhan) => (
          <div className="p-3 m-2 bg-blue-100 rounded-lg text-black shadow-sm">
            {tinNhan.noiDung}
          </div>
        )}
        isShowLastSeen={true}
        lastSeen={<span className="text-gray-500">Đã xem toàn bộ lịch sử trò chuyện</span>}
      />
    </div>
  );
}
