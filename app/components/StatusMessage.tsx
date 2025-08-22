

interface StatusMessageProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

export function StatusMessage({ type, message, className = "" }: StatusMessageProps) {
  const baseClasses = "p-4 rounded-md border";
  
  const typeClasses = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const classes = `${baseClasses} ${typeClasses[type]} ${className}`;

  return (
    <div className={classes}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}