import { RedirectType, redirect } from 'next/navigation';

export default async function Page() {
  return redirect('/market', RedirectType.push);
}
