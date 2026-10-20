import React from 'react'
import logoSrc from '@/assets/logos-contempla-1-1-4ad2e.png'

interface ContemplaLogoProps {
  /**
   * Variantes de exibição:
   * - 'dark-bg': para uso sobre fundos escuros (header, footer, botões escuros)
   *   Utiliza a cor exata do fundo da logo (#091523) com recorte proporcional do miolo e mix-blend suave.
   * - 'badge': para uso sobre fundos claros, isolando a marca em uma cápsula elegante escura com borda suave
   */
  variant?: 'dark-bg' | 'badge'
  className?: string
  alt?: string
}

/**
 * Componente que renderiza a nova logo "contempla consórcios" recortando com precisão
 * o quadrado de 1024x1024 original para focar exclusivamente no símbolo estilizado "C"
 * e nos textos "contempla" e "CONSÓRCIOS".
 */
export const ContemplaLogo: React.FC<ContemplaLogoProps> = ({
  variant = 'dark-bg',
  className = 'h-10 w-auto',
  alt = 'Contempla Consórcios',
}) => {
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center rounded-lg bg-[#091523] px-3 py-1.5 shadow-sm border border-slate-700/40">
        <div className={`relative overflow-hidden aspect-[16/6] ${className}`}>
          <img
            src={logoSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-[50%_50%] scale-[2.2] pointer-events-none select-none"
            loading="eager"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden aspect-[16/6] inline-block ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-[50%_50%] scale-[2.2] pointer-events-none select-none"
        loading="eager"
      />
    </div>
  )
}

export default ContemplaLogo
