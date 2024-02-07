import "./styles.css";

interface IExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children, ...rest }: IExternalLinkProps) {
  return (
    <a
      className="codeplot-ExternalLink"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}
