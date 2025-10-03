import { XMarkIcon } from "@heroicons/react/24/outline";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  templates: string[];
  onTemplateClick: (template: string) => void;
  isQuerying: boolean;
  isOnline: boolean;
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  templates, 
  onTemplateClick, 
  isQuerying, 
  isOnline 
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Templates Panel */}
      <div className="relative w-80 h-full bg-white shadow-xl">
        <div className="p-4 border-b border-gray-300" style={{ backgroundColor: '#f0efec' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Template Questions</h3>
              <p className="text-sm text-gray-600">Click any template to get started</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-0.5 overflow-y-auto h-full">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                onTemplateClick(template);
                onClose();
              }}
              disabled={isQuerying || !isOnline}
              className="w-full text-left p-3 rounded-lg transition-colors text-sm text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#D9664A]"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
