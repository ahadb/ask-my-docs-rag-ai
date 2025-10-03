interface TemplateSidebarProps {
  templates: string[];
  onTemplateClick: (template: string) => void;
  isQuerying: boolean;
  isOnline: boolean;
}

export default function TemplateSidebar({ 
  templates, 
  onTemplateClick, 
  isQuerying, 
  isOnline 
}: TemplateSidebarProps) {
  return (
    <div className="hidden lg:block w-80 border-r border-gray-300" style={{ backgroundColor: '#f0efec' }}>
      <div className="p-4 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800">Template Questions</h3>
        <p className="text-sm text-gray-600">Click any template to get started</p>
      </div>
      <div className="p-4 space-y-0.5 overflow-y-auto h-full">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onTemplateClick(template)}
            disabled={isQuerying || !isOnline}
            className="w-full text-left p-3 rounded-lg transition-colors text-sm text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#D9664A]"
          >
            {template}
          </button>
        ))}
      </div>
    </div>
  );
}
