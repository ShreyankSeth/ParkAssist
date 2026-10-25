/**
 * @file useForm.js
 * @description Custom hook for Form Handling in React: Validation strategies,
 * dirty/touched state tracking, and real-time field error management.
 */

import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate a single field by name
  const validateField = useCallback(
    (name, value) => {
      if (validationRules[name]) {
        const errorMsg = validationRules[name](value, values);
        return errorMsg || '';
      }
      return '';
    },
    [validationRules, values]
  );

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const val = type === 'checkbox' ? checked : value;

      setValues((prev) => ({ ...prev, [name]: val }));

      // If field was touched, re-validate in real-time
      if (touched[name] && validationRules[name]) {
        const fieldError = validationRules[name](val, { ...values, [name]: val });
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    },
    [touched, validationRules, values]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validationRules[name]) {
        const fieldError = validationRules[name](value, values);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    },
    [validationRules, values]
  );

  // Validate all fields on submit
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const errorMsg = validationRules[field](values[field], values);
      if (errorMsg) {
        newErrors[field] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );

    return isValid;
  }, [validationRules, values]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm
  };
};
