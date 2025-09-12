export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    // T extends (...args: any[]) => void có nghĩa là T là phải là kiểu con của (...args: any[]) => void
    // args: any[] => hàm có thể nhận nhiều tham số với kiểu bất kỳ và trả về void

    // Biến timeout để lưu trữ ID của timeout hiện tại
    let timeout: NodeJS.Timeout | null;

    // Trả về một hàm mới đã được debounce
    return function(this: any, ...args: any[]) {

        // Nếu có timeout trước đó, hủy nó đi
        if (timeout) clearTimeout(timeout);

        // Thiết lập timeout mới
        timeout = setTimeout(() => {
            // Gọi hàm gốc với ngữ cảnh và tham số ban đầu
            func.apply(this, args);
        }, wait);
    } as T; // Ép kiểu về T để phù hợp kiểu trả về
}