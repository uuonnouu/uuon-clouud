
import React, { useState } from 'react';

export function CopyrightNotice() {
  const [showFullNotice, setShowFullNotice] = useState(false);

  return (
    <>
      {/* Compact Copyright Notice */}
      <div className="fixed bottom-4 left-4 bg-black/90 backdrop-blur-sm text-white text-xs p-3 rounded-lg border border-cyan-500/40 max-w-sm z-50 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">©</span>
          <span className="font-bold">UUON Foundation Inc.</span>
        </div>
        <p className="text-gray-300 mb-2">
          All mathematical models © 2024 Phillip A. Ruiz III
        </p>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="text-green-400">✓</span>
          <span>Personal Use Permitted</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="text-red-400">✗</span>
          <span>Commercial License Required</span>
        </div>
        <button
          onClick={() => setShowFullNotice(true)}
          className="mt-2 text-cyan-400 hover:text-cyan-300 text-[10px] underline"
        >
          View Full License Terms
        </button>
      </div>

      {/* Full License Modal */}
      {showFullNotice && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Copyright & Licensing Terms</h2>
                <button
                  onClick={() => setShowFullNotice(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-sm text-gray-300">
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">🔒 Intellectual Property Rights</h3>
                  <p className="mb-2">
                    <strong>© 2024 UUON Foundation Inc. All Rights Reserved.</strong>
                  </p>
                  <p>
                    All mathematical models, parametric algorithms, and 3D visualizations are the 
                    exclusive intellectual property of Phillip A. Ruiz III and UUON Foundation Inc.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-3">✅ Personal Use Permitted</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Educational study and research (non-commercial)</li>
                    <li>Personal art projects and creativity</li>
                    <li>Student assignments and portfolios</li>
                    <li>Social media sharing with attribution</li>
                    <li>Personal 3D printing and modeling</li>
                    <li>Academic publications with citation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-3">🚫 Commercial Use Prohibited</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Commercial software integration</li>
                    <li>Business applications and consulting</li>
                    <li>Paid educational courses</li>
                    <li>Commercial 3D printing services</li>
                    <li>Revenue-generating platforms</li>
                    <li>Medical device development for profit</li>
                    <li>Architectural/engineering commercial projects</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3">💼 Commercial Licensing Available</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Standard Commercial</h4>
                      <p className="text-xs text-gray-400">$5,000-$15,000 annually</p>
                      <p className="text-xs">Small business package with technical support</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Enterprise License</h4>
                      <p className="text-xs text-gray-400">$25,000-$100,000 annually</p>
                      <p className="text-xs">Unlimited access with custom development</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Research/Scientific</h4>
                      <p className="text-xs text-gray-400">Contact for pricing</p>
                      <p className="text-xs">Research and scientific visualization applications</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Educational Institution</h4>
                      <p className="text-xs text-gray-400">$299-$999 annually</p>
                      <p className="text-xs">School/university classroom usage</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-3">📋 Required Attribution</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="font-mono text-xs text-gray-200">
                      "Mathematical model from Δmension Mathematical Universe<br/>
                      © 2024 UUON Foundation Inc. - Phillip A. Ruiz III<br/>
                      Personal use only - Commercial license required"
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-purple-400 mb-3">📞 Contact for Commercial Licensing</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p><strong>Email:</strong> phi1@uuonfoundation.com</p>
                    <p><strong>Website:</strong> www.uuonfoundation.com</p>
                    <p><strong>Social:</strong> @uuon.foundation</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Response time: 24-48 hours for licensing inquiries
                    </p>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-300 mb-2">🔐 Protected Technology</h4>
                  <p className="text-xs">
                    Our mathematical models include cryptographic protection, hidden watermarks, 
                    and digital signatures. Unauthorized commercial use will be detected and prosecuted.
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setShowFullNotice(false)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  I Understand These Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
