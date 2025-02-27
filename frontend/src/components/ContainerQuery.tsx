import type { ReactNode } from "react";

export default function ContainerQuery(props: {
  loading: boolean;
  fallbackCarregamento: ReactNode;
  erro: Error | null;
  fallbackErro: ReactNode;
  children: ReactNode;
}) {
  if (props.loading) {
    return props.fallbackCarregamento;
  }

  if (props.erro !== null) {
    return props.fallbackErro;
  }

  return props.children;
}
