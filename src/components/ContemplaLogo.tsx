import React from 'react'
import logoSrc from '@/assets/logo-contempla-6219e.png'

interface ContemplaLogoProps {
  /**
   * Variantes de exibição:
   * - 'dark-bg': para uso sobre fundos escuros (header da Index, footer da Index, barra do login de Parceiro).
   *   Como o asset possui fundo preto / escuro e elementos em creme + teal, renderiza a imagem
   *   horizontal completa com object-contain sem nenhum corte lateral ou vertical.
   * - 'badge': para uso sobre fundos claros (ex.: topo interno da Área do Parceiro),
   *   envolvendo a logo em uma cápsula escura elegante com cantos suaves para garantir contraste
   *   perfeito e integridade de todos os elementos.
   */
  variant?: 'dark-bg' | 'badge'
  className?: string
  alt?: string
}

/**
 * Componente da nova logo "contempla CONSÓRCIOS".
 *
 * Imagem: `src/assets/logo-contempla-6219e.png`
 * Símbolo "C" bipartido (verde-água/teal + creme) à esquerda +
 * textos "contempla" e "CONSÓRCIOS" em tom creme.
 *
 * A imagem já possui proporção panorâmica (~5:1).
 * Não há cortes laterais nem verticais; o object-contain assegura que 100% da marca
 * fique visível e legível em todos os viewports.
 */
export const ContemplaLogo: React.FC<ContemplaLogoProps> = ({
  variant = 'dark-bg',
  className = 'h-10 w-auto',
  alt = 'Contempla Consórcios',
}) => {
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center rounded-lg bg-[#091523] px-2.5 py-1 shadow-sm border border-slate-700/50">
        <img
          src={logoSrc}
          alt={alt}
          className={`object-contain pointer-events-none select-none max-w-full ${className}`}
          loading="eager"
        />
      </div>
    )
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`object-contain pointer-events-none select-none max-w-full ${className}`}
      loading="eager"
    />
  )
}

export default ContemplaLogo
