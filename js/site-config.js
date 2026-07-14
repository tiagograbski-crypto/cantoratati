import { asset } from './base-url.js';

const adminEnabled = import.meta.env.DEV || import.meta.env.VITE_ADMIN_ENABLED === 'true';

window.SITE_CONFIG = {
    whatsapp: '5549991136430',
    whatsappDisplay: '(49) 99113-6430',
    whatsappDefaultMessage: 'Olá! Gostaria de pedir orçamento com a Tati Vanzan.',
    instagram: 'https://www.instagram.com/tativanzan/',
    youtube: 'https://www.youtube.com/shorts/_FmobhKevFk',
    admin: {
        enabled: adminEnabled,
        pin: import.meta.env.VITE_ADMIN_PIN || '1234',
    },
    images: {
        hero: {
            webp: asset('/assets/images/hero/tati-palco-800w.webp'),
            jpg: asset('/assets/images/hero/tati-palco-800w.jpg'),
            srcsetWebp: `${asset('/assets/images/hero/tati-palco-480w.webp')} 480w, ${asset('/assets/images/hero/tati-palco-800w.webp')} 800w, ${asset('/assets/images/hero/tati-palco-1200w.webp')} 1200w`,
            srcsetJpg: `${asset('/assets/images/hero/tati-palco-480w.jpg')} 480w, ${asset('/assets/images/hero/tati-palco-800w.jpg')} 800w, ${asset('/assets/images/hero/tati-palco-1200w.jpg')} 1200w`,
        },
        sobre: {
            webp: asset('/assets/images/sobre/tati-retrato-360w.webp'),
            jpg: asset('/assets/images/sobre/tati-retrato-360w.jpg'),
            srcsetWebp: `${asset('/assets/images/sobre/tati-retrato-320w.webp')} 320w, ${asset('/assets/images/sobre/tati-retrato-360w.webp')} 360w`,
            srcsetJpg: `${asset('/assets/images/sobre/tati-retrato-320w.jpg')} 320w, ${asset('/assets/images/sobre/tati-retrato-360w.jpg')} 360w`,
        },
        og: asset('/assets/images/hero/tati-palco-800w.jpg'),
        thumb: asset('/assets/images/thumbs/tati-retrato-thumb-400w.webp'),
    },
    press: [
        { name: 'Sonora Chapecó', url: 'https://www.instagram.com/festivalsonorachapeco/p/DTSrav0jaBg/' },
        { name: 'Conda FM', url: 'https://www.instagram.com/condafm/reel/DXhFVp8Dlod/' },
        { name: '@meupaotostado', url: 'https://www.instagram.com/meupaotostado/' },
        { name: '@acasa.da.arvore', url: 'https://www.instagram.com/acasa.da.arvore/' },
        { name: 'Golden Hotel', url: 'https://www.instagram.com/goldenhotelchapeco/' },
        { name: 'Cultura Chapecó', url: 'https://www.instagram.com/culturachapeco/' },
    ],
    videos: [
        {
            key: 'youtube-live',
            title: 'Tati Vanzan ao vivo',
            tag: 'YouTube',
            type: 'youtube',
            id: '_FmobhKevFk',
            url: 'https://www.youtube.com/shorts/_FmobhKevFk',
            thumb: 'https://img.youtube.com/vi/_FmobhKevFk/hqdefault.jpg',
            alt: 'Vídeo da Tati Vanzan no YouTube',
        },
        {
            key: 'ig-tati',
            title: 'Performance · Instagram',
            tag: 'Instagram',
            type: 'instagram',
            id: 'DU5-T7zEVU0',
            url: 'https://www.instagram.com/tativanzan/reel/DU5-T7zEVU0/',
            thumb: asset('/assets/images/thumbs/tati-retrato-thumb-400w.webp'),
            alt: 'Reel da Tati Vanzan no Instagram',
        },
        {
            key: 'ig-condafm',
            title: 'Conda FM · Entrevista',
            tag: 'Rádio',
            type: 'instagram',
            id: 'DXhFVp8Dlod',
            url: 'https://www.instagram.com/condafm/reel/DXhFVp8Dlod/',
            alt: 'Tati Vanzan na Conda FM',
        },
        {
            key: 'ig-sonora',
            title: 'Sonora Chapecó · Festival',
            tag: 'Festival',
            type: 'instagram',
            id: 'DTSrav0jaBg',
            embedType: 'post',
            url: 'https://www.instagram.com/festivalsonorachapeco/p/DTSrav0jaBg/',
            thumb: asset('/assets/images/hero/tati-palco-800w.jpg'),
            alt: 'Tati Vanzan no Festival Sonora Chapecó',
        },
    ],
};

window.getWhatsAppLink = (message) => {
    const text = encodeURIComponent(message || window.SITE_CONFIG.whatsappDefaultMessage);
    return `https://wa.me/${window.SITE_CONFIG.whatsapp}?text=${text}`;
};
