/**
 * LinguaSync — Pricing Calculator
 * Real-time quote calculation based on user inputs
 */

const PricingEngine = {
  // Base pricing rules
  config: {
    baseRate: 50,           // First 5 minutes
    baseMinutes: 5,
    perMinuteRate: 15,      // Per additional minute
    lipSyncFee: 20,         // Per language
    rushMultiplier: 1.30,   // +30%
    subtitleFee: 0,         // Free with dubbing
    multiLangDiscount: 0.15, // 15% off for 3+ languages
    multiLangThreshold: 3,
  },

  /**
   * Calculate total quote based on inputs
   */
  calculate(duration, targetLangs, lipSync, rush, subtitles) {
    if (targetLangs.length === 0) {
      return { total: 0, breakdown: [], turnaround: 0, perLang: 0 };
    }

    const numLangs = targetLangs.length;
    const breakdown = [];

    // 1. Base dubbing cost per language
    let baseCost;
    if (duration <= this.config.baseMinutes) {
      baseCost = this.config.baseRate;
    } else {
      baseCost = this.config.baseRate + ((duration - this.config.baseMinutes) * this.config.perMinuteRate);
    }

    const totalBase = baseCost * numLangs;
    breakdown.push({
      label: `Dubbing (${duration} min × ${numLangs} lang)`,
      label_vi: `Lồng tiếng (${duration} phút × ${numLangs} ngôn ngữ)`,
      value: totalBase
    });

    // 2. Lip-sync fee
    let lipSyncTotal = 0;
    if (lipSync) {
      lipSyncTotal = this.config.lipSyncFee * numLangs;
      breakdown.push({
        label: `Lip-sync (${numLangs} lang × $${this.config.lipSyncFee})`,
        label_vi: `Đồng bộ khẩu hình (${numLangs} ngôn ngữ × $${this.config.lipSyncFee})`,
        value: lipSyncTotal
      });
    }

    // 3. Subtotal before discounts
    let subtotal = totalBase + lipSyncTotal;

    // 4. Multi-language discount
    let discount = 0;
    if (numLangs >= this.config.multiLangThreshold) {
      discount = subtotal * this.config.multiLangDiscount;
      breakdown.push({
        label: `Multi-language discount (${numLangs} langs, -15%)`,
        label_vi: `Giảm giá đa ngôn ngữ (${numLangs} ngôn ngữ, -15%)`,
        value: -discount,
        isDiscount: true
      });
    }

    subtotal -= discount;

    // 5. Rush fee
    let rushFee = 0;
    if (rush) {
      rushFee = subtotal * (this.config.rushMultiplier - 1);
      breakdown.push({
        label: 'Rush delivery (+30%)',
        label_vi: 'Giao gấp (+30%)',
        value: rushFee
      });
    }

    const total = subtotal + rushFee;

    // 6. Subtitles (free)
    if (subtitles) {
      breakdown.push({
        label: 'Subtitle files (SRT/VTT)',
        label_vi: 'File phụ đề (SRT/VTT)',
        value: 0,
        isFree: true
      });
    }

    // Turnaround calculation
    let turnaround;
    if (rush) {
      turnaround = 1;
    } else if (duration <= 10 && numLangs <= 2) {
      turnaround = 2;
    } else if (duration <= 30 && numLangs <= 3) {
      turnaround = 3;
    } else {
      turnaround = 4;
    }

    return {
      total: Math.round(total),
      breakdown,
      turnaround,
      perLang: Math.round(total / numLangs)
    };
  }
};

/**
 * Calculator UI Controller
 */
class CalculatorUI {
  constructor() {
    this.durationSlider = document.getElementById('calcDuration');
    this.durationValue = document.getElementById('calcDurationValue');
    this.sourceSelect = document.getElementById('calcSource');
    this.targetCheckboxes = document.querySelectorAll('#targetLangs .checkbox-item input');
    this.lipSyncToggle = document.getElementById('calcLipSync');
    this.rushToggle = document.getElementById('calcRush');
    this.subtitlesToggle = document.getElementById('calcSubtitles');
    this.quoteAmount = document.getElementById('quoteAmount');
    this.quotePerUnit = document.getElementById('quotePerUnit');
    this.quoteBreakdown = document.getElementById('quoteBreakdown');

    this.init();
  }

  init() {
    // Duration slider
    this.durationSlider.addEventListener('input', () => {
      this.durationValue.textContent = `${this.durationSlider.value} min`;
      this.updateQuote();
    });

    // Target language checkboxes
    this.targetCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('.checkbox-item').classList.toggle('selected', cb.checked);
        this.updateQuote();
      });
    });

    // Toggles
    this.lipSyncToggle.addEventListener('change', () => this.updateQuote());
    this.rushToggle.addEventListener('change', () => this.updateQuote());
    this.subtitlesToggle.addEventListener('change', () => this.updateQuote());

    // Source language change (filter out from targets)
    this.sourceSelect.addEventListener('change', () => this.updateQuote());

    // Initial render
    this.updateQuote();
  }

  getSelectedLanguages() {
    const selected = [];
    this.targetCheckboxes.forEach(cb => {
      if (cb.checked) selected.push(cb.value);
    });
    return selected;
  }

  updateQuote() {
    const duration = parseInt(this.durationSlider.value);
    const targetLangs = this.getSelectedLanguages();
    const lipSync = this.lipSyncToggle.checked;
    const rush = this.rushToggle.checked;
    const subtitles = this.subtitlesToggle.checked;

    const quote = PricingEngine.calculate(duration, targetLangs, lipSync, rush, subtitles);
    const currentLang = document.documentElement.getAttribute('data-lang') || 'en';

    // Update total
    if (targetLangs.length === 0) {
      this.quoteAmount.textContent = '$0';
      this.quotePerUnit.textContent = currentLang === 'vi' 
        ? 'Chọn ngôn ngữ đích để bắt đầu' 
        : 'Select target languages to start';
    } else {
      this.quoteAmount.textContent = `$${quote.total}`;
      const turnaroundText = currentLang === 'vi'
        ? `~$${quote.perLang}/ngôn ngữ · ${quote.turnaround} ngày giao hàng`
        : `~$${quote.perLang}/language · ${quote.turnaround}-day delivery`;
      this.quotePerUnit.textContent = turnaroundText;
    }

    // Update breakdown
    this.quoteBreakdown.innerHTML = '';
    quote.breakdown.forEach(line => {
      const div = document.createElement('div');
      div.className = 'quote-line' + (line.isDiscount ? ' discount' : '') + (line.value === quote.total ? ' total' : '');
      
      const labelText = currentLang === 'vi' ? line.label_vi : line.label;
      let valueText;
      if (line.isFree) {
        valueText = currentLang === 'vi' ? 'Miễn phí' : 'Free';
      } else if (line.isDiscount) {
        valueText = `-$${Math.abs(Math.round(line.value))}`;
      } else {
        valueText = `$${Math.round(line.value)}`;
      }

      div.innerHTML = `<span class="line-label">${labelText}</span><span class="line-value">${valueText}</span>`;
      this.quoteBreakdown.appendChild(div);
    });

    // Add total line
    if (targetLangs.length > 0) {
      const totalDiv = document.createElement('div');
      totalDiv.className = 'quote-line total';
      totalDiv.innerHTML = `<span class="line-label">${currentLang === 'vi' ? 'TỔNG CỘNG' : 'TOTAL'}</span><span class="line-value">$${quote.total}</span>`;
      this.quoteBreakdown.appendChild(totalDiv);
    }
  }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.calculatorUI = new CalculatorUI();
});
