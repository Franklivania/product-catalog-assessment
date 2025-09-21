import { Typography } from "@/components/typography";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import CartDisplay from "@/ui/cart-display";
import WishlistDisplay from "@/ui/wishlist-display";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Navbar() {
  const { items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  const handleCartToggle = () => setOpenCart(prev => !prev);
  const handleWishlistToggle = () => setOpenWishlist(prev => !prev);

  return (
    <header className="w-full px-6 py-3 flex items-center justify-between border-b border-slate-200">
      <span className="flex items-center">
        <Icon icon="ic:outline-store" width={24} height={24} />
        <Typography.h3 className="font-ribeye">La Tienda</Typography.h3>
      </span>

      <aside className="space-x-4">
        {/* <button
          type="button"
          title="User profile"
          aria-label="User profile"
          aria-labelledby="User profile"
          className="hover-btn"
        >
          <Icon icon="solar:user-circle-broken" width={20} height={20} />
        </button> */}
        <button
          type="button"
          title="Wishlist"
          aria-label="Wishlist"
          aria-labelledby="Wishlist"
          className="relative hover-btn"
          onClick={handleWishlistToggle}
        >
          <Icon icon="mdi-light:heart" width={20} height={20} />
          {wishlistItems?.length > 0 && (
            <span className="absolute -top-0 -right-0 text-[8px] py-1 px-2 bg-fuchsia-700 rounded-full text-white">{wishlistItems?.length}</span>
          )}
        </button>
        <button
          type="button"
          title="Cart"
          aria-label="Cart"
          aria-labelledby="Cart"
          className="relative hover-btn"
          onClick={handleCartToggle}
        >
          <Icon icon="solar:bag-broken" width={20} height={20} />
          {items?.length > 0 && (
            <span className="absolute -top-0 -right-0 text-[8px] py-1 px-2 bg-fuchsia-700 rounded-full text-white">{items?.length}</span>
          )}
        </button>
        <CartDisplay open={openCart} closeDisplay={handleCartToggle} />
        <WishlistDisplay open={openWishlist} closeDisplay={handleWishlistToggle} />
      </aside>
    </header >
  )
}
