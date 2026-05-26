// Image Optimization Service
// Asegura que las imágenes se sirvan en WebP cuando es posible
// y agrega lazy loading a todas las imágenes

export class ImageOptimizationService {
  static init() {
    this.optimizeDynamicImages();
    this.watchForNewImages();
  }

  static optimizeDynamicImages() {
    // Reemplazar .jpg/.png con .webp en navegadores que lo soportan
    const supportsWebP = this.supportsWebP();
    document.querySelectorAll('img').forEach(img => {
      this.optimizeImage(img, supportsWebP);
    });
  }

  static optimizeImage(img, supportsWebP = this.supportsWebP()) {
    if (!img.dataset.lazyLoaded) {
      // No sobreescribir imágenes LCP/prioritarias (loading="eager" o fetchpriority="high")
      const currentLoading = img.getAttribute('loading');
      const fetchPriority = img.getAttribute('fetchpriority');
      if (currentLoading !== 'eager' && fetchPriority !== 'high') {
        img.setAttribute('loading', 'lazy');
      }
      img.dataset.lazyLoaded = 'true';
    }

    if (!supportsWebP) return;

    const replaceWebP = (value) => {
      return value?.replace(/\.(jpg|jpeg|png)(\s|$)/gi, '.webp$2');
    };

    if (img.src && !img.src.includes('.webp')) {
      const newSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (newSrc !== img.src) {
        img.src = newSrc;
      }
    }

    if (img.srcset && !img.srcset.includes('.webp')) {
      img.srcset = replaceWebP(img.srcset);
    }

    if (img.dataset.src && !img.dataset.src.includes('.webp')) {
      img.dataset.src = replaceWebP(img.dataset.src);
    }

    if (img.dataset.srcset && !img.dataset.srcset.includes('.webp')) {
      img.dataset.srcset = replaceWebP(img.dataset.srcset);
    }

    const picture = img.closest('picture');
    if (picture) {
      picture.querySelectorAll('source').forEach(source => {
        if (source.srcset && !source.srcset.includes('.webp')) {
          source.srcset = replaceWebP(source.srcset);
        }
        if (source.src && !source.src.includes('.webp')) {
          source.src = replaceWebP(source.src);
        }
      });
    }
  }

  static watchForNewImages() {
    const observer = new MutationObserver(mutations => {
      const supportsWebP = this.supportsWebP();
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element
            if (node.tagName === 'IMG') {
              this.optimizeImage(node, supportsWebP);
            } else if (node.querySelectorAll) {
              node.querySelectorAll('img').forEach(img => {
                this.optimizeImage(img, supportsWebP);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  static supportsWebP() {
    if (!this._supportsWebP) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      this._supportsWebP = canvas.toDataURL('image/webp').indexOf('webp') === 5;
    }
    return this._supportsWebP;
  }

  // Preload imágenes críticas (hero)
  static preloadCriticalImages(imageSrcs) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        imageSrcs.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
        });
      });
    }
  }

  // Aplicar WebP con fallback
  static enableWebPWithFallback() {
    const supportsWebP = this.supportsWebP();
    if (supportsWebP) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  }
}
