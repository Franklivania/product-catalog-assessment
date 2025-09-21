import { Typography } from "@/components/typography";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/cartUtils";
import { Icon } from "@iconify/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { toast } from "sonner";
import useDeviceSize from "@/hooks/useDeviceSize";

export default function CartDisplay({ open, closeDisplay }) {
  const { items, totalPrice, incrementItem, decrementItem, removeItem } = useCartStore();
  const cartRef = useClickOutside(closeDisplay, open);
  const { isMobile } = useDeviceSize();

  const handleIncrement = (item) => {
    incrementItem(item.id);
    toast.success("Quantity increased", {
      description: `${item.title} quantity increased to ${item.quantity + 1}`,
      duration: 1500,
    });
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      decrementItem(item.id);
      toast.success("Quantity decreased", {
        description: `${item.title} quantity decreased to ${item.quantity - 1}`,
        duration: 1500,
      });
    } else {
      removeItem(item.id);
      toast.success("Removed from cart", {
        description: `${item.title} has been removed from your cart`,
        duration: 2000,
      });
    }
  };

  const handleRemove = (item) => {
    removeItem(item.id);
    toast.success("Removed from cart", {
      description: `${item.title} has been removed from your cart`,
      duration: 2000,
    });
  };

  return (
    <section
      ref={cartRef}
      role="dialog"
      aria-label="Cart Display"
      aria-labelledby="Cart Display"
      className={`absolute w-full top-12 z-20 h-full max-h-[30em] overflow-hidden rounded-sm bg-white border border-slate-300 shadow-lg flex flex-col
        transition-all duration-300 ease-in-out transform origin-top-right
        ${open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-[-10px] pointer-events-none"
        }
        ${isMobile ? "max-w-sm -right-4 sm:right-0" : "right-12 max-w-lg"}
        `}
    >
      <header className="w-full px-3 py-4 flex items-center justify-between border-b border-neutral-300">
        <Typography.h4>Cart Details</Typography.h4>
        <button onClick={closeDisplay}>
          <Icon icon="line-md:close" width={24} height={24} />
        </button>
      </header>

      <section className="flex-1 overflow-y-auto">
        {items?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon icon="solar:bag-broken" width={48} height={48} className="mx-auto mb-4 text-gray-400" />
            <Typography.h5 className="text-gray-500">Your cart is empty</Typography.h5>
            <Typography.small className="text-gray-400">Add some items to get started</Typography.small>
          </div>
        ) : (
          items?.map((item) => (
            <div
              key={item?.id}
              className="w-full p-4 flex items-start justify-between border-b border-gray-100 last:border-b-0"
            >
              <img
                src={item?.image}
                alt={item?.title}
                title={item?.title}
                aria-label={item?.title}
                aria-labelledby={item?.title}
                width={75}
                height={75}
                className="rounded-xs object-cover"
              />

              <aside className="w-full max-w-xs px-3">
                <Typography.h5 className="mb-1">{item?.title}</Typography.h5>
                <Typography.small className="text-gray-600 mb-2">
                  {formatPrice(item?.price)} each
                </Typography.small>

                <section className="flex items-center justify-between">
                  <div className="flex items-center md:gap-2">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="rounded-full text-neutral-500 hover:text-red-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Icon icon="fluent:subtract-circle-16-filled" width={20} height={20} />
                    </button>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium md:min-w-8 text-center">
                      {item?.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="rounded-full text-neutral-500 hover:text-green-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Icon icon="fluent:add-circle-16-filled" width={20} height={20} />
                    </button>
                  </div>

                  <Typography.large className="font-semibold flex items-center md:gap-2">
                    Total: &nbsp;
                    <span className="font-normal">
                      {formatPrice(item?.price * item?.quantity)}
                    </span>
                  </Typography.large>
                </section>
              </aside>

              <aside className="w-max">
                <button
                  onClick={() => handleRemove(item)}
                  className="p-1 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove item"
                >
                  <Icon icon="line-md:close" width={16} height={16} className="text-red-500" />
                </button>
              </aside>
            </div>
          ))
        )}
      </section>

      {
        items?.length > 0 && (
          <footer className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <Typography.h5>Total Items:</Typography.h5>
              <Typography.h5>{items?.reduce((sum, item) => sum + item.quantity, 0)}</Typography.h5>
            </div>
            <div className="flex items-center justify-between">
              <Typography.h4>Total:</Typography.h4>
              <Typography.h4 className="font-bold text-fuchsia-700">
                {formatPrice(totalPrice)}
              </Typography.h4>
            </div>
          </footer>
        )
      }
    </section >
  )
}
