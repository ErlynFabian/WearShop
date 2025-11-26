import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useSiteConfigStore from '../context/siteConfigStore';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website' 
}) => {
  const location = useLocation();
  const siteName = useSiteConfigStore((state) => state.config?.site_name) || 'WearShop';
  const siteDescription = useSiteConfigStore((state) => state.config?.site_description);
  const defaultTitle = `${siteName} - Moda y Estilo | Tienda Online`;
  const defaultDescription = siteDescription || 'Descubre las últimas tendencias en moda. Ropa para hombres, mujeres y accesorios. Envíos nacionales e internacionales.';
  const defaultImage = 'https://static.zara.net/assets/public/41c4/d194/c9a34b0d8304/0d227959d347/AGORA_MALL_1438/AGORA_MALL_1438.jpg?ts=1750260205481';
  
  // Obtener URLs de forma segura
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || currentUrl;

  // Forzar actualización del título cuando cambia la ruta o el nombre del sitio
  useEffect(() => {
    document.title = seoTitle;
  }, [location.pathname, seoTitle, siteName]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="author" content={siteName} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
};

export default SEO;

