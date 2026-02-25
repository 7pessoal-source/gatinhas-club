import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "scale-down";
}

/**
 * Componente de Imagem Otimizado
 * - Converte para WebP automaticamente
 * - Implementa Lazy Loading
 * - Responsivo e otimizado para mobile
 * - Fallback para navegadores antigos
 */
const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  objectFit = "cover",
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

  // Converter URL para WebP
  const getWebPUrl = (originalUrl: string): string => {
    if (!originalUrl) return "";
    // Se já for WebP, retorna como está
    if (originalUrl.endsWith(".webp")) return originalUrl;
    // Converte extensão para .webp
    return originalUrl.replace(/\.(jpg|jpeg|png|gif)$/i, ".webp");
  };

  useEffect(() => {
    if (!src) return;

    const webpUrl = getWebPUrl(src);
    setImageSrc(webpUrl);

    // Se for priority, carrega imediatamente
    if (priority && imgRef.current) {
      imgRef.current.loading = "eager";
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback para imagem original se WebP falhar
    if (imageSrc !== src) {
      setImageSrc(src);
    }
  };

  return (
    <picture>
      {/* WebP para navegadores modernos */}
      <source srcSet={getWebPUrl(src)} type="image/webp" />
      {/* Fallback para navegadores antigos */}
      <img
        ref={imgRef}
        src={imageSrc || src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "scale-down" && "object-scale-down",
          className
        )}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
};

export default OptimizedImage;
