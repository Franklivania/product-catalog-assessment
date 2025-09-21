
import { Typography } from "@/components/typography";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/utils/cartUtils";
import { Icon } from "@iconify/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { toast } from "sonner";
import useDeviceSize from "@/hooks/useDeviceSize";

export default function WishlistDisplay({ open, closeDisplay }) {
  const { items, removeItem, moveToCart } = useWishlistStore();
  const { addItem } = useCartStore();
  const wishlistRef = useClickOutside(closeDisplay, open);
  const { isMobile } = useDeviceSize();

  const handleMoveToCart = (item) => {
    const movedItem = moveToCart(item.id, addItem);
    if (movedItem) {
      toast.success("Moved to cart", {
        description: `${item.title} has been moved to your cart`,
        duration: 2000,
      });
    }
  };

  const handleRemoveFromWishlist = (item) => {
    removeItem(item.id);
    toast.success("Removed from wishlist", {
      description: `${item.title} has been removed from your wishlist`,
      duration: 2000,
    });
  };

  return (
    <section
      ref={wishlistRef}
      role="dialog"
      aria-label="Wishlist Display"
      aria-labelledby="Wishlist Display"
      className={`absolute top-12 w-full z-20 h-full max-h-[30em] overflow-hidden rounded-sm bg-white border border-slate-300 shadow-lg flex flex-col
        transition-all duration-300 ease-in-out transform origin-top-right
        ${open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-[-10px] pointer-events-none"
        }
        ${isMobile ? "max-w-sm right-0 sm:right-3" : "right-12 max-w-lg"}
        `}
    >
      <header className="w-full px-3 py-4 flex items-center justify-between border-b border-neutral-300">
        <Typography.h4>Wishlist</Typography.h4>
        <button onClick={closeDisplay}>
          <Icon icon="line-md:close" width={24} height={24} />
        </button>
      </header>

      <section className="flex-1 overflow-y-auto">
        {items?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon icon="mdi:heart-outline" width={48} height={48} className="mx-auto mb-4 text-gray-400" />
            <Typography.h5 className="text-gray-500">Your wishlist is empty</Typography.h5>
            <Typography.small className="text-gray-400">Add some items to your wishlist</Typography.small>
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

                <section className="flex items-center justify-between">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center gap-2 px-3 py-1 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors text-sm"
                    aria-label="Add to cart"
                  >
                    <Icon icon="f7:bag-badge-plus" width={16} height={16} />
                    Add to Cart
                  </button>

                  <Typography.large className="font-semibold">
                    {formatPrice(item?.price)}
                  </Typography.large>
                </section>
              </aside>

              <aside className="w-max">
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                  className="p-1 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove from wishlist"
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
              <Typography.h5>{items?.length}</Typography.h5>
            </div>
            <div className="flex items-center justify-between">
              <Typography.h4>Total Value:</Typography.h4>
              <Typography.h4 className="font-bold text-fuchsia-700">
                {formatPrice(items?.reduce((sum, item) => sum + item.price, 0))}
              </Typography.h4>
            </div>
          </footer>
        )
      }
    </section>
  )
}
