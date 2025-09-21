import { Typography } from "@/components/typography";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatNaira } from "@/utils/price-formatter";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";


export default function ProductCard({ data }) {
  const { addItem, removeItem, getItemQuantity, isItemInCart, incrementItem, decrementItem } = useCartStore();
  const { toggleItem, isItemInWishlist } = useWishlistStore();
  const [isAdding, setIsAdding] = useState(false);

  const itemInCart = isItemInCart(data?.id);
  const itemQuantity = getItemQuantity(data?.id);
  const itemInWishlist = isItemInWishlist(data?.id);

  const handleAddToCart = async () => {
    if (!data) return;

    // Check if item is already in wishlist
    if (itemInWishlist) {
      toast.error("Cannot add to cart, item already in wishlist", {
        description: `${data.title} is already in your wishlist`,
        duration: 3000,
      });
      return;
    }

    setIsAdding(true);

    try {
      const cartItem = {
        id: data.id,
        title: data.title,
        price: data.price,
        image: data.category?.image || data.images?.[0] || '',
        description: data.description,
        category: data.category?.name,
        metadata: {
          categoryId: data.category?.id,
          originalData: data
        }
      };

      addItem(cartItem, 1);

      toast.success("Added to cart", {
        description: `${data.title} has been added to your cart`,
        duration: 2000,
      });

      // Simulate API call delay for better UX
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error("Failed to add to cart", {
        description: "There was an error adding the item to your cart",
        duration: 3000,
      });
      setIsAdding(false);
    }
  };

  const handleIncrement = () => {
    incrementItem(data.id, 1);
    toast.success("Quantity increased", {
      description: `${data.title} quantity increased to ${itemQuantity + 1}`,
      duration: 1500,
    });
  };

  const handleDecrement = () => {
    if (itemQuantity > 1) {
      decrementItem(data.id, 1);
      toast.success("Quantity decreased", {
        description: `${data.title} quantity decreased to ${itemQuantity - 1}`,
        duration: 1500,
      });
    } else {
      removeItem(data.id);
      toast.success("Removed from cart", {
        description: `${data.title} has been removed from your cart`,
        duration: 2000,
      });
    }
  };

  const handleToggleWishlist = () => {
    if (!data) return;

    // Check if item is already in cart
    if (itemInCart) {
      toast.error("Cannot add to wishlist, item already in cart", {
        description: `${data.title} is already in your cart`,
        duration: 3000,
      });
      return;
    }

    const wishlistItem = {
      id: data.id,
      title: data.title,
      price: data.price,
      image: data.category?.image || data.images?.[0] || '',
      description: data.description,
      category: data.category?.name,
      metadata: {
        categoryId: data.category?.id,
        originalData: data
      }
    };

    const wasAdded = toggleItem(wishlistItem);
    
    // Show appropriate toast based on action
    if (wasAdded) {
      toast.success("Added to wishlist", {
        description: `${data.title} has been added to your wishlist`,
        duration: 2000,
      });
    } else {
      toast.success("Removed from wishlist", {
        description: `${data.title} has been removed from your wishlist`,
        duration: 2000,
      });
    }
  };

  return (
    <div
      role="contentinfo"
      aria-label={`${data?.title} product`}
      aria-labelledby={`${data?.title} product`}
      className="relative w-full max-w-xs h-full flex flex-col space-y-3 p-4 border border-slate-200 rounded-xs bg-white"
    >
      <div className="w-full h-full flex-3/4 p-2 rounded-sm overflow-hidden">
        <img
          src={data?.category?.image}
          alt={data?.title}
          title={data?.title}
          aria-label={data?.title}
          aria-labelledby={data?.title}
          width={700}
          height={700}
          className="w-full h-full object-contain"
        />
      </div>
      <section className="w-full h-max mt-auto">
        <div className="w-full flex items-center justify-between">
          <Typography.small className="text-xs px-2 py-1 bg-fuchsia-200 rounded-xs">{data?.category?.name}</Typography.small>
          <button
            type="button"
            onClick={handleToggleWishlist}
            title={itemInWishlist ? `Remove ${data?.title} from wishlist` : `Add ${data?.title} to wishlist`}
            aria-label={itemInWishlist ? `Remove ${data?.title} from wishlist` : `Add ${data?.title} to wishlist`}
            aria-labelledby={itemInWishlist ? `Remove ${data?.title} from wishlist` : `Add ${data?.title} to wishlist`}
            className="transition-colors duration-200 hover:text-red-500"
          >
            <Icon 
              icon={itemInWishlist ? "mdi:heart" : "mdi-light:heart"} 
              width={20} 
              height={20} 
              className={itemInWishlist ? "text-red-500" : "text-gray-400"}
            />
          </button>
        </div>
        <Typography.h5 responsive className="truncate">{data?.title}</Typography.h5>
        <div className="w-full flex items-center justify-between">
          <span className="mt-2">
            <Typography.p className="font-semibold">{formatNaira(data?.price)}</Typography.p>
          </span>

          <div className="flex items-center gap-2 mt-2">
            {itemInCart ? (
              <div className="flex items-center gap-1 border border-slate-300 rounded-full">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="text-neutral-500 transition-transform duration-75 hover:text-red-500"
                  aria-label={`Remove one ${data?.title} from cart`}
                >
                  <Icon icon="fluent:subtract-circle-16-filled" width={20} height={20} />
                </button>
                <span className="text-base font-medium text-center">
                  {itemQuantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="text-neutral-500 transition-transform duration-75 hover:text-green-500"
                  aria-label={`Add one more ${data?.title} to cart`}
                >
                  <Icon icon="fluent:add-circle-16-filled" width={20} height={20} />
                </button>
              </div>
            ) : (
              <Typography.small asChild responsive>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  title={isAdding ? "Adding to cart..." : "Add to Cart"}
                  aria-label={`Add ${data?.title} to cart`}
                  className={`hover-btn
                    ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Icon
                    icon={isAdding ? "line-md:loading-loop" : "f7:bag-badge-plus"}
                    width={24}
                    height={24}
                    className={isAdding ? 'animate-spin' : ''}
                  />
                  {/* {isAdding ? 'Adding...' : 'Add to Cart'} */}
                </button>
              </Typography.small>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
