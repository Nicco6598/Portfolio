import { SemanticsLink } from '../components/SemanticsLink';

export function renderSemanticsLinks(text: string) {
  return text.split(/(Semantics)/g).map((part, index) => (
    part === 'Semantics' ? <SemanticsLink key={`${part}-${index}`} /> : part
  ));
}
