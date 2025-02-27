import type { ReactNode } from "react";

export default function ContainerQuery(props: {
  loading: boolean;
  fallbackCarregamento: ReactNode;
  error: Error | null;
  fallbackErro: ReactNode;
  children: ReactNode;
}) {
  if (props.loading) {
    return props.fallbackCarregamento;
  }

  if (props.error !== null) {
    return props.fallbackErro;
  }

  return props.children;
}
