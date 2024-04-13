import { Slash } from 'lucide-react';
import { Container } from './container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export function Heading({
  title,
  subtitle,
  children,
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  breadcrumbs?: {
    title: string;
    href?: string;
    icon?: React.ExoticComponent<{ className: string }>;
  }[];
}) {
  return (
    <Container>
      <div className='flex space-between gap-4'>
        <div className='flex flex-col gap-4'>
          <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
            {title}
          </h1>
          {subtitle && <p className='leading-7 text-gray-500'>{subtitle}</p>}
          {breadcrumbs && (
            <Breadcrumb>
              <BreadcrumbList>
                {interleave(
                  breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={index}>
                      {breadcrumb.href ? (
                        <BreadcrumbLink
                          href={breadcrumb.href}
                          className='flex items-center gap-2 leading-7'
                        >
                          {breadcrumb.icon && (
                            <breadcrumb.icon className='h-4 w-4' />
                          )}
                          {breadcrumb.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  )),
                  BreadcrumbSeparatorSlash
                )}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        {children}
      </div>
    </Container>
  );
}

function BreadcrumbSeparatorSlash() {
  return (
    <BreadcrumbSeparator>
      <Slash />
    </BreadcrumbSeparator>
  );
}

function interleave(
  arr: JSX.Element[],
  Thing: React.ComponentType<{ key: string }>
) {
  return ([] as JSX.Element[])
    .concat(...arr.map((n, i) => [n, <Thing key={i + '_slash'} />]))
    .slice(0, -1);
}
