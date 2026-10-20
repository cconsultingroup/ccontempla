import React from 'react'
import logoSrc from '@/assets/logos-contempla-1-1-4ad2e.png'

interface ContemplaLogoProps {
  /**
   * Variantes de exibição:
   * - 'dark-bg': para uso sobre fundos escuros (header, footer, barra do parceiro).
   *   O container usa o mesmo azul #091523 do fundo original do PNG, fundindo-se
   *   de forma imperceptível aos cabeçalhos e rodapé do site sem aspecto de recorte.
   * - 'badge': para uso sobre fundos claros, isolando a marca em uma cápsula elegante escura.
   */
  variant?: 'dark-bg' | 'badge'
  className?: string
  alt?: string
}

/**
 * Componente da logo "contempla CONSÓRCIOS".
 *
 * Imagem original: `src/assets/logos-contempla-1-1-4ad2e.png` (quadrada 1024×1024,
 * fundo azul-marinho #091523, marca horizontal centralizada: símbolo de elos dourados
 * à esquerda + textos "contempla" e "CONSÓRCIOS").
 *
 * Correção do corte:
 * - A versão anterior aplicava `scale-[2.2]` em um container `aspect-[16/6]`, provocando
 *   corte severo da tipografia e do símbolo nas bordas.
 * - Com uma janela `aspect-[3.6/1]` e escala suave `scale-[1.28]`, toda a marca
 *   (símbolo + "contempla" + "CONSÓRCIOS") é exibida inteira, com margens de respiro
 *   seguras tanto nas laterais quanto em cima e embaixo.
 * - O fundo do container e a imagem possuem a cor exata `#091523`, mantendo a integração
 *   total com o cabeçalho e rodapé azul-marinho.
 */
export const ContemplaLogo: React.FC<ContemplaLogoProps> = ({
  variant = 'dark-bg',
  className = 'h-10 w-auto',
  alt = 'Contempla Consórcios',
}) => {
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center rounded-lg bg-[#091523] px-2.5 py-1 shadow-sm border border-slate-700/40">
        <div
          className={`relative overflow-hidden aspect-[3.6/1] flex items-center justify-center ${className}`}
        >
          <img
            src={logoSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-center scale-[1.28] pointer-events-none select-none"
            loading="eager"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden aspect-[3.6/1] inline-flex items-center justify-center bg-[#091523] ${className}`}
    >
      <img
        src={logoSrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center scale-[1.28] pointer-events-none select-none"
        loading="eager"
      />
    </div>
  )
}

export default ContemplaLogo
