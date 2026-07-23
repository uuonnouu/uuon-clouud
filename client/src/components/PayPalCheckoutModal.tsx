import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shapeName: string;
  exportType: string;
  price: number;
}

export default function PayPalCheckoutModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  shapeName,
  exportType,
  price
}: PayPalCheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('idle');
      setErrorMessage('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handlePayPalCheckout = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const createResult = await sdkClient.createPayPalOrder({
        shapeName,
        exportType,
        price
      });

      if (!createResult.success) {
        throw new Error('Failed to create PayPal order');
      }

      const { orderId, approvalUrl } = createResult.data;

      const paypalWindow = window.open(approvalUrl, 'PayPal', 'width=600,height=700');
      
      const pollInterval = setInterval(async () => {
        try {
          const statusResult = await sdkClient.checkPayPalOrder(orderId);
          const status = statusResult.data?.status;

          if (status === 'COMPLETED') {
            clearInterval(pollInterval);
            if (paypalWindow) paypalWindow.close();
            setPaymentStatus('success');
            setIsProcessing(false);
            
            setTimeout(() => {
              onSuccess();
            }, 1500);
          } else if (status === 'CANCELLED' || status === 'FAILED') {
            clearInterval(pollInterval);
            if (paypalWindow) paypalWindow.close();
            setPaymentStatus('error');
            setErrorMessage('Payment was cancelled or failed');
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(pollInterval);
        if (paymentStatus === 'processing') {
          setPaymentStatus('error');
          setErrorMessage('Payment timeout - please try again');
          setIsProcessing(false);
        }
      }, 300000);

    } catch (error) {
      console.error('PayPal checkout error:', error);
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-2 border-blue-500/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-blue-400">
            <CreditCard className="w-5 h-5" />
            PayPal Checkout
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Complete payment to export <span className="font-semibold text-blue-300">{shapeName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Order Summary */}
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shape:</span>
                <span className="text-white font-semibold">{shapeName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Export Type:</span>
                <span className="text-white">{exportType}</span>
              </div>
              <div className="h-px bg-gray-700 my-2" />
              <div className="flex justify-between text-lg">
                <span className="text-gray-300 font-semibold">Total:</span>
                <span className="text-blue-400 font-bold">${price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-sm text-blue-300">Processing payment...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex items-center justify-center gap-3 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-sm text-green-300">Payment successful! Starting export...</p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isProcessing}
              className="flex-1 bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayPalCheckout}
              disabled={isProcessing || paymentStatus === 'success'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay with PayPal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
