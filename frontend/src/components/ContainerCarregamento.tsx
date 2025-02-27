import type { ReactNode } from "react";

export default function ContainerCarregamento(props: {
  loading: boolean;
  fallback: ReactNode;
  children: ReactNode;
}) {
  if (props.loading) {
    return props.fallback;
  }

  return props.children;
}
