import React from 'react'
import officialLogoSrc from '@/assets/logo-contempla-1348e.png'

interface ContemplaLogoProps {
  /**
   * Variantes de exibição:
   * - 'official': imagem oficial anexada "contempla CONSÓRCIOS" com símbolo C verde-água/creme.
   * - 'dark-bg': para uso sobre fundos escuros (header institucional, footer, tela de parceiro).
   * - 'badge': para uso com cápsula escura.
   * - 'light-bg': se necessário sobre fundo claro (com badge ou versão com bom contraste).
   */
  variant?: 'official' | 'dark-bg' | 'light-bg' | 'badge'
  className?: string
  alt?: string
}

/**
 * Componente da logo oficial "contempla CONSÓRCIOS" com o símbolo C verde-água.
 */
export const ContemplaLogo: React.FC<ContemplaLogoProps> = ({
  variant = 'official',
  className = 'h-10 sm:h-11 w-auto',
  alt = 'contempla CONSÓRCIOS',
}) => {
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center rounded-lg bg-[#0d1a30] px-3 py-1.5 shadow-sm border border-slate-700/60">
        <img
          src={officialLogoSrc}
          alt={alt}
          className={`object-contain pointer-events-none select-none max-w-full ${className}`}
          loading="eager"
        />
      </div>
    )
  }

  return (
    <img
      src={officialLogoSrc}
      alt={alt}
      className={`object-contain pointer-events-none select-none max-w-full ${className}`}
      loading="eager"
    />
  )
}

export default ContemplaLogo
