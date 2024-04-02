import { Container } from './container';

export function Heading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <Container>
      <h1 className='scroll-m-20 text-lg font-extrabold tracking-tight lg:text-4xl'>
        {title}
      </h1>
      <p className='leading-7 text-gray-500'>{subtitle}</p>
      {children}
    </Container>
  );
}
