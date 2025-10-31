import { type Ref, watch, nextTick, onUnmounted } from 'vue';

/**
 * Получить все фокусируемые элементы внутри контейнера
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) =>
      !el.hasAttribute('disabled') && el.tabIndex !== -1 && !!el.offsetParent
  );
}

/**
 * Композабл для создания ловушки фокуса внутри элемента
 * @param containerRef - ref на контейнер, внутри которого нужно удерживать фокус
 * @param active - реактивное значение, определяющее активна ли ловушка
 */
export function useFocusTrap(
  containerRef: Ref<HTMLElement | null>,
  active: Ref<boolean>
) {
  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const container = containerRef.value;
    if (!container) return;

    const focusables = getFocusableElements(container);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const activeElement = document.activeElement as HTMLElement | null;
    const isShift = e.shiftKey;

    // Если фокус вне контейнера, перемещаем его внутрь
    if (!activeElement || !container.contains(activeElement)) {
      e.preventDefault();
      (isShift ? last : first).focus();
      return;
    }

    // Циклическое перемещение фокуса
    if (!isShift && activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (isShift && activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }

  watch(active, async (isActive) => {
    if (isActive) {
      await nextTick();
      document.addEventListener('keydown', handleKeydown, true);

      // Если фокус ушёл за пределы, вернуть его внутрь при открытии
      const container = containerRef.value;
      if (container) {
        const [first] = getFocusableElements(container);
        if (first && !container.contains(document.activeElement)) {
          first.focus();
        }
      }
    } else {
      document.removeEventListener('keydown', handleKeydown, true);
    }
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown, true);
  });
}
