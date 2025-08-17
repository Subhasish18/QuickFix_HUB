import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProviderModal = ({
  showEditModal,
  setShowEditModal,
  formData,
  setFormData,
  handleInputChange,
  handleUpdate,
  loading,
  states,
  cities,
}) => {
  
  // wrapper around handleUpdate to inject toast notifications
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleUpdate(e);

      // toast.success("Profile updated successfully! 🎉", {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <AnimatePresence>
      {showEditModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 block p-4 z-50"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-auto mt-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-900">Edit Profile</h2>
              <motion.button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setShowEditModal(false)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </motion.button>
            </div>
            
            {/* form with toast-enhanced submission */}
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              {[
                { label: 'Name', name: 'name', type: 'text', required: true },
                { label: 'Email', name: 'email', type: 'email', required: true },
                { label: 'Phone Number', name: 'phoneNumber', type: 'tel' },
                { label: 'Profile Image URL', name: 'profileImage', type: 'url', placeholder: 'Enter image URL (e.g., https://example.com/image.jpg)' },
                { label: 'Description', name: 'description', type: 'textarea' },
                { label: 'Pricing Model (fixed)', name: 'pricingModel', type: 'text' },
                { label: 'Availability (e.g., mon: 9:00-17:00; tue: 10:00-18:00)', name: 'availability', type: 'text', placeholder: 'mon: 9:00-17:00; tue: 10:00-18:00' },
                { label: 'Service Types (comma-separated)', name: 'serviceTypes', type: 'text' },
                { label: 'State', name: 'state', type: 'select', options: states, optionKey: 'iso2', optionLabel: 'name' },
                { label: 'City', name: 'city', type: 'select', options: cities, optionKey: 'id', optionLabel: 'name' },
              ].map((field, index) => (
                <motion.div
                  key={field.name}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <label htmlFor={field.name} className="text-xs sm:text-sm font-medium text-gray-600">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="mt-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="mt-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      required={field.required}
                      disabled={field.name === 'city' && !formData.state}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option[field.optionKey]} value={option[field.optionLabel]}>
                          {option[field.optionLabel]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="mt-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        required={field.required}
                      />
                      {field.name === 'profileImage' && formData.profileImage && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-2">Preview:</p>
                          <img
                            src={formData.profileImage}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs hidden"
                          >
                            Invalid URL
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
              
              {/* Submit Button */}
              <motion.button
                type="submit"
                className="mt-4 px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <i className="bi bi-arrow-repeat animate-spin"></i>
                ) : (
                  <i className="bi bi-save"></i>
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProviderModal;
