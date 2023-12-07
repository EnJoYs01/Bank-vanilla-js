import { COLORS } from '@/config/colors.config';

export class ValidationService {
  constructor() {
    this.errorBorderTimeout = {};
  }

  /**
   * Show red border around the input that was left empty
   * @param {SQuery} element - SQuery instance with selected input
   * @param {number} timeout - The number of milliseconds to remove red border
   */
  showError(element, timeout = 2500) {
    element.setStyle('border-color', COLORS.error);

    this.errorBorderTimeout[element.element]
      ? clearTimeout(this.errorBorderTimeout[element.element])
      : null;

    this.errorBorderTimeout[element] = setTimeout(() => {
      element.setStyle('border-color', '');
    }, timeout);
  }
}
