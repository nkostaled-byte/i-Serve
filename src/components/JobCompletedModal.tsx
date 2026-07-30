import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Star, Download, RefreshCw, Home, HeartHandshake } from 'lucide-react';
import { ServiceBookingRequest, ServiceProvider } from '../types';

interface JobCompletedModalProps {
  bookingRequest: ServiceBookingRequest;
  provider: ServiceProvider;
  onDone: () => void;
  onBookAgain: () => void;
}

export const JobCompletedModal: React.FC<JobCompletedModalProps> = ({
  bookingRequest,
  provider,
  onDone,
  onBookAgain,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('Excellent service! Arrived on time and solved the electrical issue cleanly.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fire soft confetti burst on load
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#27C2D4', '#3F73C7', '#4340A8', '#10B981'],
    });
  }, []);

  const handleDownloadInvoice = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `i-Serve Official Invoice
========================================
Receipt ID: ${bookingRequest.id}
Category: ${bookingRequest.categoryTitle}
Provider: ${provider.name}
Customer: ${bookingRequest.customerName}
Address: ${bookingRequest.address}
Amount Paid: $${bookingRequest.amount.toFixed(2)}
Payment Method: ${bookingRequest.paymentMethod.toUpperCase()}
Status: COMPLETED & INSURED
Date: ${new Date().toLocaleDateString()}
========================================
Thank you for using i-Serve Home Services!
`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `iServe_Invoice_${bookingRequest.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-white dark:bg-[#131E33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 text-center space-y-5 shadow-2xl relative overflow-hidden border border-transparent dark:border-white/[0.06]"
      >
        {/* Success Check Badge */}
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto float-shadow">
          <Check className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-[#2DD36F] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            Service Completed
          </span>
          <h2 className="text-2xl font-serif text-slate-900 dark:text-white mt-2 font-normal">
            Thank you for using i-Serve!
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#B8C3D9] font-sans mt-1">
            {bookingRequest.categoryTitle} by {provider.name} is complete.
          </p>
        </div>

        {/* Rating stars selector */}
        <div className="bg-[#F6F8FB] dark:bg-[#0E1628] p-4 rounded-[24px] card-shadow space-y-3 border border-transparent dark:border-white/[0.06]">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-white">How was your experience?</h4>
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transform hover:scale-125 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Leave a review for your provider..."
            className="w-full p-3 bg-white dark:bg-[#131E33] border border-slate-100 dark:border-white/[0.06] rounded-[18px] text-xs text-slate-800 dark:text-white focus:outline-none font-sans"
          />

          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              className="px-4 py-2 bg-[#27C2D4] dark:bg-[#21C7F6] text-white dark:text-[#070B14] text-xs font-semibold rounded-full float-shadow"
            >
              Submit Review
            </button>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-[#2DD36F] font-medium flex items-center justify-center space-x-1">
              <HeartHandshake className="w-4 h-4" /> <span>Review Saved! Thank you.</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onBookAgain}
            className="w-full py-3.5 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white dark:text-[#070B14] font-medium rounded-[24px] float-shadow flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Book Again</span>
          </button>

          <button
            onClick={handleDownloadInvoice}
            className="w-full py-3 bg-slate-50 dark:bg-[#17243C] border border-slate-200/60 dark:border-white/[0.06] text-slate-700 dark:text-white font-medium rounded-[24px] text-xs flex items-center justify-center space-x-2 hover:bg-slate-100 dark:hover:bg-[#17243C]/80 transition-colors"
          >
            <Download className="w-4 h-4 text-[#3F73C7] dark:text-[#21C7F6]" />
            <span>Download Official Invoice</span>
          </button>

          <button
            onClick={onDone}
            className="w-full py-3 text-slate-400 dark:text-[#7F8DA8] font-medium text-xs hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            Return to Home Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
