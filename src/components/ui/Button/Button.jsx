export function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }) {
  const base = 'btn';
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn bg-red-600 text-white hover:bg-red-700',
    subtle: 'btn bg-slate-100 text-slate-700 hover:bg-slate-200',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: '', lg: 'px-5 py-2.5 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
