"use client";

import { useState } from "react";
import { MenuItemCardView } from "./MenuItemCardView";
import { ComplementModal } from "./ComplementModal";
import { ShareModal } from "./ShareModal";
import { RemoveItemModal } from "./RemoveItemModal";
import { CartItem,Guest } from "@/types/types";
import { MenuItemCardContainerProps } from "@/types/props";

export function MenuItemCardContainer({
  item,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onItemClick,
  guests,
}: MenuItemCardContainerProps) {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [similarItems, setSimilarItems] = useState<CartItem[]>([]);
  const [isComplementModalOpen, setIsComplementModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<Guest[]>([]);

  const itemCount = cartItems.filter((cartItem) => cartItem.menuItemId === item.id).length;
  const areAllItemsIdentical = (items: CartItem[]): boolean => {
    if (items.length <= 1) return true;
    const itemSignatures = items.map(({ uniqueId, ...rest }) => JSON.stringify(rest));
    return itemSignatures.every((sig) => sig === itemSignatures[0]);
  };
  const handleRemoveClick = () => {
    const productItems = cartItems.filter((cartItem) => cartItem.menuItemId === item.id);
    if (productItems.length === 1) {
      onRemoveFromCart(productItems[0].uniqueId);
      return;
    }
    if (areAllItemsIdentical(productItems)) {
      onRemoveFromCart(productItems[productItems.length - 1].uniqueId);
    } else {
      setSimilarItems(productItems);
      setIsRemoveModalOpen(true);
    }
  };
  const handleConfirmRemove = (uniqueId: string) => {
    onRemoveFromCart(uniqueId);
    setIsRemoveModalOpen(false);
  };
  

  return (
    <>
      <MenuItemCardView
        item={item}
        itemCount={itemCount}
        onItemClick={onItemClick}
        onAddClick={() => {
          if (item.hasComplements) {
            setIsComplementModalOpen(true);
          } else {
            onAddToCart(item);
          }
        }}
        onRemoveClick={handleRemoveClick}
        onShareClick={() => setIsShareModalOpen(true)}
        guests={guests}
      />
      {item.hasComplements && (
        <ComplementModal
          isOpen={isComplementModalOpen}
          onClose={() => setIsComplementModalOpen(false)}
          complements={item.complements!}
          onSelect={(selectedComplements) => {
            onAddToCart(item, selectedComplements, selectedGuests);
            setIsComplementModalOpen(false);
            setSelectedGuests([]);
          }}
        />
      )}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        guests={guests}
        onShare={(selectedGuests) => {
          setSelectedGuests(selectedGuests);
          setIsShareModalOpen(false);
          if (item.hasComplements) {
            setIsComplementModalOpen(true);
          } else {
            onAddToCart(item, undefined, selectedGuests);
            setSelectedGuests([]);
          }
        }}
      />
      <RemoveItemModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        items={similarItems}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
