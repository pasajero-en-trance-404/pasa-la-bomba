interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 py-6 sm:items-center sm:py-10">
      <div className={`flex w-full max-w-md flex-1 flex-col ${className}`}>
        {children}
      </div>
    </main>
  );
}
