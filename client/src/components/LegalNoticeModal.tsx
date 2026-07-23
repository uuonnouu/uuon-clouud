import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalNoticeModal({ isOpen, onClose }: LegalNoticeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 border-2 border-purple-500/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service & Legal Notice
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-gray-200">
            <section>
              <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                1. Ownership & Intellectual Property
              </h3>
              <p className="leading-relaxed text-gray-300">
                All algorithms, formulas, and systems used to generate shapes within this application remain the 
                <span className="font-bold text-white"> sole property of the developer</span>. Access to shapes and outputs does{' '}
                <span className="font-bold text-white">not transfer ownership</span> of the underlying algorithms, code, or methods. 
                Any use of shapes is <span className="font-bold text-white">subject to individual company or user application, context, 
                and ethical responsibility</span>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                <span className="text-2xl">📜</span>
                2. Usage & Application Rights
              </h3>
              <p className="leading-relaxed text-gray-300">
                Users may interact with, explore, and render shapes for{' '}
                <span className="font-bold text-white">personal, educational, or enterprise purposes</span>, but no part of this 
                system may be redistributed, reverse-engineered, or commercialized{' '}
                <span className="font-bold text-white">without explicit written permission</span> from the developer.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                3. Privacy & Data
              </h3>
              <p className="leading-relaxed text-gray-300">
                This application respects user privacy. Any input data, parameters, or interactions remain{' '}
                <span className="font-bold text-white">confidential</span> and are not shared outside the scope of the system 
                without consent.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                4. Development Mode Notice
              </h3>
              <p className="leading-relaxed text-gray-300">
                This application is <span className="font-bold text-white">currently in development</span>. Features, algorithms, 
                and outputs are experimental and may change. Users should be aware that stability, accuracy, or completeness is 
                not guaranteed.
              </p>
            </section>

            <div className="pt-6 mt-6 border-t border-purple-500/30">
              <p className="text-center text-gray-400 font-semibold">
                © 2025 UUON Foundation Inc, Dmension/Δmension Mathematical Universe
              </p>
              <p className="text-center text-gray-500 mt-1">
                All Rights Reserved
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
