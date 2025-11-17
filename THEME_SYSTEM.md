# 🎨 Fatagram Theme System

## Tổng quan

Hệ thống theme đã được hoàn thiện với đầy đủ biến màu cho Light và Dark mode, tích hợp hoàn toàn với Tailwind CSS.

## Cấu trúc Theme

### 1. CSS Variables (`src/styles/themes.css`)

Định nghĩa tất cả biến màu cho cả light và dark theme:

- **Primary colors**: `--primary-50` đến `--primary-900`
- **Secondary colors**: `--secondary-50` đến `--secondary-600`
- **Text colors**: `--text-main`, `--text-second`, `--text-third`, `--text-fourth`
- **Background colors**: `--bg-main`, `--bg-second`, `--bg-third`, v.v.
- **Button colors**: `--btn-main`, `--btn-second`, v.v.
- **Border colors**: `--border-main`, `--border-second`, `--border-focus`
- **Semantic colors**: `--success`, `--warning`, `--error`, `--info`
- **Gradients**: `--gradient-main`, `--gradient-second`

### 2. Tailwind Config (`colors.config.js`)

Map CSS variables thành Tailwind classes với hỗ trợ alpha (opacity).

### 3. Theme Context (`src/contexts/common/theme-context.tsx`)

Quản lý state theme (light/dark) và lưu vào localStorage.

## Cách sử dụng

### Text Colors

```tsx
<Text className="text-text-main">Main text</Text>
<Text className="text-text-second">Secondary text</Text>
<Text className="text-text-third">Tertiary text</Text>
<Text className="text-text-fourth">Quaternary text</Text>
```

### Background Colors

```tsx
<div className="bg-bg-main">Main background</div>
<div className="bg-bg-second">Secondary background</div>
<div className="bg-bg-card">Card background</div>
<div className="bg-bg-hover">Hover state</div>
<div className="bg-bg-overlay">Overlay (modal backdrop)</div>
```

### Primary Colors

```tsx
<Button className="bg-primary-500 text-white">Primary Button</Button>
<Text className="text-primary-600">Primary text</Text>
<div className="border-primary-500">Primary border</div>
```

### Border Colors

```tsx
<input className="border border-border-main focus:border-border-focus" />
<div className="border-b border-border-second">Divider</div>
```

### Với Opacity (Alpha)

```tsx
<div className="bg-bg-main/80">80% opacity</div>
<Text className="text-text-main/50">50% opacity</Text>
<div className="border-primary-500/30">30% opacity border</div>
```

### Gradients

```tsx
<div className="bg-gradient-main">Gradient background</div>
<Button className="bg-gradient-main hover:bg-gradient-main-move">
  Gradient with hover animation
</Button>
<Text className="text-gradient-main">Gradient text</Text>
```

### Semantic Colors

```tsx
<Text className="text-success">Success message</Text>
<div className="bg-warning">Warning background</div>
<Text className="text-error">Error message</Text>
<div className="bg-info/20">Info background with opacity</div>
```

## Switch Theme

```tsx
import { useTheme } from "@/hooks/contexts/use-theme";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle Theme</button>
  );
}
```

## Best Practices

### ✅ Nên làm

```tsx
// Sử dụng Tailwind classes từ theme
<div className="bg-bg-main text-text-main border-border-main">
  Content
</div>

// Sử dụng opacity khi cần
<div className="bg-bg-hover/50">Hover state with 50% opacity</div>

// Sử dụng semantic colors cho status
<Text className="text-success">Operation successful!</Text>
```

### ❌ Không nên làm

```tsx
// ❌ Hardcoded colors
<div className="bg-[#ffffff] text-[#000000]">Content</div>

// ❌ Direct RGB values
<div style={{ background: "rgb(255, 255, 255)" }}>Content</div>

// ❌ Hardcoded hex colors
<Text className="text-[#949494]">Gray text</Text>
```

## Theme Variables Reference

### Light Theme

- Text: Dark gray shades
- Background: White and light gray shades
- Primary: Teal/Cyan tones
- Semantic colors: Standard success/error/warning/info

### Dark Theme

- Text: Light gray shades (inverted)
- Background: Dark gray and slate shades
- Primary: Same as light (brand consistency)
- Semantic colors: Same as light

## Files đã cập nhật

1. ✅ `src/styles/themes.css` - Hoàn thiện biến màu light/dark
2. ✅ `colors.config.js` - Thêm border colors, đảm bảo mapping đầy đủ
3. ✅ `src/components/atoms/button/button.tsx` - Sử dụng theme colors
4. ✅ `src/components/atoms/footer/footer.tsx` - Sử dụng theme colors
5. ✅ `src/components/atoms/selectbox/selectbox.tsx` - Sử dụng theme colors
6. ✅ `src/pages/not-found/not-found-page.tsx` - Sử dụng theme colors
7. ✅ `src/features/settings/privacy/components/change-name-form.tsx` - Sử dụng theme colors
8. ✅ `src/components/organisms/dialog/global-dialog.tsx` - Sử dụng theme colors
9. ✅ `src/styles/global.css` - Xóa `.bg-disabled` class (thay bằng Tailwind)

## Test Theme

Để test theme system:

1. Mở app và toggle giữa light/dark mode
2. Kiểm tra các components:
   - Buttons (các variants)
   - Text (các levels)
   - Cards và backgrounds
   - Borders và focus states
   - Modals và overlays

3. Verify responsive:
   - Tất cả màu sắc thay đổi khi switch theme
   - Không có màu hard-coded nào còn lại
   - Opacity hoạt động đúng

## Troubleshooting

### Colors không thay đổi khi switch theme?

- Kiểm tra `data-theme` attribute trên `<html>` element
- Verify ThemeProvider đã wrap toàn bộ app

### Tailwind classes không work?

- Chạy lại dev server: `npm run dev`
- Clear Tailwind cache nếu cần

### TypeScript errors?

- Đảm bảo `colors.config.js` được import đúng trong `tailwind.config.js`
- Check type definitions trong `global.d.ts` nếu cần

---

**Lưu ý**: Theme system này đã được thiết kế để scale tốt. Khi cần thêm màu mới, chỉ cần:

1. Thêm CSS variable vào `themes.css` cho cả `:root` và `[data-theme="dark"]`
2. Map variable vào `colors.config.js`
3. Sử dụng Tailwind class mới: `bg-{your-color}`, `text-{your-color}`, etc.
