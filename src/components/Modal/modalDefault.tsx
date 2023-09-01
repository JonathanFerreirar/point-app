import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface ModalReactProps {
  children: ReactNode
  DateModal?: ReactNode
  small?: boolean
  title: string
}

const ModalDefault = ({
  children,
  DateModal,
  title,
  small,
}: ModalReactProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          className={cn(
            !small ? 'h-[85vh] w-[85vw]' : 'h-auto w-[50vw]',
            `data-[state=open]:animate-contentShow fixed left-[50%] top-[50%]  translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`,
          )}
        >
          <Dialog.Title className="text-mauve12 m-0 text-center text-[17px] font-medium">
            <>{title}</>
          </Dialog.Title>
          {DateModal}
          <div className="flex w-full justify-end">
            <Dialog.Close
              asChild
              className="focus:shadow-green7  my-5 inline-flex h-[35px] items-center rounded-[4px] border border-black px-[15px] font-medium leading-none hover:border-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              <button>Fechar</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ModalDefault
