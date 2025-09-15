interface Props {
  text: string;
  path: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ text, path, variant = 'primary' }: Props) {
  const baseClasses = 'font-bold py-2 px-4 rounded transition-all no-underline inline-block';

  const styles = {
    primary: 'bg-accent hover:brightness-90 text-text-main',
    secondary: 'bg-transparent text-text-sub hover:bg-gray-200',
  };

  return (
    <a class={`${baseClasses} ${styles[variant]}`} href={path}>
      {text}
    </a>
  );
}
