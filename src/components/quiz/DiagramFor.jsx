import React from 'react';
import AngleDiagram from '../shared/diagrams/AngleDiagram';

export default function DiagramFor({ figure, notToScale = true }) {
  if (!figure) return null;
  return <AngleDiagram figure={figure} notToScale={notToScale} width={340} height={280} />;
}
