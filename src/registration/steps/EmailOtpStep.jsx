import React from 'react';

const EmailOtpStep = ({
  formData,
  errors,
  touched,
  otpSent,
  otpVerified,
  verifyingOtp,
  sendingOtp,
  resendCountdown,
  handleInputChange,
  sendOTP,
  verifyOTP,
  emailSendMessage,
  isLight
}) => {
  return (
    <div className="registration-step">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">📧</span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">Enter your email address and verify with OTP</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address *</label>
          <div className="flex gap-2">
            <input
              type="email"
              id="emailId"
              name="emailId"
              disabled={otpVerified}
              className={`flex-1 min-w-0 px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                ${errors.emailId ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
              placeholder="Enter your email address"
              value={formData.emailId}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={sendOTP}
              disabled={sendingOtp || otpSent}
              className="flex-shrink-0 w-28 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all whitespace-nowrap disabled:opacity-50 text-center"
            >
              {sendingOtp ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
          <div className="mt-1">
            {touched.emailId && errors.emailId && (
              <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs`}>{errors.emailId}</p>
            )}
            {/* Inline OTP sent message */}
            {otpSent && emailSendMessage && !otpVerified && (
              <p className="text-xs text-slate-400 mt-1">{emailSendMessage}</p>
            )}
            {/* Show verified tick next to email when verified */}
            {otpVerified && (
              <div className="flex items-center gap-2 mt-1">
                <p className={`text-xs ${isLight ? 'text-green-700' : 'text-green-400'}`}>Email verified</p>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-green-600 text-white rounded-full">✓</span>
              </div>
            )}
          </div>
        </div>

  <div className={otpSent && !otpVerified ? '' : 'hidden'}>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter OTP *</label>
          {/* OTP inputs and verify button: hide after verification */}
          {!otpVerified && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center">
              <div className="flex gap-1 sm:gap-2 justify-center">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    id={`otp-${index}`}
                    key={index}
                    type="text"
                    maxLength="1"
                    pattern="[0-9]"
                    className={`w-9 h-9 sm:w-12 sm:h-12 text-center glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 text-sm sm:text-lg font-semibold
                      ${errors.otpCode ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                    value={formData.otpCode[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // accept only single digit or empty
                      if (/^[0-9]$/.test(value) || value === '') {
                        const newOtp = formData.otpCode ? formData.otpCode.split('') : [];
                        while (newOtp.length < 6) newOtp.push('');
                        newOtp[index] = value;
                        const updatedOtp = newOtp.join('');
                        handleInputChange({ target: { id: 'otpCode', value: updatedOtp } });
                        if (value && index < 5) {
                          const nextInput = document.getElementById(`otp-${index + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }
                    }}
                    onPaste={(e) => {
                      // handle paste to distribute digits across inputs
                      e.preventDefault();
                      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                      if (!paste) return;
                      const digits = paste.slice(0, 6 - index).split('');
                      const newOtp = formData.otpCode ? formData.otpCode.split('') : [];
                      while (newOtp.length < 6) newOtp.push('');
                      for (let i = 0; i < digits.length; i++) {
                        newOtp[index + i] = digits[i];
                        const el = document.getElementById(`otp-${index + i}`);
                        if (el) el.value = digits[i];
                      }
                      const updatedOtp = newOtp.join('');
                      handleInputChange({ target: { id: 'otpCode', value: updatedOtp } });
                      // focus the next empty input if any
                      const firstEmpty = newOtp.findIndex((d) => d === '');
                      const focusIndex = firstEmpty === -1 ? Math.min(index + digits.length, 5) : firstEmpty;
                      const focusEl = document.getElementById(`otp-${focusIndex}`);
                      if (focusEl) focusEl.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !e.target.value && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={verifyOTP}
                disabled={verifyingOtp}
                className="flex-shrink-0 w-full sm:w-28 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all whitespace-nowrap disabled:opacity-50 text-center text-sm sm:text-base"
              >
                {verifyingOtp ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          )}
          <div className="mt-2">
            <p className="text-xs text-slate-400">OTP sent to your email address</p>
            {!otpVerified && (
              <>
                {resendCountdown > 0 ? (
                  <p className="text-xs text-slate-400 mt-1">Resend OTP in {resendCountdown} seconds</p>
                ) : (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={sendingOtp}
                    className="text-xs text-blue-400 hover:text-blue-300 underline mt-1 disabled:opacity-50"
                  >
                    {sendingOtp ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </>
            )}
          </div>
          {touched.otpCode && errors.otpCode && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.otpCode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailOtpStep;
