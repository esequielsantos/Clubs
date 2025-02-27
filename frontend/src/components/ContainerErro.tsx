import type { ReactNode } from "react";

export default function ContainerErro(props: { possuiErro: boolean; fallback: ReactNode; children: ReactNode }) {
  if (props.possuiErro) {
    return props.fallback;
  }

  return props.children;
}
