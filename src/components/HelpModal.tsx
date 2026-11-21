import { useEffect, useRef } from 'react';
import { Keyboard, Lock, Repeat, X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    closeButtonRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <h2
            id="help-modal-title"
            className="text-xl font-display font-bold text-slate-900 dark:text-slate-50"
          >
            Como funciona a Estação 1 — FlashCards
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de ajuda"
            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Learning Modes */}
          <section className="space-y-2.5">
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-slate-50">
              Três modos de aprendizagem
            </h3>
            <ul className="space-y-2">
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-slate-50">1. Estudo Livre:</strong>{' '}
                Explora todas as cartas ou filtra por domínio sem avaliação. Vira cada carta para ler a resposta e a recomendação prática «Na escola, lembra-te:».
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-slate-50">2. Modo Desafio (Recordação Ativa):</strong>{' '}
                Tenta formular mentalmente a resposta antes de virar a carta. Todas as cartas viradas são contabilizadas no teu progresso total (e não apenas as dominadas). Podes ainda usar «Rever cartas» para trabalhar em conjunto as cartas marcadas «Com dúvidas» e «Não me lembrei», ou clicar em «Ver resumo» a qualquer momento.
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-slate-50">3. Desafio Rápido de 10:</strong>{' '}
                Seleciona aleatoriamente 10 cartas através do algoritmo Fisher-Yates para uma revisão curta com resumo final e opção para rever todas as cartas marcadas «Com dúvidas» e «Não me lembrei».
              </li>
            </ul>
          </section>

          {/* Spaced Repetition */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <Repeat className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
              <h3 className="text-base font-display font-bold">
                Autoavaliação e repetição orientada
              </h3>
            </div>
            <p>
              No <strong>Modo Desafio</strong>, todas as cartas que virares são contabilizadas, e a secção <strong>Para rever</strong> agrupa tanto as cartas «Com dúvidas» como «Não me lembrei»:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Não me lembrei (1):</strong> a carta regressa rapidamente à fila (cerca de 2 a 3 cartas depois).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Com dúvidas (2):</strong> a carta regressa mais tarde durante a mesma sessão para uma nova revisão.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-slate-100">Já domino! (3):</strong> a carta é marcada como dominada e sai da fila atual.
              </li>
            </ul>
          </section>

          {/* Keyboard shortcuts */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <Keyboard className="w-4 h-4 text-sky-700 dark:text-sky-400" aria-hidden="true" />
              <h3 className="text-base font-display font-bold">Atalhos de teclado</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">Espaço</kbd> ou{' '}
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">Enter</kbd>: Virar a carta
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">←</kbd> /{' '}
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">→</kbd>: Anterior / Seguinte (Estudo Livre)
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">1</kbd>: Selecionar «Não me lembrei»
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">2</kbd>: Selecionar «Com dúvidas»
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 sm:col-span-2">
                <kbd className="font-mono font-semibold text-slate-900 dark:text-slate-50">3</kbd>: Selecionar «Já domino!»
              </div>
            </div>
          </section>

          {/* Privacy by design */}
          <section className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                Privacidade desde a conceção
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 mt-0.5">
                Esta aplicação funciona integralmente no teu navegador, sem ligação à Internet, sem recolha de dados pessoais e sem envio de informações. O progresso anónimo fica guardado apenas localmente e pode ser apagado a qualquer momento através do botão «Limpar progresso».
              </p>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-sky-700 dark:bg-sky-600 text-white text-sm font-semibold hover:bg-sky-800 dark:hover:bg-sky-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            Compreendido
          </button>
        </div>
      </div>
    </div>
  );
}
