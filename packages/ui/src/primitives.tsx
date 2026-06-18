import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import type { StatusTone } from "@sportil/types";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  icon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={cx("ui-button", `ui-button--${variant}`, className)} type={type} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

export type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
};

export function LinkButton({
  children,
  className,
  icon,
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <a className={cx("ui-button", `ui-button--${variant}`, className)} {...props}>
      {icon}
      <span>{children}</span>
    </a>
  );
}

export type ServiceHeaderProps = {
  eyebrow: string;
  subtitle: string;
  title: string;
  utility?: ReactNode;
};

export function ServiceHeader({ eyebrow, subtitle, title, utility }: ServiceHeaderProps) {
  return (
    <header className="ui-service-header">
      <div className="ui-service-header__inner">
        <div className="ui-service-header__identity">
          <span aria-hidden="true" className="ui-service-header__mark">
            <img alt="" decoding="async" src="/images/brand/sportil-logo-mark.png" />
          </span>
          <div className="ui-service-header__copy">
            <p className="ui-service-header__eyebrow">{eyebrow}</p>
            <p className="ui-service-header__brand">{title}</p>
            <p>{subtitle}</p>
          </div>
        </div>
        {utility}
      </div>
    </header>
  );
}

export type SearchBoxProps = {
  actionLabel: string;
  defaultValue?: string | undefined;
  icon?: ReactNode;
  label: string;
  placeholder: string;
};

export function SearchBox({ actionLabel, defaultValue, icon, label, placeholder }: SearchBoxProps) {
  return (
    <form className="ui-search-box" role="search">
      <label htmlFor="sport-search">{label}</label>
      <div className="ui-search-box__row">
        {icon}
        <input
          defaultValue={defaultValue}
          id="sport-search"
          name="q"
          placeholder={placeholder}
          type="search"
        />
      </div>
      <Button type="submit">{actionLabel}</Button>
    </form>
  );
}

export type NoticeProps = {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
  tone?: "info" | "warning" | "danger" | "success";
};

export function Notice({ children, icon, title, tone = "info" }: NoticeProps) {
  return (
    <aside className={cx("ui-notice", `ui-notice--${tone}`)}>
      {icon}
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </aside>
  );
}

export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusTone;
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return <span className={cx("ui-status-badge", `ui-status-badge--${tone}`)}>{children}</span>;
}

export type SegmentedControlProps = {
  ariaLabel: string;
  options: Array<{ disabled?: boolean; href?: string; label: string; selected?: boolean }>;
};

export function SegmentedControl({ ariaLabel, options }: SegmentedControlProps) {
  return (
    <div aria-label={ariaLabel} className="ui-segmented-control" role="group">
      {options.map((option) => (
        option.href && !option.disabled ? (
          <a aria-current={option.selected ? "true" : undefined} href={option.href} key={option.label}>
            {option.label}
          </a>
        ) : (
          <button
            aria-pressed={option.selected ? "true" : "false"}
            disabled={option.disabled}
            key={option.label}
            type="button"
          >
            {option.label}
          </button>
        )
      ))}
    </div>
  );
}

export type SummaryListProps = {
  items: Array<{ label: string; value: string }>;
};

export function SummaryList({ items }: SummaryListProps) {
  return (
    <dl className="ui-summary-list">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export type ResultCardProps = {
  action: ReactNode;
  badge: ReactNode;
  children: ReactNode;
  details: Array<{ icon?: ReactNode; text: string }>;
  href: string;
  image?: { alt: string; src: string } | undefined;
  meta: string;
  stats?: ReactNode | undefined;
  title: string;
};

export function ResultCard({
  action,
  badge,
  children,
  details,
  href,
  image,
  meta,
  stats,
  title,
}: ResultCardProps) {
  return (
    <article className="ui-result-card">
      {image ? (
        <a aria-label={title} className="ui-result-card__image-link" href={href}>
          <img alt={image.alt} className="ui-result-card__image" loading="lazy" src={image.src} />
        </a>
      ) : null}
      <div className="ui-result-card__top">
        <div>
          <p className="ui-result-card__meta">{meta}</p>
          <h3>
            <a href={href}>{title}</a>
          </h3>
        </div>
        {badge}
      </div>
      <p>{children}</p>
      <div className="ui-result-card__details">
        {details.map((detail) => (
          <div className="ui-result-card__detail" key={detail.text}>
            {detail.icon}
            <span>{detail.text}</span>
          </div>
        ))}
      </div>
      {stats ? <div className="ui-result-card__stats">{stats}</div> : null}
      <div className="ui-result-card__action">{action}</div>
    </article>
  );
}

export type BottomNavProps = {
  ariaLabel: string;
  items: Array<{ active?: boolean; href: string; icon: ReactNode; label: string }>;
};

export function BottomNav({ ariaLabel, items }: BottomNavProps) {
  return (
    <nav aria-label={ariaLabel} className="ui-bottom-nav">
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <a aria-current={item.active ? "page" : undefined} href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
