import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, RotateCcw } from 'lucide-react';

const SignaturePad = ({ onSave, onCancel, title = 'Renter Signature' }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState('');

  // Initialize canvas with background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    // Fill background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    // Draw signature line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, rect.height - 30);
    ctx.lineTo(rect.width - 20, rect.height - 30);
    ctx.stroke();
    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Sign here', 20, rect.height - 14);
  }, []);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [getPos]);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback((e) => {
    e?.preventDefault();
    setIsDrawing(false);
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
    // Redraw signature line
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, rect.height - 30);
    ctx.lineTo(rect.width - 20, rect.height - 30);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Sign here', 20, rect.height - 14);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (!hasDrawn || !signerName.trim()) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl, signerName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full border border-white/10 overflow-hidden"
        style={{ animation: 'sigPadIn 0.2s ease-out both' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-white/60">
            By signing below, the tenant acknowledges that all checklist items have been reviewed and understood.
          </p>

          {/* Signer name */}
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="Tenant full name..."
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none"
          />

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl cursor-crosshair touch-none"
              style={{ height: '180px', background: '#1e293b' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />
            {/* Clear button overlay */}
            {hasDrawn && (
              <button onClick={handleClear}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 transition text-white/50 hover:text-white">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-700 text-white/70 rounded-xl hover:bg-slate-600 transition text-sm font-medium">
              Cancel
            </button>
            <button onClick={handleSave}
              disabled={!hasDrawn || !signerName.trim()}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed">
              Confirm Signature
            </button>
          </div>
        </div>

        <style>{`
          @keyframes sigPadIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        `}</style>
      </div>
    </div>
  );
};

export default SignaturePad;
