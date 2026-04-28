export interface GifDto {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
}

export interface GifResponseDto {
  gifs: GifDto[];
  next?: string;
}
