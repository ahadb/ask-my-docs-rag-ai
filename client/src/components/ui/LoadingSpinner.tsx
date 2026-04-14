interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = 'md',
  color = '#D9664A'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f6f4' }}>
      <div className="text-center">
        <div 
          className={`animate-spin rounded-full border-b-2 mx-auto mb-4 ${sizeClasses[size]}`}
          style={{ borderColor: color }}
        ></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
