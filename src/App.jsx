import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';
import { useLoadData } from './hooks/useLoadData';
import Home from './pages/Home';
import Hombre from './pages/Hombre';
import Mujer from './pages/Mujer';
import Accesorios from './pages/Accesorios';
import Ofertas from './pages/Ofertas';
import Contacto from './pages/Contacto';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ReturnsPolicy from './pages/ReturnsPolicy';
import Envios from './pages/Envios';
import CalculadoraTallas from './pages/CalculadoraTallas';
import FAQ from './pages/FAQ';
import SearchResults from './pages/SearchResults';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import CategoriesManager from './pages/admin/CategoriesManager';
import ProductTypesManager from './pages/admin/ProductTypesManager';
import SalesManager from './pages/admin/SalesManager';
import CreateSale from './pages/admin/CreateSale';
import EditSale from './pages/admin/EditSale';
import Notifications from './pages/admin/Notifications';
import ContactMessages from './pages/admin/ContactMessages';
import BlogManager from './pages/admin/BlogManager';
import CreateBlogPost from './pages/admin/CreateBlogPost';
import EditBlogPost from './pages/admin/EditBlogPost';
import Reports from './pages/admin/Reports';
import SiteSettings from './pages/admin/SiteSettings';

function App() {
  useLoadData();

  return (
    <HelmetProvider>
    <Router>
      <ScrollToTop />
        <ScrollToTopButton />
      <Chatbot />
        <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
            <CartSidebar />
          </div>
        } />
        <Route path="/hombres" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Hombre />
            </main>
            <Footer />
            <CartSidebar />
          </div>
        } />
        <Route path="/mujeres" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Mujer />
            </main>
            <Footer />
            <CartSidebar />
          </div>
        } />
        {/* Redirecciones para mantener compatibilidad */}
        <Route path="/hombre" element={<Navigate to="/hombres" replace />} />
        <Route path="/mujer" element={<Navigate to="/mujeres" replace />} />
        <Route path="/accesorios" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Accesorios />
            </main>
            <Footer />
            <CartSidebar />
          </div>
        } />
        <Route path="/ofertas" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Ofertas />
            </main>
            <Footer />
            <CartSidebar />
          </div>
        } />
                <Route path="/contacto" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <Contacto />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/sobre-nosotros" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <About />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/politica-privacidad" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <PrivacyPolicy />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/terminos-condiciones" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <TermsAndConditions />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/devoluciones" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <ReturnsPolicy />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/envios" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <Envios />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/calculadora-tallas" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <CalculadoraTallas />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/faq" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <FAQ />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/buscar" element={
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow">
                      <SearchResults />
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                } />
                <Route path="/producto/:id" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <ProductDetail />
            </main>
            <Footer />
            <CartSidebar />
      </div>
        } />
                <Route path="/blog" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Blog />
            </main>
            <Footer />
            <CartSidebar />
          </div>
        } />
                <Route path="/blog/:id" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <BlogPost />
            </main>
            <Footer />
            <CartSidebar />
      </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="product-types" element={<ProductTypesManager />} />
                  <Route path="sales" element={<SalesManager />} />
                  <Route path="sales/create" element={<CreateSale />} />
                  <Route path="sales/edit/:id" element={<EditSale />} />
                  <Route path="blog" element={<BlogManager />} />
                  <Route path="blog/create" element={<CreateBlogPost />} />
                  <Route path="blog/edit/:id" element={<EditBlogPost />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<SiteSettings />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="contact-messages" element={<ContactMessages />} />
                </Route>
      </Routes>
    </Router>
    </HelmetProvider>
  );
}

export default App;
