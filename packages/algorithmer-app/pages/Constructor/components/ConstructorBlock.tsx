import { memo, Fragment } from "preact/compat";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { LinkerContext, LinkerObject } from "./Linker/context";
import { cx } from "../../../../algorithmer-utils";
import { Span } from "../../../../algorithmer-locale";


type ConstructorBlockProps = {
  type: 'action' | 'subscription',
  id: any,
  step: any,
}

export const ConstructorBlock = memo(({ id, type, step }: ConstructorBlockProps) => {
  const linker = useContext(LinkerContext);

  const ref = useRef<HTMLDivElement>();
  const canBeLinkedWith = (obj: LinkerObject) => {
    if (obj.id === id) {
      return false;
    }
    return obj.meta.step + 1 === step;
  };
  useEffect(() => {
    if (!linker || !ref.current) {
      return;
    }

    linker!.useObject(id, {
      factory: () => {
        let rect = ref.current!.getBoundingClientRect();
        return {
          endX: rect.x + rect.width - 1,
          endY: rect.y + rect.height / 2,
          startX: rect.x,
          startY: rect.y + rect.height / 2,
        };
      },
      canLinkWith: canBeLinkedWith,
      meta: {
        type: type,
        step: step,
      }
    });
  }, [ref]);

  /* linking */
  const startLinking = (e: Event) => {
    linker!.startLinking(id);
    e.stopPropagation();
  };

  const endLinking = () => {
    linker!.endLinking(id);
  };


  return (
    <div className={'constructor-block-outer'}>
      <div
        className={cx('constructor-block-inner', type)}
        ref={ref}
      >
        <div
          onClick={endLinking}
          className={cx(
            'constructor-block',
            linker?.linking && canBeLinkedWith(linker.linking) && 'linking',
            type
          )}
        >
          <div className={'action-title'}>
            <Span text={type === 'subscription' ? 'SUBSCRIPTION_BLOCK' : 'ACTION_BLOCK'}/>
          </div>
          {type} {id}
        </div>
      </div>
    </div>
  )
});