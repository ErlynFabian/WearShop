import { useState, useEffect } from 'react';
import { FiSave, FiPhone, FiMail, FiMapPin, FiClock, FiUpload, FiX } from 'react-icons/fi';
import useSiteConfigStore from '../../context/siteConfigStore';
import useToastStore from '../../context/toastStore';
import FormSkeleton from '../../components/skeletons/FormSkeleton';
import { storageService } from '../../services/storageService';

const SiteSettings = () => {
  const { config, loading, loadConfig, updateConfig } = useSiteConfigStore();
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    site_logo: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    business_hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    }
  });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (config) {
      setFormData({
        site_name: config.site_name || '',
        site_description: config.site_description || '',
        site_logo: config.site_logo || '',
        contact_phone: config.contact_phone || '',
        contact_email: config.contact_email || '',
        contact_address: config.contact_address || '',
        business_hours: config.business_hours || formData.business_hours
      });
      if (config.site_logo) {
        setLogoPreview(config.site_logo);
      }
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: field === 'closed' ? value : value
        }
      }
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      useToastStore.getState().error('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      useToastStore.getState().error('La imagen no debe superar los 5MB');
      return;
    }

    setUploadingLogo(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir imagen a Supabase Storage
      const fileName = `site-logo-${Date.now()}.${file.name.split('.').pop()}`;
      const publicUrl = await storageService.uploadImage(file, fileName);

      // Actualizar el formData con la URL pública
      setFormData(prev => ({
        ...prev,
        site_logo: publicUrl
      }));

      useToastStore.getState().success('Logo subido correctamente');
    } catch (error) {
      console.error('Error uploading logo:', error);
      useToastStore.getState().error('Error al subir el logo. Por favor, intenta nuevamente.');
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      e.target.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData(prev => ({
      ...prev,
      site_logo: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedConfig = await updateConfig(formData);
      // Actualizar el formulario con la configuración actualizada
      if (updatedConfig) {
        setFormData({
          site_name: updatedConfig.site_name || '',
          site_description: updatedConfig.site_description || '',
          site_logo: updatedConfig.site_logo || '',
          contact_phone: updatedConfig.contact_phone || '',
          contact_email: updatedConfig.contact_email || '',
          contact_address: updatedConfig.contact_address || '',
          business_hours: updatedConfig.business_hours || formData.business_hours
        });
      }
      useToastStore.getState().success('Configuración guardada correctamente');
    } catch (error) {
      useToastStore.getState().error('Error al guardar la configuración');
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-5xl font-black text-black mb-2">Configuración del Sitio</h2>
        <p className="text-gray-600">Gestiona la información general de tu tienda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Configuración General */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Tienda *
              </label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="WearShop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                      id="logo-upload"
                    />
                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <FiUpload className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {uploadingLogo ? 'Subiendo...' : 'Seleccionar archivo'}
                      </span>
                    </div>
                  </label>
                </div>
                {logoPreview && (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-20 object-contain border border-gray-200 rounded-lg p-2 bg-white"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Eliminar logo"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="site_description"
                value={formData.site_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Descripción de tu tienda..."
              />
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6 flex items-center space-x-2">
            <FiPhone className="w-5 h-5" />
            <span>Información de Contacto</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="contacto@tienda.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <textarea
                name="contact_address"
                value={formData.contact_address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Dirección completa de la tienda..."
              />
            </div>
          </div>
        </div>

        {/* Horarios de Atención */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6 flex items-center space-x-2">
            <FiClock className="w-5 h-5" />
            <span>Horarios de Atención</span>
          </h3>
          <div className="space-y-4">
            {days.map((day) => {
              const dayHours = formData.business_hours[day.key];
              return (
                <div key={day.key} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="w-full sm:w-20 flex-shrink-0">
                    <label className="text-sm font-medium text-gray-700">{day.label}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!dayHours.closed}
                      onChange={(e) => handleHoursChange(day.key, 'closed', !e.target.checked)}
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-xs sm:text-sm text-gray-600">Abierto</span>
                  </div>
                  {!dayHours.closed && (
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <div className="flex items-center space-x-1.5">
                        <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">De:</label>
                        <input
                          type="time"
                          value={dayHours.open}
                          onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-24 sm:w-auto"
                        />
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">A:</label>
                        <input
                          type="time"
                          value={dayHours.close}
                          onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                          className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-24 sm:w-auto"
                        />
                      </div>
                    </div>
                  )}
                  {dayHours.closed && (
                    <span className="text-xs sm:text-sm text-gray-500 italic">Cerrado</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-5 h-5" />
            <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;

