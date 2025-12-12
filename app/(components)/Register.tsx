'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/app/(hooks)';
import { mustMatch, isValidPhoneNumber, isValidPassword } from '@/app/(helpers)/validators';
import styles from './Register.module.css';

interface RegisterProps {
  onClose?: () => void;
  onOpenLogin?: () => void;
}

interface FormErrors {
  name?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

export function RegisterModal({ onClose, onOpenLogin }: RegisterProps) {
  const { register, loading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (!mustMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Phone Number must be at least 10 digits';
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must contain only digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await register(
        formData.name,
        formData.username,
        formData.password,
        formData.phoneNumber
      );
      onOpenLogin?.();
    } catch (err) {
      // Error is already set in the hook
      console.error('Registration error:', err);
    }
  };

  return (
    <div className={styles.modalForm}>
      <div>
        <div className={styles.textCenter}>
          <img src="/assets/Icons/Icon.png" width={50} height={50} alt="Icon" />
          <h4>Register</h4>
        </div>

        <br />

        <div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.row}>
                <div className={styles.colSm4}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Name
                  </label>
                </div>

                <div className={styles.colSm8}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={
                      styles.formControl +
                      (submitted && errors.name ? ' ' + styles.isInvalid : '')
                    }
                  />
                  {submitted && errors.name && (
                    <div className={styles.invalidFeedback}>{errors.name}</div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.row}>
                <div className={styles.colSm4}>
                  <label htmlFor="username" className={styles.formLabel}>
                    Username
                  </label>
                </div>

                <div className={styles.colSm8}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={
                      styles.formControl +
                      (submitted && errors.username
                        ? ' ' + styles.isInvalid
                        : '')
                    }
                  />
                  {submitted && errors.username && (
                    <div className={styles.invalidFeedback}>
                      {errors.username}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.row}>
                <div className={styles.colSm4}>
                  <label htmlFor="password" className={styles.formLabel}>
                    Password
                  </label>
                </div>

                <div className={styles.colSm8}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={
                      styles.formControl +
                      (submitted && errors.password ? ' ' + styles.isInvalid : '')
                    }
                  />
                  {submitted && errors.password && (
                    <div className={styles.invalidFeedback}>
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.row}>
                <div className={styles.colSm4}>
                  <label htmlFor="confirmPassword" className={styles.formLabel}>
                    Confirm Password
                  </label>
                </div>

                <div className={styles.colSm8}>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={
                      styles.formControl +
                      (submitted && errors.confirmPassword
                        ? ' ' + styles.isInvalid
                        : '')
                    }
                  />
                  {submitted && errors.confirmPassword && (
                    <div className={styles.invalidFeedback}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.row}>
                <div className={styles.colSm4}>
                  <label htmlFor="phoneNumber" className={styles.formLabel}>
                    Phone Number
                  </label>
                </div>

                <div className={styles.colSm8}>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={
                      styles.formControl +
                      (submitted && errors.phoneNumber
                        ? ' ' + styles.isInvalid
                        : '')
                    }
                  />
                  {submitted && errors.phoneNumber && (
                    <div className={styles.invalidFeedback}>
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading && <span className={styles.spinner}></span>}
                Register
              </button>
            </div>

            {(error || authError) && (
              <div className={styles.alertDanger}>{error || authError}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
