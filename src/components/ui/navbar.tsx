import { tv } from "tailwind-variants";

const navbar = tv({
  base: "border-b border-border",
});

const navbarInner = tv({
  base: "flex items-center justify-between px-6 py-3.5",
});

const navbarBrand = tv({
  base: "font-mono text-sm font-medium",
});

const navbarLink = tv({
  base: "font-mono text-xs text-muted transition-colors hover:text-content",
});

type NavbarProps = React.HTMLAttributes<HTMLElement>;

function Navbar({ className, children }: NavbarProps) {
  return (
    <header className={navbar({ className })}>
      <div className={navbarInner()}>{children}</div>
    </header>
  );
}

function NavbarBrand({ className }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={navbarBrand({ className })}>
      <span className="text-accent-green">&gt;</span> devroast
    </span>
  );
}

function NavbarLinks({ children, className }: React.HTMLAttributes<HTMLElement>) {
  return <nav className={className}>{children}</nav>;
}

function NavbarLink({
  href,
  children,
  className,
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={navbarLink({ className })}>
      {children}
    </a>
  );
}

export { Navbar, NavbarBrand, NavbarLinks, NavbarLink };
