import React from 'react'
import logoSrc from '@/assets/logo-contempla-6219e.png'

interface ContemplaLogoProps {
  /**
   * Variantes de exibição:
   * - 'dark-bg': para uso sobre fundos escuros (footer da Index, barra do login de Parceiro).
   * - 'light-bg': para uso no Header claro sobre fundo branco, garantindo a marca em azul institucional (#154671/#1d2f50), nítida e legível.
   * - 'badge': para uso sobre fundos claros com cápsula escura elegante.
   */
  variant?: 'dark-bg' | 'light-bg' | 'badge'
  className?: string
  alt?: string
}

/**
 * Componente da logo "C Contempla — Consórcios".
 */
export const ContemplaLogo: React.FC<ContemplaLogoProps> = ({
  variant = 'light-bg',
  className = 'h-10 w-auto',
  alt = 'C Contempla - Consórcios',
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

  if (variant === 'light-bg') {
    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        {/* Símbolo "C" estilizado no azul institucional #154671 com detalhe teal #15705f */}
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto aspect-square shrink-0"
          aria-hidden="true"
        >
          <rect width="44" height="44" rx="10" fill="#154671" />
          {/* Arco superior do C em gradiente sutil ou tom institucional claro */}
          <path
            d="M28 14.5C25.8 13 22.8 12.5 19.5 13.5C14.8 15 11.8 19.2 12 24C12.2 28.5 15.5 32.2 20 32.8C23.5 33.2 26.8 32 28.8 30"
            stroke="#ffffff"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M22 19C19.5 19 17.5 21 17.5 23.5C17.5 26 19.5 28 22 28C24.5 28 26 26.8 26.8 25.5"
            stroke="#22c55e"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="28" cy="15" r="2.2" fill="#22c55e" />
        </svg>

        {/* Textos da marca em azul institucional nítido */}
        <div className="flex flex-col justify-center leading-none text-left">
          <span className="font-display font-extrabold text-[#154671] text-[19px] sm:text-[22px] tracking-tight leading-none uppercase">
            C Contempla
          </span>
          <span className="font-display font-semibold text-[#1d2f50] text-[9px] sm:text-[10px] tracking-[0.24em] uppercase mt-1">
            CONSÓRCIOS
          </span>
        </div>
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
