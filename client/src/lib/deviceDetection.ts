export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return isMobileUA || (isSmallScreen && isTouchDevice);
}

export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isMidRangeAndroid = /android/.test(userAgent) && !/chrome\/([0-9]{3,})/.test(userAgent);

  return isIOS || isMidRangeAndroid || isMobileDevice();
}

export function getDeviceProfile(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/iphone|android.*mobile/.test(userAgent) || width < 768) {
    return 'mobile';
  }
  if (/ipad|android/.test(userAgent) || (width >= 768 && width < 1024)) {
    return 'tablet';
  }
  return 'desktop';
}

// Mobile device optimization settings
const mobile = isMobileDevice();
const optimizedSettings = {
    uSegments: mobile ? 32 : 64,
    vSegments: mobile ? 16 : 32,
    enableAnimations: !mobile,
    enableParticles: !mobile,
    enableTrails: false,
    enableBloom: !mobile,
    renderQuality: mobile ? 'low' : 'medium',
    particleCount: mobile ? 15 : 100,
    throttleInterval: mobile ? 5 : 1,
    shadowMapSize: mobile ? 128 : 512,
    antialias: !mobile,
    adaptiveQuality: mobile,
    memoryLimit: mobile ? 64 : 256
  };