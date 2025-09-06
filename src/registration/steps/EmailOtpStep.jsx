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
              className={`flex-1 px-4 py-3 glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0
                ${errors.emailId ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
              placeholder="Enter your email address"
              value={formData.emailId}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={sendOTP}
              disabled={sendingOtp || otpSent}
              className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {sendingOtp ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
          {touched.emailId && errors.emailId && (
            <p className={`${isLight ? 'text-red-600' : 'text-red-400'} text-xs mt-1`}>{errors.emailId}</p>
          )}
        </div>

        <div className={otpSent ? '' : 'hidden'}>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Enter OTP *</label>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  pattern="[0-9]"
                  disabled={otpVerified}
                  className={`w-12 h-12 text-center glass-effect rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-0 text-lg font-semibold
                    ${errors.otpCode ? 'border-red-500' : ''} ${isLight ? 'text-black' : 'text-white'}`}
                  value={formData.otpCode[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]$/.test(value) || value === '') {
                      const newOtp = formData.otpCode.split('');
                      newOtp[index] = value;
                      const updatedOtp = newOtp.join('');
                      handleInputChange({ target: { id: 'otpCode', value: updatedOtp } });
                      if (value && index < 5) {
                        const nextInput = e.target.nextElementSibling;
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !e.target.value && index > 0) {
                      const prevInput = e.target.previousElementSibling;
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
              disabled={verifyingOtp || otpVerified}
              className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {verifyingOtp ? 'Verifying...' : otpVerified ? 'Verified' : 'Verify'}
            </button>
          </div>
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
