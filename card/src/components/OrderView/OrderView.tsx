
import { useState, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  Toolbar,
  AppBar,
  TextField,
  Badge,
  MenuItem as MUIMenuItem,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { MenuItemCardContainer } from "./MenuItemCardContainer";
import { ComplementModal } from "./ComplementModal";
import { OrderSummaryModal } from "./SummaryModal";
import { ShareModal } from "./ShareModal";
import { ItemDetailModal } from "./ItemDetailModal";
import { MenuItem, CartItem, Guest, Complement } from "@/types/types";
import { OrderViewProps } from "@/types/props";
import { BillView } from "@/components/BillView/BillView"
import { PaymentOptionsModal } from "@/components/BillView/PaymentOptionsModal";
import { GuestSummaryModal } from "./GuestSummaryModal";
import { SettingsModal } from "./SettingsModal";
import useAxios from "@/hooks/useAxios";
import { useConfirmedOrders } from "@/hooks/useConfirmedOrders";
import { useCancelOrderItem } from "@/hooks/useCancelOrderItem";
import { useGuestsWithOrders } from "@/hooks/useGuestsWithOrders";

export default function OrderView({ menuItems, guests }: OrderViewProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modals, setModals] = useState({
    orderSummary: false,
    share: false,
    complement: false,
    itemDetail: false,
    guestSummary: false,
    settings: false,
  });
  const axiosInstance = useAxios();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const orderId = userData.orderId || null;
  const { guestsWithOrders } = useGuestsWithOrders(orderId);
  const { confirmedOrders, refreshConfirmedOrders } = useConfirmedOrders(orderId);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedItemComments, setSelectedItemComments] = useState<string>("");
  const [sharedWithGuests, setSharedWithGuests] = useState<Guest[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [billViewOpen, setBillViewOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"full" | "split" | "specific">("full");
  const [selectedGuests, setSelectedGuests] = useState<number[]>([0]);
  const { cancelOrderItem } = useCancelOrderItem(orderId);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const uniqueCategories = Array.from(new Set(menuItems.map((item) => item.category)));
  const openModal = (name: keyof typeof modals) => setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name: keyof typeof modals) => setModals((prev) => ({ ...prev, [name]: false }));
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const enrichedGuests = [
    ...guestsWithOrders,
  ];
  console.log(selectedGuests); 
  const handleAddToCart = (
    item: MenuItem,
    complements: Complement[] = [],
    sharedWith: Guest[] = [],
    comments: string = ""
  ) => {
    setCartItems((prev) => [
      ...prev,
      {
        uniqueId: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        complement: complements.length > 0 ? complements : null,
        sharedWith: sharedWith.length > 0 ? sharedWith : null,
        comments: comments || null,
        status: "pendiente",
      },
    ]);
    setSelectedItemComments("");
    setSharedWithGuests([]);
  };

  const handleRemoveFromCart = (uniqueId: string) => {
    setCartItems((prev) => prev.filter((cartItem) => cartItem.uniqueId !== uniqueId));
  };
  const handleRoomServiceClick = async () => {
    await axiosInstance.post(`/api/tables/call-waiter`);
  }
  const handleConfirmOrder = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const orderId = userData.orderId || null;
      if (!orderId) {
        throw new Error("Order ID is missing.");
      }

      const response = await axiosInstance.post(`/api/orders/${orderId}/add-items`, {
        items: cartItems,
      });

      if (response.status === 200) {
        console.log("Order items confirmed:", response.data);
        refreshConfirmedOrders();
        setCartItems([]);
        closeModal("orderSummary");
      } else {
        alert("Error confirming order. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("An error occurred while confirming the order.");
    }
  };
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    openModal("itemDetail");
  };

  const handleShareItem = (selectedGuests: Guest[]) => {
    if (selectedItem) {
      setSharedWithGuests(selectedGuests);
      if ((selectedItem.complements ?? []).length > 0) {
        openModal("complement");
      } else {
        handleAddToCart(selectedItem, [], selectedGuests, selectedItemComments);
      }
    }
    closeModal("share");
  };

  const handleSelectComplements = (selectedComplements: Complement[]) => {
    if (selectedItem) {
      handleAddToCart(selectedItem, selectedComplements, sharedWithGuests, selectedItemComments);
    }
    closeModal("complement");
    closeModal("itemDetail");
  };

  const handleAddItemFromDetail = (comments: string) => {
    if (selectedItem) {
      const hasComplements = (selectedItem.complements ?? []).length > 0;

      if (hasComplements) {
        setSelectedItemComments(comments);
        closeModal("itemDetail");
        openModal("complement");
      } else {
        handleAddToCart(selectedItem, [], [], comments);
        closeModal("itemDetail");
      }
    }
  };
  const scrollToCategory = (category: string) => {
    const categoryElement = categoryRefs.current[category];
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth" });
    }
    handleMenuClose();
  };
  useEffect(() => {
    console.log("Confirmed orders in OrderView:", confirmedOrders);
  }, [confirmedOrders]);
  const handleCloseModal = () => {
    console.log("Cambiando billViewOpen a false");
    setBillViewOpen(false);
    console.log(billViewOpen)
  };
  const handleRemoveItem = (uniqueId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.uniqueId !== uniqueId)
    );
  };
  const handlePay = () => {
    setBillViewOpen(false);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = (type: "full" | "split" | "specific", options?: any) => {
    console.log("Procesando pago con tipo:", type, "y opciones:", options);
    setPaymentModalOpen(false);
  };
  const handlePayAccount = async () => {
    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('El pago no se pudo realizar. Inténtalo nuevamente.');
      }
      alert('¡Pago realizado con éxito!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Box
      sx={{
        height: '100%',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "16px",
        bgcolor: 'background.default',
        color: 'primary.contrastText',
        overflow: 'hidden',
      }}>
      <AppBar position="static" sx={{ backgroundColor: "inherit", boxShadow: "none" }}>
        <Toolbar>
          <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-start", gap: 1 }}>
            <IconButton
              sx={{
                color: (theme) => theme.palette.action.active,
              }}
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              sx={{
                color: (theme) => theme.palette.action.active,
              }}
              aria-label="guests"
              onClick={() => openModal("guestSummary")}
            >
              <PeopleIcon />
            </IconButton>
            <IconButton
              sx={{
                color: (theme) => theme.palette.action.active,
              }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              sx={{
                color: (theme) => theme.palette.action.active,
              }}
              onClick={() => openModal("settings")}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
          <IconButton
            sx={{
              color: (theme) => theme.palette.action.active,
            }}
            aria-label="notifications"
            onClick={() => handleRoomServiceClick()}
          >
            <RoomServiceIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {isSearchOpen && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search menu..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {uniqueCategories.map((category) => (
          <MUIMenuItem key={category} onClick={() => scrollToCategory(category)}>
            {category}
          </MUIMenuItem>
        ))}
      </Menu>
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', maxHeight: "100vh" }}>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px))" gap={4}>
          {uniqueCategories.map((category) => {
            const filteredItems = menuItems.filter(
              (item) =>
                item.category === category &&
                (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            if (filteredItems.length === 0) {
              return null;
            }
            return (
              <div key={category} ref={(el) => (categoryRefs.current[category] = el)}>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 2,
                    mb: 2,
                    gridColumn: "1 / -1",
                    color: "text.primary"
                  }}
                >
                  {category}
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(auto-fit, minmax(300px))"
                  gap={4}>
                  {filteredItems.map((item) => (
                    <MenuItemCardContainer
                      key={item.id}
                      item={item}
                      cartItems={cartItems}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      onItemClick={() => handleItemClick(item)}
                      guests={guests}
                    />
                  ))}
                </Box>

              </div>
            );
          })}
        </Box>
        <ItemDetailModal
          isOpen={modals.itemDetail}
          item={selectedItem}
          onClose={() => closeModal("itemDetail")}
          onAdd={handleAddItemFromDetail}
          onShare={(comments) => {
            setSelectedItemComments(comments);
            closeModal("itemDetail");
            openModal("share");
          }}
          onSelectComplement={(comments) => {
            setSelectedItemComments(comments);
            closeModal("itemDetail");
            openModal("complement");
          }}
          guests={guests}
        />
        <ComplementModal
          isOpen={modals.complement}
          onClose={() => {
            closeModal("complement");
            closeModal("itemDetail");
          }}
          complements={selectedItem?.complements || []}
          onSelect={handleSelectComplements}
        />
        <ShareModal
          isOpen={modals.share}
          onClose={() => closeModal("share")}
          guests={guests}
          onShare={handleShareItem}
        />
        <OrderSummaryModal
          isOpen={modals.orderSummary}
          onClose={() => closeModal("orderSummary")}
          cartItems={cartItems}
          onConfirmOrder={handleConfirmOrder}
          onRemoveItem={handleRemoveItem}
        />
      </Box>
      {billViewOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1300,
          }}
        >
          <BillView
            orders={confirmedOrders}
            onClose={handleCloseModal}
            onCancelItem={(itemId) => cancelOrderItem(itemId)}
            handlePayAccount={handlePayAccount}
            toggleModal={handlePay}
            numOfGuests={guests.length}
          />
        </Box>
      )}
      <PaymentOptionsModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setSelectedGuests={setSelectedGuests}
        guests={enrichedGuests}
        onConfirm={handleConfirmPayment}
      />
      <GuestSummaryModal
        isOpen={modals.guestSummary}
        onClose={() => closeModal("guestSummary")}
        guests={guestsWithOrders}
      />
      <SettingsModal
        isOpen={modals.settings}
        onClose={() => closeModal("settings")}
        userData={userData}
      />
      <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Box sx={{ position: "relative", flex: 1, maxWidth: "50%" }}>

          <Badge
            color="secondary"
            badgeContent={confirmedOrders.length}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              "& .MuiBadge-badge": {
                fontSize: "0.8rem",
                height: "20px",
                minWidth: "20px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              console.log("setBillViewOpen");
              setBillViewOpen(true);
            }}
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              width: "100%",
              height: "100%",
              textAlign: "center",
            }}
          >
            Cuenta
          </Button>
        </Box>
          <Box sx={{ position: "relative", flex: 1, maxWidth: "50%" }}>
            <Badge
              color="secondary"
              badgeContent={cartItems.length}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                "& .MuiBadge-badge": {
                  fontSize: "0.8rem",
                  height: "20px",
                  minWidth: "20px",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => openModal("orderSummary")}
              startIcon={<ReceiptIcon />}
              sx={{
                bgcolor: (theme) => theme.palette.primary.main,
                width: "100%",
                height: "100%",
                textAlign: "center",
              }}            >
              Pedir
            </Button>
          </Box>
      </Toolbar>
    </Box>
  );
}