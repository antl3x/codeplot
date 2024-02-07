import "./styles.css";

interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function Link({ href, children, ...rest }: ILinkProps) {
  return (
    <a className="codeplot-Link" href={href} {...rest}>
      {children}
    </a>
  );
}
